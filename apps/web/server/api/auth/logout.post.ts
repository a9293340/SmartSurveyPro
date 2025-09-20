/**
 * 用戶登出 API
 * 驗證用戶身份並執行登出流程
 *
 * 實作邏輯：
 * 1. 驗證 JWT Token 確認用戶身份
 * 2. 記錄登出活動（IP、時間等）
 * 3. 回傳成功訊息
 *
 * Phase 2 將加入：
 * - Token 黑名單機制
 * - Redis Session 清理
 * - Refresh Token 撤銷
 */

import { extractTokenFromHeader, verifyAccessToken } from '../../utils/jwt';
import { getClientIP } from '../../utils/client-ip';
import { connectToDatabase } from '@smartsurvey/shared/server';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    // 1. 從 Authorization header 提取並驗證 JWT token
    const authHeader = getHeader(event, 'authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: '未提供認證 Token',
      });
    }

    // 2. 驗證 Token 有效性並取得用戶資訊
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token 無效或已過期',
      });
    }

    // 3. 記錄登出活動（基礎版本）
    const logoutInfo = {
      userId: payload.userId,
      email: payload.email,
      timestamp: new Date(),
      ip: getClientIP(event),
      userAgent: getHeader(event, 'user-agent') || 'unknown',
    };

    // 在開發階段暫時使用 console，Phase 2 改用專業日誌系統
    console.log('[登出活動]', {
      userId: logoutInfo.userId,
      email: logoutInfo.email,
      timestamp: logoutInfo.timestamp.toISOString(),
      ip: logoutInfo.ip,
    });

    // TODO(future): Token 黑名單機制 [Phase 2 安全性強化] [詳見 /docs/TODO.md]
    // Phase 2 應加入：
    // - Redis Set 儲存已撤銷的 Token ID (key: `blacklist:${tokenId}`)
    // - Token Family 概念防止 Refresh Token 重用
    // - 登出時立即撤銷所有相關 Token
    // - 設定 TTL 自動清理過期項目

    // TODO(future): Session 清理機制 [Phase 2 Redis 整合] [詳見 /docs/TODO.md]
    // Phase 2 應加入：
    // - 清除 Redis 中的用戶 Session 快取
    // - 清除 me.get.ts API 的快取資料
    // - 清除工作區選擇狀態

    // 4. 更新用戶最後活動時間（可選）
    try {
      const db = await connectToDatabase();
      await db.collection('users').updateOne(
        { _id: ObjectId.createFromHexString(payload.userId) },
        {
          $set: {
            lastLogoutAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } catch (dbError) {
      // 資料庫更新失敗不影響登出流程
      console.error('更新用戶登出時間失敗:', dbError);
    }

    // 5. 回傳成功訊息
    return {
      success: true,
      message: '登出成功',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('登出失敗:', error);

    // 檢查是否為 H3Error（Nuxt/Nitro 錯誤）
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
