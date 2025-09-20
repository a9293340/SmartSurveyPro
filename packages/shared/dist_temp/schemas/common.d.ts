/**
 * 共用 Zod 驗證 schemas
 * 包含所有基礎類型的驗證規則
 */
import { z } from 'zod';
export declare const EntityIdSchema: z.ZodString;
export declare const TimestampsSchema: z.ZodObject<
  {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    createdAt?: Date;
    updatedAt?: Date;
  },
  {
    createdAt?: Date;
    updatedAt?: Date;
  }
>;
export declare const BaseStatusSchema: z.ZodEnum<
  ['active', 'inactive', 'pending', 'blocked', 'deleted']
>;
export declare const PaginationQuerySchema: z.ZodObject<
  {
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<['asc', 'desc']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'desc' | 'asc';
  },
  {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'desc' | 'asc';
  }
>;
export declare const PaginationResultSchema: <T extends z.ZodTypeAny>(
  dataSchema: T
) => z.ZodObject<
  {
    data: z.ZodArray<T, 'many'>;
    pagination: z.ZodObject<
      {
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
      },
      'strip',
      z.ZodTypeAny,
      {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      },
      {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      }
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    data?: T['_output'][];
    pagination?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  },
  {
    data?: T['_input'][];
    pagination?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  }
>;
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(
  dataSchema?: T
) => z.ZodObject<
  {
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown> | z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    errors: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            field: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            code?: string;
            message?: string;
            field?: string;
          },
          {
            code?: string;
            message?: string;
            field?: string;
          }
        >,
        'many'
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    data?: unknown;
    message?: string;
    success?: boolean;
    errors?: {
      code?: string;
      message?: string;
      field?: string;
    }[];
  },
  {
    data?: unknown;
    message?: string;
    success?: boolean;
    errors?: {
      code?: string;
      message?: string;
      field?: string;
    }[];
  }
>;
export declare const ApiErrorSchema: z.ZodObject<
  {
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    code?: string;
    message?: string;
    details?: Record<string, any>;
  },
  {
    code?: string;
    message?: string;
    details?: Record<string, any>;
  }
>;
export declare const WithIdSchema: z.ZodObject<
  {
    id: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
  },
  {
    id?: string;
  }
>;
export declare const SoftDeleteSchema: z.ZodObject<
  {
    isDeleted: z.ZodBoolean;
    deletedAt: z.ZodOptional<z.ZodDate>;
    deletedBy: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
  },
  {
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
  }
>;
export declare const AuditFieldsSchema: z.ZodObject<
  {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    createdBy?: string;
    updatedBy?: string;
  },
  {
    createdBy?: string;
    updatedBy?: string;
  }
>;
export declare const BaseEntitySchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
  },
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
  }
>;
export declare const BaseEntityWithSoftDeleteSchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  } & {
    isDeleted: z.ZodBoolean;
    deletedAt: z.ZodOptional<z.ZodDate>;
    deletedBy: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    createdBy?: string;
    updatedBy?: string;
  },
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    createdBy?: string;
    updatedBy?: string;
  }
>;
export declare const CountStatsSchema: z.ZodObject<
  {
    total: z.ZodNumber;
    active: z.ZodNumber;
    pending: z.ZodNumber;
    blocked: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    total?: number;
    active?: number;
    pending?: number;
    blocked?: number;
  },
  {
    total?: number;
    active?: number;
    pending?: number;
    blocked?: number;
  }
>;
export declare const FileInfoSchema: z.ZodObject<
  {
    filename: z.ZodString;
    originalName: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    url: z.ZodString;
    uploadedAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    filename?: string;
    url?: string;
    size?: number;
    originalName?: string;
    mimeType?: string;
    uploadedAt?: Date;
  },
  {
    filename?: string;
    url?: string;
    size?: number;
    originalName?: string;
    mimeType?: string;
    uploadedAt?: Date;
  }
>;
export declare const GeoLocationSchema: z.ZodObject<
  {
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    address?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    zipCode?: string;
  },
  {
    address?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    zipCode?: string;
  }
>;
export declare const ContactInfoSchema: z.ZodObject<
  {
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    socialLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    address?: string;
    phone?: string;
    website?: string;
    socialLinks?: Record<string, string>;
  },
  {
    address?: string;
    phone?: string;
    website?: string;
    socialLinks?: Record<string, string>;
  }
>;
export declare const SettingsSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export declare const NotificationTypeSchema: z.ZodEnum<['info', 'warning', 'error', 'success']>;
export declare const NotificationPreferencesSchema: z.ZodObject<
  {
    email: z.ZodBoolean;
    browser: z.ZodBoolean;
    mobile: z.ZodBoolean;
  },
  'strip',
  z.ZodTypeAny,
  {
    mobile?: boolean;
    email?: boolean;
    browser?: boolean;
  },
  {
    mobile?: boolean;
    email?: boolean;
    browser?: boolean;
  }
>;
export declare const createOptionalSchema: <T extends z.ZodTypeAny>(schema: T) => z.ZodOptional<T>;
export declare const createArraySchema: <T extends z.ZodTypeAny>(
  itemSchema: T,
  options?: {
    min?: number;
    max?: number;
  }
) => z.ZodArray<T, 'many'>;
export declare const DateRangeSchema: z.ZodEffects<
  z.ZodObject<
    {
      startDate: z.ZodDate;
      endDate: z.ZodDate;
    },
    'strip',
    z.ZodTypeAny,
    {
      startDate?: Date;
      endDate?: Date;
    },
    {
      startDate?: Date;
      endDate?: Date;
    }
  >,
  {
    startDate?: Date;
    endDate?: Date;
  },
  {
    startDate?: Date;
    endDate?: Date;
  }
>;
export declare const EmailSchema: z.ZodString;
export declare const PasswordSchema: z.ZodString;
export declare const UrlSchema: z.ZodString;
export declare const ColorCodeSchema: z.ZodString;
export declare const TimezoneSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const LanguageCodeSchema: z.ZodString;
export declare const DEFAULT_PAGINATION: {
  page: number;
  limit: number;
  sortOrder: 'desc';
};
export declare const validateEntity: <T>(
  schema: z.ZodSchema<T>,
  data: unknown
) =>
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };
export declare const createValidationMiddleware: <T>(
  schema: z.ZodSchema<T>
) => (data: unknown) => T;
