/**
 * 問卷系統 Zod 驗證 Schema
 * 定義問卷相關資料的驗證規則
 */
import { z } from 'zod';
import { SurveyStatus, SurveyType, SurveyVisibility } from '../types/survey';
/** 問卷狀態驗證 */
export declare const SurveyStatusSchema: z.ZodNativeEnum<typeof SurveyStatus>;
/** 問卷類型驗證 */
export declare const SurveyTypeSchema: z.ZodNativeEnum<typeof SurveyType>;
/** 問卷可見性驗證 */
export declare const SurveyVisibilitySchema: z.ZodNativeEnum<typeof SurveyVisibility>;
/** 問卷發布設定驗證 */
export declare const SurveyPublishSettingsSchema: z.ZodEffects<
  z.ZodEffects<
    z.ZodObject<
      {
        visibility: z.ZodNativeEnum<typeof SurveyVisibility>;
        password: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodDate>;
        endDate: z.ZodOptional<z.ZodDate>;
        responseLimit: z.ZodOptional<z.ZodNumber>;
        allowAnonymous: z.ZodDefault<z.ZodBoolean>;
        allowMultipleResponses: z.ZodDefault<z.ZodBoolean>;
        redirectUrl: z.ZodOptional<z.ZodString>;
        thankYouMessage: z.ZodOptional<z.ZodString>;
      },
      'strip',
      z.ZodTypeAny,
      {
        visibility?: SurveyVisibility;
        password?: string;
        startDate?: Date;
        endDate?: Date;
        responseLimit?: number;
        allowAnonymous?: boolean;
        allowMultipleResponses?: boolean;
        redirectUrl?: string;
        thankYouMessage?: string;
      },
      {
        visibility?: SurveyVisibility;
        password?: string;
        startDate?: Date;
        endDate?: Date;
        responseLimit?: number;
        allowAnonymous?: boolean;
        allowMultipleResponses?: boolean;
        redirectUrl?: string;
        thankYouMessage?: string;
      }
    >,
    {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    },
    {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    }
  >,
  {
    visibility?: SurveyVisibility;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    responseLimit?: number;
    allowAnonymous?: boolean;
    allowMultipleResponses?: boolean;
    redirectUrl?: string;
    thankYouMessage?: string;
  },
  {
    visibility?: SurveyVisibility;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    responseLimit?: number;
    allowAnonymous?: boolean;
    allowMultipleResponses?: boolean;
    redirectUrl?: string;
    thankYouMessage?: string;
  }
>;
/** 問卷外觀設定驗證 */
export declare const SurveyAppearanceSchema: z.ZodObject<
  {
    primaryColor: z.ZodString;
    backgroundColor: z.ZodString;
    coverImageUrl: z.ZodOptional<z.ZodString>;
    customCss: z.ZodOptional<z.ZodString>;
    fontFamily: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    backgroundColor?: string;
    fontFamily?: string;
    primaryColor?: string;
    coverImageUrl?: string;
    customCss?: string;
  },
  {
    backgroundColor?: string;
    fontFamily?: string;
    primaryColor?: string;
    coverImageUrl?: string;
    customCss?: string;
  }
>;
/** 問卷統計資料驗證 */
export declare const SurveyStatsSchema: z.ZodObject<
  {
    totalResponses: z.ZodDefault<z.ZodNumber>;
    completedResponses: z.ZodDefault<z.ZodNumber>;
    avgCompletionTime: z.ZodOptional<z.ZodNumber>;
    abandonmentRate: z.ZodOptional<z.ZodNumber>;
    lastResponseAt: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    totalResponses?: number;
    completedResponses?: number;
    avgCompletionTime?: number;
    abandonmentRate?: number;
    lastResponseAt?: Date;
  },
  {
    totalResponses?: number;
    completedResponses?: number;
    avgCompletionTime?: number;
    abandonmentRate?: number;
    lastResponseAt?: Date;
  }
>;
/** 問卷建立請求驗證 */
export declare const CreateSurveySchema: z.ZodObject<
  {
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodNativeEnum<typeof SurveyType>>;
    workspaceId: z.ZodString;
    publishSettings: z.ZodOptional<
      z.ZodEffects<
        z.ZodEffects<
          z.ZodObject<
            {
              visibility: z.ZodNativeEnum<typeof SurveyVisibility>;
              password: z.ZodOptional<z.ZodString>;
              startDate: z.ZodOptional<z.ZodDate>;
              endDate: z.ZodOptional<z.ZodDate>;
              responseLimit: z.ZodOptional<z.ZodNumber>;
              allowAnonymous: z.ZodDefault<z.ZodBoolean>;
              allowMultipleResponses: z.ZodDefault<z.ZodBoolean>;
              redirectUrl: z.ZodOptional<z.ZodString>;
              thankYouMessage: z.ZodOptional<z.ZodString>;
            },
            'strip',
            z.ZodTypeAny,
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            },
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            }
          >,
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          },
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          }
        >,
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        },
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        }
      >
    >;
    appearance: z.ZodOptional<
      z.ZodObject<
        {
          primaryColor: z.ZodString;
          backgroundColor: z.ZodString;
          coverImageUrl: z.ZodOptional<z.ZodString>;
          customCss: z.ZodOptional<z.ZodString>;
          fontFamily: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          backgroundColor?: string;
          fontFamily?: string;
          primaryColor?: string;
          coverImageUrl?: string;
          customCss?: string;
        },
        {
          backgroundColor?: string;
          fontFamily?: string;
          primaryColor?: string;
          coverImageUrl?: string;
          customCss?: string;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    workspaceId?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    workspaceId?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
/** 問卷更新請求驗證 */
export declare const UpdateSurveySchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof SurveyType>>;
    publishSettings: z.ZodOptional<
      z.ZodEffects<
        z.ZodEffects<
          z.ZodObject<
            {
              visibility: z.ZodNativeEnum<typeof SurveyVisibility>;
              password: z.ZodOptional<z.ZodString>;
              startDate: z.ZodOptional<z.ZodDate>;
              endDate: z.ZodOptional<z.ZodDate>;
              responseLimit: z.ZodOptional<z.ZodNumber>;
              allowAnonymous: z.ZodDefault<z.ZodBoolean>;
              allowMultipleResponses: z.ZodDefault<z.ZodBoolean>;
              redirectUrl: z.ZodOptional<z.ZodString>;
              thankYouMessage: z.ZodOptional<z.ZodString>;
            },
            'strip',
            z.ZodTypeAny,
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            },
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            }
          >,
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          },
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          }
        >,
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        },
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        }
      >
    >;
    appearance: z.ZodOptional<
      z.ZodObject<
        {
          primaryColor: z.ZodString;
          backgroundColor: z.ZodString;
          coverImageUrl: z.ZodOptional<z.ZodString>;
          customCss: z.ZodOptional<z.ZodString>;
          fontFamily: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          backgroundColor?: string;
          fontFamily?: string;
          primaryColor?: string;
          coverImageUrl?: string;
          customCss?: string;
        },
        {
          backgroundColor?: string;
          fontFamily?: string;
          primaryColor?: string;
          coverImageUrl?: string;
          customCss?: string;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
/** 問卷發布請求驗證 */
export declare const PublishSurveySchema: z.ZodEffects<
  z.ZodObject<
    {
      publishSettings: z.ZodEffects<
        z.ZodEffects<
          z.ZodObject<
            {
              visibility: z.ZodNativeEnum<typeof SurveyVisibility>;
              password: z.ZodOptional<z.ZodString>;
              startDate: z.ZodOptional<z.ZodDate>;
              endDate: z.ZodOptional<z.ZodDate>;
              responseLimit: z.ZodOptional<z.ZodNumber>;
              allowAnonymous: z.ZodDefault<z.ZodBoolean>;
              allowMultipleResponses: z.ZodDefault<z.ZodBoolean>;
              redirectUrl: z.ZodOptional<z.ZodString>;
              thankYouMessage: z.ZodOptional<z.ZodString>;
            },
            'strip',
            z.ZodTypeAny,
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            },
            {
              visibility?: SurveyVisibility;
              password?: string;
              startDate?: Date;
              endDate?: Date;
              responseLimit?: number;
              allowAnonymous?: boolean;
              allowMultipleResponses?: boolean;
              redirectUrl?: string;
              thankYouMessage?: string;
            }
          >,
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          },
          {
            visibility?: SurveyVisibility;
            password?: string;
            startDate?: Date;
            endDate?: Date;
            responseLimit?: number;
            allowAnonymous?: boolean;
            allowMultipleResponses?: boolean;
            redirectUrl?: string;
            thankYouMessage?: string;
          }
        >,
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        },
        {
          visibility?: SurveyVisibility;
          password?: string;
          startDate?: Date;
          endDate?: Date;
          responseLimit?: number;
          allowAnonymous?: boolean;
          allowMultipleResponses?: boolean;
          redirectUrl?: string;
          thankYouMessage?: string;
        }
      >;
    },
    'strip',
    z.ZodTypeAny,
    {
      publishSettings?: {
        visibility?: SurveyVisibility;
        password?: string;
        startDate?: Date;
        endDate?: Date;
        responseLimit?: number;
        allowAnonymous?: boolean;
        allowMultipleResponses?: boolean;
        redirectUrl?: string;
        thankYouMessage?: string;
      };
    },
    {
      publishSettings?: {
        visibility?: SurveyVisibility;
        password?: string;
        startDate?: Date;
        endDate?: Date;
        responseLimit?: number;
        allowAnonymous?: boolean;
        allowMultipleResponses?: boolean;
        redirectUrl?: string;
        thankYouMessage?: string;
      };
    }
  >,
  {
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
/** 問卷查詢參數驗證 */
export declare const SurveyQuerySchema: z.ZodObject<
  {
    workspaceId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof SurveyStatus>>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof SurveyType>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<['createdAt', 'updatedAt', 'title', 'publishedAt']>>;
    sortOrder: z.ZodDefault<z.ZodEnum<['asc', 'desc']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    type?: SurveyType;
    page?: number;
    status?: SurveyStatus;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
    sortOrder?: 'desc' | 'asc';
    workspaceId?: string;
  },
  {
    search?: string;
    type?: SurveyType;
    page?: number;
    status?: SurveyStatus;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
    sortOrder?: 'desc' | 'asc';
    workspaceId?: string;
  }
>;
/** 問卷建構器狀態驗證 */
export declare const SurveyBuilderStateSchema: z.ZodObject<
  {
    currentSurvey: z.ZodNullable<z.ZodAny>;
    selectedQuestionId: z.ZodNullable<z.ZodString>;
    isPreviewMode: z.ZodDefault<z.ZodBoolean>;
    hasUnsavedChanges: z.ZodDefault<z.ZodBoolean>;
    dragState: z.ZodDefault<
      z.ZodObject<
        {
          isDragging: z.ZodDefault<z.ZodBoolean>;
          draggedQuestionType: z.ZodOptional<z.ZodString>;
          dropZoneIndex: z.ZodOptional<z.ZodNumber>;
        },
        'strip',
        z.ZodTypeAny,
        {
          isDragging?: boolean;
          draggedQuestionType?: string;
          dropZoneIndex?: number;
        },
        {
          isDragging?: boolean;
          draggedQuestionType?: string;
          dropZoneIndex?: number;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    currentSurvey?: any;
    selectedQuestionId?: string;
    isPreviewMode?: boolean;
    hasUnsavedChanges?: boolean;
    dragState?: {
      isDragging?: boolean;
      draggedQuestionType?: string;
      dropZoneIndex?: number;
    };
  },
  {
    currentSurvey?: any;
    selectedQuestionId?: string;
    isPreviewMode?: boolean;
    hasUnsavedChanges?: boolean;
    dragState?: {
      isDragging?: boolean;
      draggedQuestionType?: string;
      dropZoneIndex?: number;
    };
  }
>;
/** 從 Schema 推斷出的型別 */
export type CreateSurveyRequest = z.infer<typeof CreateSurveySchema>;
export type UpdateSurveyRequest = z.infer<typeof UpdateSurveySchema>;
export type PublishSurveyRequest = z.infer<typeof PublishSurveySchema>;
export type SurveyQuery = z.infer<typeof SurveyQuerySchema>;
export type SurveyBuilderStateData = z.infer<typeof SurveyBuilderStateSchema>;
/** 驗證問卷建立請求 */
export declare function validateCreateSurveyRequest(data: unknown): CreateSurveyRequest;
/** 驗證問卷更新請求 */
export declare function validateUpdateSurveyRequest(data: unknown): UpdateSurveyRequest;
/** 驗證問卷發布請求 */
export declare function validatePublishSurveyRequest(data: unknown): PublishSurveyRequest;
/** 驗證問卷查詢參數 */
export declare function validateSurveyQuery(data: unknown): SurveyQuery;
/** 安全解析 - 不拋出錯誤，返回結果物件 */
export declare function safeParseCreateSurveyRequest(data: unknown): z.SafeParseReturnType<
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    workspaceId?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    workspaceId?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
export declare function safeParseUpdateSurveyRequest(data: unknown): z.SafeParseReturnType<
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    type?: SurveyType;
    appearance?: {
      backgroundColor?: string;
      fontFamily?: string;
      primaryColor?: string;
      coverImageUrl?: string;
      customCss?: string;
    };
    title?: string;
    description?: string;
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
export declare function safeParsePublishSurveyRequest(data: unknown): z.SafeParseReturnType<
  {
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  },
  {
    publishSettings?: {
      visibility?: SurveyVisibility;
      password?: string;
      startDate?: Date;
      endDate?: Date;
      responseLimit?: number;
      allowAnonymous?: boolean;
      allowMultipleResponses?: boolean;
      redirectUrl?: string;
      thankYouMessage?: string;
    };
  }
>;
export declare function safeParseSurveyQuery(data: unknown): z.SafeParseReturnType<
  {
    search?: string;
    type?: SurveyType;
    page?: number;
    status?: SurveyStatus;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
    sortOrder?: 'desc' | 'asc';
    workspaceId?: string;
  },
  {
    search?: string;
    type?: SurveyType;
    page?: number;
    status?: SurveyStatus;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt';
    sortOrder?: 'desc' | 'asc';
    workspaceId?: string;
  }
>;
