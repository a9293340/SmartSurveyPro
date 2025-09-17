/**
 * 用戶登入 API
 * 處理用戶登入驗證，生成 JWT tokens
 */

import { z } from 'zod';
import { connectToDatabase, type User, UserStatus, type AuthUser } from '@smartsurvey/shared';
import { verifyPassword } from '../../utils/password';
import { generateTokenPair } from '../../utils/jwt';

// 登入請求驗證 schema
const LoginRequestSchema = z.object({
  email: z.string().email('請提供有效的 email 地址'),
  password: z.string().min(1, '密碼不能為空'),
  rememberMe: z.boolean().optional().default(false),
});

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    const body = await readBody(event);

    // 1. 驗證輸入資料
    const validationResult = LoginRequestSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '輸入資料格式錯誤',
        data: validationResult.error.flatten(),
      });
    }

    const { email, password } = validationResult.data;

    // TODO(future): 登入失敗計數與鎖定 [Phase 2 安全性強化] [詳見 /docs/TODO.md]
    // 目前無登入失敗限制，Phase 2 應加入：
    // - Redis 計數器追蹤失敗次數 (key: `login_attempts:${email}`)
    // - IP 基礎的速率限制
    // - 帳號暫時鎖定機制（5次失敗鎖定15分鐘）
    // - 併發登入設備數限制

    // 2. 查詢用戶記錄
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne(
      { email: email.toLowerCase() },
      {
        projection: {
          _id: 1,
          email: 1,
          name: 1,
          passwordHash: 1,
          avatar: 1,
          status: 1,
          systemRole: 1,
          emailVerified: 1,
          preferences: 1,
          stats: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email 或密碼錯誤',
      });
    }

    // 3. 密碼驗證
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email 或密碼錯誤',
      });
    }

    // 4. 檢查用戶狀態
    if (user.status === UserStatus.SUSPENDED) {
      throw createError({
        statusCode: 403,
        statusMessage: '帳號已被暫停，請聯絡客服',
      });
    }

    if (user.status === UserStatus.DELETED) {
      throw createError({
        statusCode: 403,
        statusMessage: '帳號已被刪除',
      });
    }

    if (!user.emailVerified) {
      throw createError({
        statusCode: 403,
        statusMessage: '請先驗證您的 Email 地址',
        data: { requireEmailVerification: true },
      });
    }

    // 5. 更新最後登入時間
    const now = new Date();
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          'stats.lastLoginAt': now,
          'stats.lastActivityAt': now,
          updatedAt: now,
        },
        $inc: {
          'stats.loginCount': 1,
        },
      }
    );

    // 6. 生成 JWT tokens
    const tokens = generateTokenPair(user._id.toString(), user.email);

    // 7. 建構安全的用戶資訊
    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      status: user.status,
      systemRole: user.systemRole,
      emailVerified: user.emailVerified,
      preferences: user.preferences,
      stats: {
        ...user.stats,
        lastLoginAt: now,
        lastActivityAt: now,
        loginCount: user.stats.loginCount + 1,
      },
      lastActivity: now,
    };

    // 8. 回傳成功結果
    return {
      success: true,
      message: '登入成功',
      data: {
        user: authUser,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
          tokenType: 'Bearer' as const,
        },
      },
    };
  } catch (error: any) {
    console.error('登入 API 錯誤:', error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
