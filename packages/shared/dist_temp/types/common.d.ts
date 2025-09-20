/**
 * 共用類型定義
 * 包含所有實體共用的基礎類型和介面
 */
export interface Timestamps {
  /** 創建時間 */
  createdAt: Date;
  /** 最後更新時間 */
  updatedAt: Date;
}
export declare enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
export type EntityId = string;
export interface WithId {
  id: EntityId;
}
export interface SoftDelete {
  /** 是否已刪除 */
  isDeleted: boolean;
  /** 刪除時間 */
  deletedAt?: Date;
  /** 刪除者 ID */
  deletedBy?: EntityId;
}
export interface AuditFields {
  /** 創建者 ID */
  createdBy?: EntityId;
  /** 最後更新者 ID */
  updatedBy?: EntityId;
}
export interface BaseEntity extends WithId, Timestamps, AuditFields {}
export interface BaseEntityWithSoftDelete extends BaseEntity, SoftDelete {}
export interface CountStats {
  /** 總數 */
  total: number;
  /** 活躍數 */
  active: number;
  /** 待處理數 */
  pending: number;
  /** 已封鎖數 */
  blocked: number;
}
export interface FileInfo {
  /** 檔案名稱 */
  filename: string;
  /** 原始檔名 */
  originalName: string;
  /** MIME 類型 */
  mimeType: string;
  /** 檔案大小 (bytes) */
  size: number;
  /** 檔案 URL */
  url: string;
  /** 上傳時間 */
  uploadedAt: Date;
}
export interface GeoLocation {
  /** 緯度 */
  latitude: number;
  /** 經度 */
  longitude: number;
  /** 地址 */
  address?: string;
  /** 城市 */
  city?: string;
  /** 國家 */
  country?: string;
  /** 郵遞區號 */
  zipCode?: string;
}
export interface ContactInfo {
  /** 電話號碼 */
  phone?: string;
  /** 地址 */
  address?: string;
  /** 網站 */
  website?: string;
  /** 社群媒體連結 */
  socialLinks?: Record<string, string>;
}
export interface Settings {
  [key: string]: unknown;
}
export declare enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}
export interface NotificationPreferences {
  /** email 通知 */
  email: boolean;
  /** 瀏覽器推播 */
  browser: boolean;
  /** 手機推播 */
  mobile: boolean;
}
