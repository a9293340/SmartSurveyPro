// 臨時類型定義，直到共享包模組解析問題解決
import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
  status: string;
  systemRole: string;
  emailVerified: boolean;
  preferences: Record<string, unknown>;
  stats: {
    lastLoginAt?: Date;
    lastActivityAt?: Date;
    loginCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: string;
  systemRole: string;
  emailVerified: boolean;
  preferences: Record<string, unknown>;
  stats: {
    lastLoginAt?: Date;
    lastActivityAt?: Date;
    loginCount: number;
  };
  lastActivity: Date;
}

export interface Group {
  _id: ObjectId;
  name: string;
  subscriptionTier: string;
  limits: Record<string, unknown>;
  stats?: Record<string, unknown>;
  status?: string;
}

export interface UserGroupRole {
  _id: ObjectId;
  userId: ObjectId | string;
  groupId: ObjectId | string;
  roleId: ObjectId | string;
  status: string;
  joinedAt: Date;
}

export interface Role {
  _id: ObjectId;
  name: string;
  description?: string;
  permissions: string[];
  isCustom?: boolean;
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum UserGroupStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}
