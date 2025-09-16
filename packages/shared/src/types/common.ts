/**
 * 共用類型定義
 * 包含所有實體共用的基礎類型和介面
 */

// === 基礎時間戳介面 ===
export interface Timestamps {
  /** 創建時間 */
  createdAt: Date;
  /** 最後更新時間 */
  updatedAt: Date;
}

// === 通用狀態類型 ===
export enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

// === 分頁和查詢相關 ===
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

// === API 響應格式 ===
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

// === 資源識別相關 ===
export type EntityId = string;

export interface WithId {
  id: EntityId;
}

// === 軟刪除支援 ===
export interface SoftDelete {
  /** 是否已刪除 */
  isDeleted: boolean;
  /** 刪除時間 */
  deletedAt?: Date;
  /** 刪除者 ID */
  deletedBy?: EntityId;
}

// === 審計記錄 ===
export interface AuditFields {
  /** 創建者 ID */
  createdBy?: EntityId;
  /** 最後更新者 ID */
  updatedBy?: EntityId;
}

// === 完整基礎實體介面 ===
export interface BaseEntity extends WithId, Timestamps, AuditFields {
  // 所有實體的共同基礎
}

// === 帶軟刪除的基礎實體 ===
export interface BaseEntityWithSoftDelete extends BaseEntity, SoftDelete {
  // 支援軟刪除的實體基礎
}

// === 統計相關 ===
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

// === 文件/媒體相關 ===
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

// === 地理位置相關 ===
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

// === 聯絡資訊 ===
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

// === 常用設定格式 ===
export interface Settings {
  [key: string]: unknown;
}

// === 通知相關 ===
export enum NotificationType {
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
