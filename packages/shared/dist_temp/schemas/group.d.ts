/**
 * 群組和訂閱相關 Zod 驗證 schemas
 * 包含群組實體、訂閱方案、使用限制等相關驗證規則
 */
import { z } from 'zod';
export declare const SubscriptionTierSchema: z.ZodEnum<['free', 'pro', 'team', 'enterprise']>;
export declare const GroupLimitsSchema: z.ZodObject<
  {
    maxMembers: z.ZodNumber;
    maxSurveys: z.ZodNumber;
    maxResponses: z.ZodNumber;
    maxStorage: z.ZodNumber;
    features: z.ZodArray<z.ZodString, 'many'>;
    maxAiCallsPerDay: z.ZodNumber;
    maxCustomRoles: z.ZodNumber;
    maxApiCalls: z.ZodNumber;
    exportFormats: z.ZodArray<z.ZodString, 'many'>;
    advancedAnalytics: z.ZodBoolean;
    whiteLabel: z.ZodBoolean;
  },
  'strip',
  z.ZodTypeAny,
  {
    maxMembers?: number;
    maxSurveys?: number;
    maxResponses?: number;
    maxStorage?: number;
    features?: string[];
    maxAiCallsPerDay?: number;
    maxCustomRoles?: number;
    maxApiCalls?: number;
    exportFormats?: string[];
    advancedAnalytics?: boolean;
    whiteLabel?: boolean;
  },
  {
    maxMembers?: number;
    maxSurveys?: number;
    maxResponses?: number;
    maxStorage?: number;
    features?: string[];
    maxAiCallsPerDay?: number;
    maxCustomRoles?: number;
    maxApiCalls?: number;
    exportFormats?: string[];
    advancedAnalytics?: boolean;
    whiteLabel?: boolean;
  }
>;
export declare const GroupStatsSchema: z.ZodObject<
  {
    memberCount: z.ZodNumber;
    surveyCount: z.ZodNumber;
    monthlyResponses: z.ZodNumber;
    storageUsed: z.ZodNumber;
    apiCallsThisMonth: z.ZodNumber;
    aiCallsToday: z.ZodNumber;
    aiCallsDate: z.ZodString;
    statsMonth: z.ZodString;
    lastUpdated: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    surveyCount?: number;
    memberCount?: number;
    monthlyResponses?: number;
    storageUsed?: number;
    apiCallsThisMonth?: number;
    aiCallsToday?: number;
    aiCallsDate?: string;
    statsMonth?: string;
    lastUpdated?: Date;
  },
  {
    surveyCount?: number;
    memberCount?: number;
    monthlyResponses?: number;
    storageUsed?: number;
    apiCallsThisMonth?: number;
    aiCallsToday?: number;
    aiCallsDate?: string;
    statsMonth?: string;
    lastUpdated?: Date;
  }
>;
export declare const GroupSettingsSchema: z.ZodObject<
  {
    allowMemberInvites: z.ZodBoolean;
    isPublic: z.ZodBoolean;
    defaultSurveyPublic: z.ZodBoolean;
    requireApprovalForSurveys: z.ZodBoolean;
    defaultTheme: z.ZodOptional<z.ZodString>;
    customDomain: z.ZodOptional<z.ZodString>;
    customSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    customSettings?: Record<string, unknown>;
    allowMemberInvites?: boolean;
    isPublic?: boolean;
    defaultSurveyPublic?: boolean;
    requireApprovalForSurveys?: boolean;
    defaultTheme?: string;
    customDomain?: string;
  },
  {
    customSettings?: Record<string, unknown>;
    allowMemberInvites?: boolean;
    isPublic?: boolean;
    defaultSurveyPublic?: boolean;
    requireApprovalForSurveys?: boolean;
    defaultTheme?: string;
    customDomain?: string;
  }
>;
export declare const GroupSchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  } & {
    name: z.ZodString;
    ownerId: z.ZodString;
    subscriptionTier: z.ZodEnum<['free', 'pro', 'team', 'enterprise']>;
    subscriptionId: z.ZodOptional<z.ZodString>;
    limits: z.ZodObject<
      {
        maxMembers: z.ZodNumber;
        maxSurveys: z.ZodNumber;
        maxResponses: z.ZodNumber;
        maxStorage: z.ZodNumber;
        features: z.ZodArray<z.ZodString, 'many'>;
        maxAiCallsPerDay: z.ZodNumber;
        maxCustomRoles: z.ZodNumber;
        maxApiCalls: z.ZodNumber;
        exportFormats: z.ZodArray<z.ZodString, 'many'>;
        advancedAnalytics: z.ZodBoolean;
        whiteLabel: z.ZodBoolean;
      },
      'strip',
      z.ZodTypeAny,
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      },
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      }
    >;
    stats: z.ZodObject<
      {
        memberCount: z.ZodNumber;
        surveyCount: z.ZodNumber;
        monthlyResponses: z.ZodNumber;
        storageUsed: z.ZodNumber;
        apiCallsThisMonth: z.ZodNumber;
        aiCallsToday: z.ZodNumber;
        aiCallsDate: z.ZodString;
        statsMonth: z.ZodString;
        lastUpdated: z.ZodDate;
      },
      'strip',
      z.ZodTypeAny,
      {
        surveyCount?: number;
        memberCount?: number;
        monthlyResponses?: number;
        storageUsed?: number;
        apiCallsThisMonth?: number;
        aiCallsToday?: number;
        aiCallsDate?: string;
        statsMonth?: string;
        lastUpdated?: Date;
      },
      {
        surveyCount?: number;
        memberCount?: number;
        monthlyResponses?: number;
        storageUsed?: number;
        apiCallsThisMonth?: number;
        aiCallsToday?: number;
        aiCallsDate?: string;
        statsMonth?: string;
        lastUpdated?: Date;
      }
    >;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    settings: z.ZodObject<
      {
        allowMemberInvites: z.ZodBoolean;
        isPublic: z.ZodBoolean;
        defaultSurveyPublic: z.ZodBoolean;
        requireApprovalForSurveys: z.ZodBoolean;
        defaultTheme: z.ZodOptional<z.ZodString>;
        customDomain: z.ZodOptional<z.ZodString>;
        customSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        customSettings?: Record<string, unknown>;
        allowMemberInvites?: boolean;
        isPublic?: boolean;
        defaultSurveyPublic?: boolean;
        requireApprovalForSurveys?: boolean;
        defaultTheme?: string;
        customDomain?: string;
      },
      {
        customSettings?: Record<string, unknown>;
        allowMemberInvites?: boolean;
        isPublic?: boolean;
        defaultSurveyPublic?: boolean;
        requireApprovalForSurveys?: boolean;
        defaultTheme?: string;
        customDomain?: string;
      }
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    avatar?: string;
    stats?: {
      surveyCount?: number;
      memberCount?: number;
      monthlyResponses?: number;
      storageUsed?: number;
      apiCallsThisMonth?: number;
      aiCallsToday?: number;
      aiCallsDate?: string;
      statsMonth?: string;
      lastUpdated?: Date;
    };
    ownerId?: string;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    subscriptionId?: string;
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  },
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    avatar?: string;
    stats?: {
      surveyCount?: number;
      memberCount?: number;
      monthlyResponses?: number;
      storageUsed?: number;
      apiCallsThisMonth?: number;
      aiCallsToday?: number;
      aiCallsDate?: string;
      statsMonth?: string;
      lastUpdated?: Date;
    };
    ownerId?: string;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    subscriptionId?: string;
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  }
>;
export declare const PublicGroupSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    memberCount: z.ZodNumber;
    isPublic: z.ZodBoolean;
    subscriptionTier: z.ZodEnum<['free', 'pro', 'team', 'enterprise']>;
    createdAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    avatar?: string;
    memberCount?: number;
    isPublic?: boolean;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
  },
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    avatar?: string;
    memberCount?: number;
    isPublic?: boolean;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
  }
>;
export declare const GroupSummarySchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    ownerId: z.ZodString;
    subscriptionTier: z.ZodEnum<['free', 'pro', 'team', 'enterprise']>;
    memberCount: z.ZodNumber;
    surveyCount: z.ZodNumber;
    userRole: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    surveyCount?: number;
    memberCount?: number;
    ownerId?: string;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    userRole?: string;
  },
  {
    name?: string;
    id?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    surveyCount?: number;
    memberCount?: number;
    ownerId?: string;
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    userRole?: string;
  }
>;
export declare const CreateGroupDataSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    settings: z.ZodOptional<
      z.ZodObject<
        {
          allowMemberInvites: z.ZodOptional<z.ZodBoolean>;
          isPublic: z.ZodOptional<z.ZodBoolean>;
          defaultSurveyPublic: z.ZodOptional<z.ZodBoolean>;
          requireApprovalForSurveys: z.ZodOptional<z.ZodBoolean>;
          defaultTheme: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          customDomain: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          customSettings: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          customSettings?: Record<string, unknown>;
          allowMemberInvites?: boolean;
          isPublic?: boolean;
          defaultSurveyPublic?: boolean;
          requireApprovalForSurveys?: boolean;
          defaultTheme?: string;
          customDomain?: string;
        },
        {
          customSettings?: Record<string, unknown>;
          allowMemberInvites?: boolean;
          isPublic?: boolean;
          defaultSurveyPublic?: boolean;
          requireApprovalForSurveys?: boolean;
          defaultTheme?: string;
          customDomain?: string;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    description?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  },
  {
    name?: string;
    description?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  }
>;
export declare const UpdateGroupDataSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    settings: z.ZodOptional<
      z.ZodObject<
        {
          allowMemberInvites: z.ZodOptional<z.ZodBoolean>;
          isPublic: z.ZodOptional<z.ZodBoolean>;
          defaultSurveyPublic: z.ZodOptional<z.ZodBoolean>;
          requireApprovalForSurveys: z.ZodOptional<z.ZodBoolean>;
          defaultTheme: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          customDomain: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          customSettings: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          customSettings?: Record<string, unknown>;
          allowMemberInvites?: boolean;
          isPublic?: boolean;
          defaultSurveyPublic?: boolean;
          requireApprovalForSurveys?: boolean;
          defaultTheme?: string;
          customDomain?: string;
        },
        {
          customSettings?: Record<string, unknown>;
          allowMemberInvites?: boolean;
          isPublic?: boolean;
          defaultSurveyPublic?: boolean;
          requireApprovalForSurveys?: boolean;
          defaultTheme?: string;
          customDomain?: string;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    description?: string;
    avatar?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  },
  {
    name?: string;
    description?: string;
    avatar?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  }
>;
export declare const UpdateGroupLimitsDataSchema: z.ZodObject<
  {
    limits: z.ZodObject<
      {
        maxMembers: z.ZodOptional<z.ZodNumber>;
        maxSurveys: z.ZodOptional<z.ZodNumber>;
        maxResponses: z.ZodOptional<z.ZodNumber>;
        maxStorage: z.ZodOptional<z.ZodNumber>;
        features: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        maxAiCallsPerDay: z.ZodOptional<z.ZodNumber>;
        maxCustomRoles: z.ZodOptional<z.ZodNumber>;
        maxApiCalls: z.ZodOptional<z.ZodNumber>;
        exportFormats: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        advancedAnalytics: z.ZodOptional<z.ZodBoolean>;
        whiteLabel: z.ZodOptional<z.ZodBoolean>;
      },
      'strip',
      z.ZodTypeAny,
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      },
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      }
    >;
    subscriptionTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
  },
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
  }
>;
export declare const GroupQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    subscriptionTier: z.ZodOptional<
      z.ZodArray<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>, 'many'>
    >;
    ownedByMe: z.ZodOptional<z.ZodBoolean>;
    publicOnly: z.ZodOptional<z.ZodBoolean>;
    minMembers: z.ZodOptional<z.ZodNumber>;
    maxMembers: z.ZodOptional<z.ZodNumber>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    maxMembers?: number;
    subscriptionTier?: ('enterprise' | 'free' | 'pro' | 'team')[];
    ownedByMe?: boolean;
    publicOnly?: boolean;
    minMembers?: number;
  },
  {
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    maxMembers?: number;
    subscriptionTier?: ('enterprise' | 'free' | 'pro' | 'team')[];
    ownedByMe?: boolean;
    publicOnly?: boolean;
    minMembers?: number;
  }
>;
export declare const GroupMemberSchema: z.ZodObject<
  {
    userId: z.ZodString;
    groupId: z.ZodString;
    userName: z.ZodString;
    userEmail: z.ZodString;
    userAvatar: z.ZodOptional<z.ZodString>;
    roleName: z.ZodString;
    roleColor: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<['active', 'pending', 'blocked']>;
    joinedAt: z.ZodDate;
    invitedBy: z.ZodOptional<z.ZodString>;
    lastActivity: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    status?: 'active' | 'pending' | 'blocked';
    invitedBy?: string;
    lastActivity?: Date;
    userId?: string;
    groupId?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    roleName?: string;
    roleColor?: string;
    joinedAt?: Date;
  },
  {
    status?: 'active' | 'pending' | 'blocked';
    invitedBy?: string;
    lastActivity?: Date;
    userId?: string;
    groupId?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    roleName?: string;
    roleColor?: string;
    joinedAt?: Date;
  }
>;
export declare const GroupMemberQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    status: z.ZodOptional<z.ZodArray<z.ZodEnum<['active', 'pending', 'blocked']>, 'many'>>;
    joinedAfter: z.ZodOptional<z.ZodDate>;
    joinedBefore: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    status?: ('active' | 'pending' | 'blocked')[];
    joinedAfter?: Date;
    joinedBefore?: Date;
    roles?: string[];
  },
  {
    search?: string;
    status?: ('active' | 'pending' | 'blocked')[];
    joinedAfter?: Date;
    joinedBefore?: Date;
    roles?: string[];
  }
>;
export declare const LimitCheckResultSchema: z.ZodObject<
  {
    allowed: z.ZodBoolean;
    current: z.ZodNumber;
    limit: z.ZodNumber;
    usage: z.ZodNumber;
    warning: z.ZodOptional<z.ZodString>;
    suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    warning?: string;
    limit?: number;
    allowed?: boolean;
    current?: number;
    usage?: number;
    suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
  },
  {
    warning?: string;
    limit?: number;
    allowed?: boolean;
    current?: number;
    usage?: number;
    suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
  }
>;
export declare const GroupUsageSummarySchema: z.ZodObject<
  {
    groupId: z.ZodString;
    subscriptionTier: z.ZodEnum<['free', 'pro', 'team', 'enterprise']>;
    limits: z.ZodObject<
      {
        maxMembers: z.ZodNumber;
        maxSurveys: z.ZodNumber;
        maxResponses: z.ZodNumber;
        maxStorage: z.ZodNumber;
        features: z.ZodArray<z.ZodString, 'many'>;
        maxAiCallsPerDay: z.ZodNumber;
        maxCustomRoles: z.ZodNumber;
        maxApiCalls: z.ZodNumber;
        exportFormats: z.ZodArray<z.ZodString, 'many'>;
        advancedAnalytics: z.ZodBoolean;
        whiteLabel: z.ZodBoolean;
      },
      'strip',
      z.ZodTypeAny,
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      },
      {
        maxMembers?: number;
        maxSurveys?: number;
        maxResponses?: number;
        maxStorage?: number;
        features?: string[];
        maxAiCallsPerDay?: number;
        maxCustomRoles?: number;
        maxApiCalls?: number;
        exportFormats?: string[];
        advancedAnalytics?: boolean;
        whiteLabel?: boolean;
      }
    >;
    usage: z.ZodObject<
      {
        memberCount: z.ZodNumber;
        surveyCount: z.ZodNumber;
        monthlyResponses: z.ZodNumber;
        storageUsed: z.ZodNumber;
        apiCallsThisMonth: z.ZodNumber;
        aiCallsToday: z.ZodNumber;
        aiCallsDate: z.ZodString;
        statsMonth: z.ZodString;
        lastUpdated: z.ZodDate;
      },
      'strip',
      z.ZodTypeAny,
      {
        surveyCount?: number;
        memberCount?: number;
        monthlyResponses?: number;
        storageUsed?: number;
        apiCallsThisMonth?: number;
        aiCallsToday?: number;
        aiCallsDate?: string;
        statsMonth?: string;
        lastUpdated?: Date;
      },
      {
        surveyCount?: number;
        memberCount?: number;
        monthlyResponses?: number;
        storageUsed?: number;
        apiCallsThisMonth?: number;
        aiCallsToday?: number;
        aiCallsDate?: string;
        statsMonth?: string;
        lastUpdated?: Date;
      }
    >;
    warnings: z.ZodArray<z.ZodString, 'many'>;
    recommendations: z.ZodArray<z.ZodString, 'many'>;
    memberUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
    surveyUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
    responseUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
    storageUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
    apiUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
    aiUsage: z.ZodObject<
      {
        allowed: z.ZodBoolean;
        current: z.ZodNumber;
        limit: z.ZodNumber;
        usage: z.ZodNumber;
        warning: z.ZodOptional<z.ZodString>;
        suggestedTier: z.ZodOptional<z.ZodEnum<['free', 'pro', 'team', 'enterprise']>>;
      },
      'strip',
      z.ZodTypeAny,
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      },
      {
        warning?: string;
        limit?: number;
        allowed?: boolean;
        current?: number;
        usage?: number;
        suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
      }
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
    groupId?: string;
    usage?: {
      surveyCount?: number;
      memberCount?: number;
      monthlyResponses?: number;
      storageUsed?: number;
      apiCallsThisMonth?: number;
      aiCallsToday?: number;
      aiCallsDate?: string;
      statsMonth?: string;
      lastUpdated?: Date;
    };
    warnings?: string[];
    recommendations?: string[];
    memberUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    surveyUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    responseUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    storageUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    apiUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    aiUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
  },
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
    groupId?: string;
    usage?: {
      surveyCount?: number;
      memberCount?: number;
      monthlyResponses?: number;
      storageUsed?: number;
      apiCallsThisMonth?: number;
      aiCallsToday?: number;
      aiCallsDate?: string;
      statsMonth?: string;
      lastUpdated?: Date;
    };
    warnings?: string[];
    recommendations?: string[];
    memberUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    surveyUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    responseUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    storageUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    apiUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
    aiUsage?: {
      warning?: string;
      limit?: number;
      allowed?: boolean;
      current?: number;
      usage?: number;
      suggestedTier?: 'enterprise' | 'free' | 'pro' | 'team';
    };
  }
>;
export declare const FeatureFlagSchema: z.ZodEnum<
  [
    'basic_surveys',
    'basic_analytics',
    'all_question_types',
    'logic_branching',
    'themes',
    'collaboration',
    'approval_workflow',
    'team_analytics',
    'sso',
    'custom_domain',
    'dedicated_support',
  ]
>;
export declare const GroupActivitySchema: z.ZodObject<
  {
    id: z.ZodString;
    groupId: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<
      [
        'member_join',
        'member_leave',
        'member_invite',
        'survey_create',
        'survey_publish',
        'role_assign',
        'settings_update',
      ]
    >;
    description: z.ZodString;
    resourceId: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?:
      | 'member_join'
      | 'member_leave'
      | 'member_invite'
      | 'survey_create'
      | 'survey_publish'
      | 'role_assign'
      | 'settings_update';
    id?: string;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
    description?: string;
    userId?: string;
    resourceId?: string;
    resourceType?: string;
    groupId?: string;
  },
  {
    type?:
      | 'member_join'
      | 'member_leave'
      | 'member_invite'
      | 'survey_create'
      | 'survey_publish'
      | 'role_assign'
      | 'settings_update';
    id?: string;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
    description?: string;
    userId?: string;
    resourceId?: string;
    resourceType?: string;
    groupId?: string;
  }
>;
export declare const DefaultGroupSettingsSchema: z.ZodObject<
  {
    allowMemberInvites: z.ZodLiteral<false>;
    isPublic: z.ZodLiteral<false>;
    defaultSurveyPublic: z.ZodLiteral<false>;
    requireApprovalForSurveys: z.ZodLiteral<false>;
  },
  'strip',
  z.ZodTypeAny,
  {
    allowMemberInvites?: false;
    isPublic?: false;
    defaultSurveyPublic?: false;
    requireApprovalForSurveys?: false;
  },
  {
    allowMemberInvites?: false;
    isPublic?: false;
    defaultSurveyPublic?: false;
    requireApprovalForSurveys?: false;
  }
>;
export declare const DefaultGroupStatsSchema: z.ZodObject<
  {
    memberCount: z.ZodLiteral<1>;
    surveyCount: z.ZodLiteral<0>;
    monthlyResponses: z.ZodLiteral<0>;
    storageUsed: z.ZodLiteral<0>;
    apiCallsThisMonth: z.ZodLiteral<0>;
    aiCallsToday: z.ZodLiteral<0>;
    aiCallsDate: z.ZodString;
    statsMonth: z.ZodString;
    lastUpdated: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    surveyCount?: 0;
    memberCount?: 1;
    monthlyResponses?: 0;
    storageUsed?: 0;
    apiCallsThisMonth?: 0;
    aiCallsToday?: 0;
    aiCallsDate?: string;
    statsMonth?: string;
    lastUpdated?: Date;
  },
  {
    surveyCount?: 0;
    memberCount?: 1;
    monthlyResponses?: 0;
    storageUsed?: 0;
    apiCallsThisMonth?: 0;
    aiCallsToday?: 0;
    aiCallsDate?: string;
    statsMonth?: string;
    lastUpdated?: Date;
  }
>;
export declare const SubscriptionLimitsSchema: z.ZodRecord<
  z.ZodEnum<['free', 'pro', 'team', 'enterprise']>,
  z.ZodObject<
    {
      maxMembers: z.ZodNumber;
      maxSurveys: z.ZodNumber;
      maxResponses: z.ZodNumber;
      maxStorage: z.ZodNumber;
      features: z.ZodArray<z.ZodString, 'many'>;
      maxAiCallsPerDay: z.ZodNumber;
      maxCustomRoles: z.ZodNumber;
      maxApiCalls: z.ZodNumber;
      exportFormats: z.ZodArray<z.ZodString, 'many'>;
      advancedAnalytics: z.ZodBoolean;
      whiteLabel: z.ZodBoolean;
    },
    'strip',
    z.ZodTypeAny,
    {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    },
    {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    }
  >
>;
export declare const validateGroupCreation: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    description?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  },
  {
    name?: string;
    description?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  }
>;
export declare const validateGroupUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    description?: string;
    avatar?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  },
  {
    name?: string;
    description?: string;
    avatar?: string;
    settings?: {
      customSettings?: Record<string, unknown>;
      allowMemberInvites?: boolean;
      isPublic?: boolean;
      defaultSurveyPublic?: boolean;
      requireApprovalForSurveys?: boolean;
      defaultTheme?: string;
      customDomain?: string;
    };
  }
>;
export declare const validateGroupLimitsUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
  },
  {
    subscriptionTier?: 'enterprise' | 'free' | 'pro' | 'team';
    limits?: {
      maxMembers?: number;
      maxSurveys?: number;
      maxResponses?: number;
      maxStorage?: number;
      features?: string[];
      maxAiCallsPerDay?: number;
      maxCustomRoles?: number;
      maxApiCalls?: number;
      exportFormats?: string[];
      advancedAnalytics?: boolean;
      whiteLabel?: boolean;
    };
  }
>;
export declare const validateGroupNameUniqueness: (
  _name: string,
  _ownerId: string,
  _excludeGroupId?: string
) => Promise<boolean>;
export declare const checkMemberLimit: (
  currentCount: number,
  limit: number
) => z.infer<typeof LimitCheckResultSchema>;
export declare const checkStorageLimit: (
  currentUsage: number,
  limit: number
) => z.infer<typeof LimitCheckResultSchema>;
export declare const hasFeature: (
  subscriptionTier: z.infer<typeof SubscriptionTierSchema>,
  feature: string
) => boolean;
