/**
 * 用戶註冊 API
 * 處理新用戶註冊，包含資料驗證、密碼加密、預設群組建立
 */

import { connectToDatabase } from '../../../../server/lib/database';
import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { hashPassword } from '../../utils/password';

// 註冊請求驗證 schema
const RegisterRequestSchema = z.object({
  email: z.string().email('請提供有效的 email 地址'),
  password: z.string().min(8, '密碼長度至少 8 字元'),
  name: z.string().min(1, '姓名不能為空').max(100, '姓名長度不能超過 100 字元'),
  acceptTerms: z.boolean().refine(val => val === true, '必須同意服務條款'),
});

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'POST');

    const body = (await readBody(event)) as z.infer<typeof RegisterRequestSchema>;

    // 1. 驗證輸入資料
    const validationResult = RegisterRequestSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: '輸入資料格式錯誤',
        data: validationResult.error.flatten(),
      });
    }

    // 2. Email 唯一性檢查
    const { email, name, password } = validationResult.data;

    // TODO(future): 註冊頻率限制 [Phase 2 開放註冊時] [詳見 /docs/TODO.md]
    // 目前無註冊頻率限制，Phase 2 開放註冊時應加入：
    // - IP 註冊頻率限制 (key: `register_ip:${clientIP}`, 每IP每小時最多3個帳號)
    // - Email 域名黑名單檢查
    // - 臨時郵箱檢測 API 整合
    // - CAPTCHA 整合（多次失敗後啟用）

    // 連接資料庫
    const db = (await connectToDatabase()) as Db;
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: '資料庫連接失敗',
      });
    }
    const usersCollection = db.collection('users');

    // 檢查 Email 是否已存在（大小寫不敏感）
    const existingUser = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: '此 Email 地址已被註冊',
      });
    }

    // 3. 密碼加密
    const passwordHash = await hashPassword(password);

    // 4. 建立用戶記錄
    const now = new Date();
    const userId = new ObjectId();

    const newUser = {
      _id: userId,
      email: email.toLowerCase(), // 統一使用小寫存儲
      name,
      passwordHash,
      status: 'unverified',
      systemRole: 'user',
      emailVerified: false,
      preferences: {
        language: 'zh-TW',
        timezone: 'Asia/Taipei',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h',
        theme: 'auto',
        notifications: {
          email: true,
          browser: true,
          mobile: true,
        },
        showOnboarding: true,
        sidebarCollapsed: false,
      },
      stats: {
        groupCount: 0,
        surveyCount: 0,
        responseCount: 0,
        loginCount: 0,
      },
      security: {
        twoFactorEnabled: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    // 5. 建立預設個人群組
    // 6. 建立用戶-群組關聯
    // 7. Email 驗證機制

    // 插入用戶記錄
    await usersCollection.insertOne(newUser);

    // 8. 生成 JWT tokens
    const accessToken = generateAccessToken({
      userId: userId.toString(),
      email: newUser.email,
    });

    const refreshToken = generateRefreshToken({
      userId: userId.toString(),
      tokenId: `refresh_${Date.now()}`, // 唯一的 refresh token ID
    });

    // 9. 回傳安全的用戶資訊（不包含敏感資料）
    return {
      success: true,
      message: '註冊成功',
      user: {
        id: userId.toString(),
        email: newUser.email,
        name: newUser.name,
        status: newUser.status,
        emailVerified: newUser.emailVerified,
        createdAt: newUser.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600, // 1小時
      },
    };
  } catch (error) {
    console.error('註冊 API 錯誤:', error);

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
