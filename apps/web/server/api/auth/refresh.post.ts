/**
 * Token 刷新 API - 模板版本
 * 使用 refresh token 生成新的 access token
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { verifyRefreshToken, generateAccessToken } from '../../utils/jwt';

const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token 不能為空'),
});

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    const body = await readBody(event);
    const validation = RefreshRequestSchema.safeParse(body);

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '無效的請求資料',
      });
    }

    const { refreshToken } = validation.data;

    // 1. 驗證 Refresh Token 有效性
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token 無效或已過期',
      });
    }

    // TODO(future): Token 黑名單檢查 [Phase 2 安全性強化] [詳見 /docs/TODO.md]
    // 目前 Token 撤銷檢查功能待實作，Phase 2 應加入：
    // - 檢查 Redis 中是否存在已撤銷的 Token (key: `blacklist:${tokenId}`)
    // - Token Family 驗證防止重用攻擊
    // - 記錄 Refresh Token 使用歷史
    // - 異常使用模式檢測

    // 2. 驗證用戶是否仍然有效
    const { connectToDatabase } = await import('@smartsurvey/shared');
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
      { _id: ObjectId.createFromHexString(payload.userId) },
      { projection: { _id: 1, email: 1, status: 1 } }
    );

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: '用戶不存在',
      });
    }

    if (user.status !== 'active') {
      throw createError({
        statusCode: 403,
        statusMessage: '用戶帳號已被停用',
      });
    }

    // 3. 生成新的 Access Token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: user.email,
    });

    // 4. 更新 Refresh Token 使用記錄
    const now = new Date();

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          'stats.lastActivityAt': now,
          updatedAt: now,
        },
      }
    );

    // TODO(future): 記錄 Refresh Token 使用歷史到 Redis
    // const clientIP = getClientIP(event);
    // await recordRefreshTokenUsage(payload.tokenId, clientIP, now);

    return {
      success: true,
      accessToken: newAccessToken,
      expiresIn: 900, // 15 minutes in seconds
      message: 'Token 刷新成功',
    };
  } catch (error: any) {
    console.error('Token 刷新失敗:', error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
