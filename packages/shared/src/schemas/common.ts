/**
 * 共用 Zod 驗證 schemas
 * 包含所有基礎類型的驗證規則
 */

import { z } from 'zod';

// === 基礎驗證規則 ===
export const EntityIdSchema = z.string().min(1, '實體 ID 不能為空');

export const TimestampsSchema = z.object({
  createdAt: z.date({
    required_error: '創建時間為必填',
    invalid_type_error: '創建時間格式錯誤',
  }),
  updatedAt: z.date({
    required_error: '更新時間為必填',
    invalid_type_error: '更新時間格式錯誤',
  }),
});

export const BaseStatusSchema = z.enum(['active', 'inactive', 'pending', 'blocked', 'deleted'], {
  errorMap: () => ({ message: '無效的狀態值' }),
});

// === 分頁查詢 schemas ===
export const PaginationQuerySchema = z.object({
  page: z.number().min(1, '頁碼必須大於 0').optional(),
  limit: z.number().min(1, '每頁數量必須大於 0').max(100, '每頁數量不能超過 100').optional(),
  sortBy: z.string().optional(),
  sortOrder: z
    .enum(['asc', 'desc'], {
      errorMap: () => ({ message: '排序方向只能是 asc 或 desc' }),
    })
    .optional(),
});

export const PaginationResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().min(1),
      limit: z.number().min(1),
      total: z.number().min(0),
      totalPages: z.number().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

// === API 響應格式 schemas ===
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema?: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema ? dataSchema.optional() : z.unknown().optional(),
    message: z.string().optional(),
    errors: z
      .array(
        z.object({
          field: z.string().optional(),
          message: z.string(),
          code: z.string().optional(),
        })
      )
      .optional(),
  });

export const ApiErrorSchema = z.object({
  code: z.string().min(1, '錯誤代碼不能為空'),
  message: z.string().min(1, '錯誤訊息不能為空'),
  details: z.record(z.any()).optional(),
});

// === 識別相關 schemas ===
export const WithIdSchema = z.object({
  id: EntityIdSchema,
});

export const SoftDeleteSchema = z.object({
  isDeleted: z.boolean(),
  deletedAt: z.date().optional(),
  deletedBy: EntityIdSchema.optional(),
});

export const AuditFieldsSchema = z.object({
  createdBy: EntityIdSchema.optional(),
  updatedBy: EntityIdSchema.optional(),
});

// === 完整基礎實體 schema ===
export const BaseEntitySchema = WithIdSchema.merge(TimestampsSchema).merge(AuditFieldsSchema);

export const BaseEntityWithSoftDeleteSchema = BaseEntitySchema.merge(SoftDeleteSchema);

// === 統計相關 schemas ===
export const CountStatsSchema = z.object({
  total: z.number().min(0, '總數不能為負數'),
  active: z.number().min(0, '活躍數不能為負數'),
  pending: z.number().min(0, '待處理數不能為負數'),
  blocked: z.number().min(0, '已封鎖數不能為負數'),
});

// === 文件/媒體相關 schemas ===
export const FileInfoSchema = z.object({
  filename: z.string().min(1, '檔案名稱不能為空'),
  originalName: z.string().min(1, '原始檔名不能為空'),
  mimeType: z.string().min(1, 'MIME 類型不能為空'),
  size: z.number().min(0, '檔案大小不能為負數'),
  url: z.string().url('無效的檔案 URL'),
  uploadedAt: z.date(),
});

// === 地理位置相關 schemas ===
export const GeoLocationSchema = z.object({
  latitude: z.number().min(-90, '緯度必須在 -90 到 90 之間').max(90, '緯度必須在 -90 到 90 之間'),
  longitude: z
    .number()
    .min(-180, '經度必須在 -180 到 180 之間')
    .max(180, '經度必須在 -180 到 180 之間'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

// === 聯絡資訊 schemas ===
export const ContactInfoSchema = z.object({
  phone: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, '無效的電話號碼格式')
    .optional(),
  address: z.string().max(500, '地址長度不能超過 500 字元').optional(),
  website: z.string().url('無效的網站 URL').optional(),
  socialLinks: z.record(z.string().url('無效的社群媒體連結')).optional(),
});

// === 設定格式 schema ===
export const SettingsSchema = z.record(z.unknown());

// === 通知相關 schemas ===
export const NotificationTypeSchema = z.enum(['info', 'warning', 'error', 'success'], {
  errorMap: () => ({ message: '無效的通知類型' }),
});

export const NotificationPreferencesSchema = z.object({
  email: z.boolean(),
  browser: z.boolean(),
  mobile: z.boolean(),
});

// === 常用驗證函數 ===
export const createOptionalSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional();
};

export const createArraySchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
  options?: { min?: number; max?: number }
) => {
  let arraySchema = z.array(itemSchema);

  if (options?.min !== undefined) {
    arraySchema = arraySchema.min(options.min, `至少需要 ${options.min} 個項目`);
  }

  if (options?.max !== undefined) {
    arraySchema = arraySchema.max(options.max, `最多只能有 ${options.max} 個項目`);
  }

  return arraySchema;
};

// === 日期範圍驗證 ===
export const DateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine(data => data.startDate <= data.endDate, {
    message: '開始日期必須早於或等於結束日期',
    path: ['startDate'],
  });

// === Email 驗證 ===
export const EmailSchema = z
  .string()
  .email('無效的 email 格式')
  .min(1, 'Email 不能為空')
  .max(255, 'Email 長度不能超過 255 字元');

// === 密碼驗證 ===
export const PasswordSchema = z
  .string()
  .min(8, '密碼至少需要 8 個字元')
  .max(128, '密碼長度不能超過 128 字元')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密碼必須包含至少一個小寫字母、一個大寫字母和一個數字');

// === URL 驗證 ===
export const UrlSchema = z.string().url('無效的 URL 格式');

// === 顏色代碼驗證 ===
export const ColorCodeSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '無效的顏色代碼格式，請使用 #RRGGBB 或 #RGB 格式');

// === 時區驗證 ===
export const TimezoneSchema = z.string().refine(
  timezone => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  },
  { message: '無效的時區' }
);

// === 語言代碼驗證 ===
export const LanguageCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, '無效的語言代碼格式，請使用 ISO 639-1 格式（如：zh-TW）');

// === 預設值 ===
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  sortOrder: 'desc' as const,
};

// === 驗證輔助函數 ===
export const validateEntity = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
  };
};

export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown) => {
    const result = validateEntity(schema, data);
    if (!result.success) {
      throw new Error(`驗證失敗: ${result.errors.join(', ')}`);
    }
    return result.data;
  };
};
