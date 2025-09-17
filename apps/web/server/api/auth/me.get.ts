/**
 * 獲取當前用戶資訊 API
 * 透過 JWT token 驗證身份並回傳用戶資料
 *
 * 用途：
 * 1. 前端應用啟動時確認用戶登入狀態
 * 2. 路由守衛中的權限檢查
 * 3. 用戶資料同步更新
 * 4. Token 有效性驗證
 */

import {
  connectToDatabase,
  type User,
  UserStatus,
  type AuthUser,
  type Group,
  type UserGroupRole,
  UserGroupStatus,
  type Role,
} from '@smartsurvey/shared';
import { extractTokenFromHeader, verifyAccessToken } from '../../utils/jwt';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async event => {
  try {
    assertMethod(event, 'GET');

    // 1. 從 Authorization header 提取 JWT token
    const authHeader = getHeader(event, 'authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: '未提供認證 Token',
      });
    }

    // 2. 驗證 JWT token 有效性
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token 無效或已過期',
      });
    }

    // 3. 查詢用戶記錄
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // 使用 ObjectId 查詢
    const user = await usersCollection.findOne(
      { _id: new ObjectId(payload.userId) },
      {
        projection: {
          // 排除敏感資料
          passwordHash: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
          verificationToken: 0,
        },
      }
    );

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: '用戶不存在',
      });
    }

    // 檢查用戶狀態
    if (user.status === UserStatus.SUSPENDED) {
      throw createError({
        statusCode: 403,
        statusMessage: '帳號已被暫停',
      });
    }

    if (user.status === UserStatus.DELETED) {
      throw createError({
        statusCode: 403,
        statusMessage: '帳號已被刪除',
      });
    }

    // TODO(future): Workspace 工作區模式重構 [Phase 2 架構重構] [詳見 /docs/TODO.md]
    // 目前採用全域權限模式（權限並集），但應改為 Workspace 選擇模式：
    // - 用戶登入後選擇工作區，只能操作當前工作區資源
    // - me.get.ts 應返回 currentWorkspace + availableWorkspaces
    // - 權限檢查從全域改為工作區隔離，提升用戶體驗和資料安全性

    // TODO(future): Redis Session 快取 [Phase 2 效能優化] [詳見 /docs/TODO.md]
    // 目前每次呼叫都會查詢資料庫，Phase 2 引入 Redis 後應加入快取機制
    // 預計減少 90% 的資料庫查詢，大幅提升效能

    // 查詢用戶所屬的群組和角色
    const userGroupRolesCollection = db.collection<UserGroupRole>('user_group_roles');
    const groupsCollection = db.collection<Group>('groups');
    const rolesCollection = db.collection<Role>('roles');

    // 1. 查詢用戶的所有群組關聯（只查詢活躍狀態）
    const userGroupRoles = await userGroupRolesCollection
      .find({
        userId: user._id.toString(),
        status: UserGroupStatus.ACTIVE,
      })
      .toArray();

    // 2. 收集所有群組 ID 和角色 ID
    // 注意：在 MongoDB 中，ID 可能儲存為 string 或 ObjectId
    const groupIds = userGroupRoles.map(ugr => {
      // 如果已經是 ObjectId 就直接使用，否則轉換
      return typeof ugr.groupId === 'string' ? new ObjectId(ugr.groupId) : ugr.groupId;
    });
    const roleIds = userGroupRoles.map(ugr => {
      return typeof ugr.roleId === 'string' ? new ObjectId(ugr.roleId) : ugr.roleId;
    });

    // 3. 批量查詢群組和角色資訊
    const [groups, roles] = await Promise.all([
      groupsCollection
        .find(
          { _id: { $in: groupIds } },
          {
            projection: {
              name: 1,
              subscriptionTier: 1,
              limits: 1,
              stats: 1,
              status: 1,
            },
          }
        )
        .toArray(),
      rolesCollection
        .find(
          { _id: { $in: roleIds } },
          {
            projection: {
              name: 1,
              description: 1,
              permissions: 1,
              isCustom: 1,
            },
          }
        )
        .toArray(),
    ]);

    // 4. 建立快速查詢 Map
    const groupMap = new Map(groups.map(g => [g._id.toString(), g]));
    const roleMap = new Map(roles.map(r => [r._id.toString(), r]));

    // 5. 組合用戶群組資訊
    const userGroups = userGroupRoles
      .map(ugr => {
        const group = groupMap.get(ugr.groupId.toString());
        const role = roleMap.get(ugr.roleId.toString());

        if (!group || !role) return null;

        return {
          groupId: group._id.toString(),
          groupName: group.name,
          role: {
            id: role._id.toString(),
            name: role.name,
            description: role.description || '',
          },
          permissions: role.permissions || [],
          subscriptionTier: group.subscriptionTier,
          limits: group.limits,
          joinedAt: ugr.joinedAt,
        };
      })
      .filter(Boolean); // 過濾掉 null 值

    // 6. 整合所有權限（去重）
    const allPermissions = new Set<string>();
    const validUserGroups = userGroups.filter(Boolean) as NonNullable<(typeof userGroups)[0]>[];
    validUserGroups.forEach(ug => {
      if (ug && ug.permissions) {
        ug.permissions.forEach((p: string) => allPermissions.add(p));
      }
    });

    // 7. 找出用戶的主要群組（通常是第一個加入的群組）
    const primaryGroup = validUserGroups[0];

    // 4. 更新最後活動時間
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

    // 5. 建構安全的用戶資訊回傳
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
        lastActivityAt: now,
      },
      lastActivity: now,
    };

    return {
      success: true,
      message: '成功獲取用戶資訊',
      data: {
        user: authUser,
        // 群組和權限資訊
        groups: validUserGroups,
        permissions: Array.from(allPermissions),
        primaryGroup: primaryGroup
          ? {
              id: primaryGroup.groupId,
              name: primaryGroup.groupName,
              subscriptionTier: primaryGroup.subscriptionTier,
            }
          : null,
      },
    };
  } catch (error) {
    console.error('獲取用戶資訊失敗:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    });
  }
});
