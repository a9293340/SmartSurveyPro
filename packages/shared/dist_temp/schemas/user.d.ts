/**
 * 用戶相關 Zod 驗證 schemas
 * 包含用戶實體、認證、設定等相關驗證規則
 */
import { z } from 'zod';
export declare const UserStatusSchema: z.ZodEnum<['active', 'unverified', 'suspended', 'deleted']>;
export declare const SystemRoleSchema: z.ZodEnum<['admin', 'user']>;
export declare const UserPreferencesSchema: z.ZodObject<
  {
    language: z.ZodString;
    timezone: z.ZodEffects<z.ZodString, string, string>;
    dateFormat: z.ZodString;
    timeFormat: z.ZodEnum<['12h', '24h']>;
    theme: z.ZodEnum<['light', 'dark', 'auto']>;
    notifications: z.ZodObject<
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
    showOnboarding: z.ZodBoolean;
    sidebarCollapsed: z.ZodBoolean;
  },
  'strip',
  z.ZodTypeAny,
  {
    notifications?: {
      mobile?: boolean;
      email?: boolean;
      browser?: boolean;
    };
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: '12h' | '24h';
    theme?: 'auto' | 'light' | 'dark';
    showOnboarding?: boolean;
    sidebarCollapsed?: boolean;
  },
  {
    notifications?: {
      mobile?: boolean;
      email?: boolean;
      browser?: boolean;
    };
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: '12h' | '24h';
    theme?: 'auto' | 'light' | 'dark';
    showOnboarding?: boolean;
    sidebarCollapsed?: boolean;
  }
>;
export declare const UserStatsSchema: z.ZodObject<
  {
    groupCount: z.ZodNumber;
    surveyCount: z.ZodNumber;
    responseCount: z.ZodNumber;
    lastLoginAt: z.ZodOptional<z.ZodDate>;
    lastActivityAt: z.ZodOptional<z.ZodDate>;
    loginCount: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    groupCount?: number;
    surveyCount?: number;
    responseCount?: number;
    lastLoginAt?: Date;
    lastActivityAt?: Date;
    loginCount?: number;
  },
  {
    groupCount?: number;
    surveyCount?: number;
    responseCount?: number;
    lastLoginAt?: Date;
    lastActivityAt?: Date;
    loginCount?: number;
  }
>;
export declare const UserSecuritySchema: z.ZodObject<
  {
    twoFactorEnabled: z.ZodBoolean;
    twoFactorSecret: z.ZodOptional<z.ZodString>;
    backupCodes: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    passwordChangedAt: z.ZodOptional<z.ZodDate>;
    trustedDevices: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            id: z.ZodString;
            name: z.ZodString;
            lastUsed: z.ZodDate;
            userAgent: z.ZodString;
          },
          'strip',
          z.ZodTypeAny,
          {
            name?: string;
            id?: string;
            lastUsed?: Date;
            userAgent?: string;
          },
          {
            name?: string;
            id?: string;
            lastUsed?: Date;
            userAgent?: string;
          }
        >,
        'many'
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    backupCodes?: string[];
    passwordChangedAt?: Date;
    trustedDevices?: {
      name?: string;
      id?: string;
      lastUsed?: Date;
      userAgent?: string;
    }[];
  },
  {
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    backupCodes?: string[];
    passwordChangedAt?: Date;
    trustedDevices?: {
      name?: string;
      id?: string;
      lastUsed?: Date;
      userAgent?: string;
    }[];
  }
>;
export declare const UserSchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  } & {
    email: z.ZodString;
    name: z.ZodString;
    passwordHash: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<['active', 'unverified', 'suspended', 'deleted']>;
    systemRole: z.ZodEnum<['admin', 'user']>;
    emailVerified: z.ZodBoolean;
    emailVerificationToken: z.ZodOptional<z.ZodString>;
    emailVerificationExpires: z.ZodOptional<z.ZodDate>;
    resetPasswordToken: z.ZodOptional<z.ZodString>;
    resetPasswordExpires: z.ZodOptional<z.ZodDate>;
    bio: z.ZodOptional<z.ZodString>;
    contactInfo: z.ZodOptional<
      z.ZodObject<
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
      >
    >;
    preferences: z.ZodObject<
      {
        language: z.ZodString;
        timezone: z.ZodEffects<z.ZodString, string, string>;
        dateFormat: z.ZodString;
        timeFormat: z.ZodEnum<['12h', '24h']>;
        theme: z.ZodEnum<['light', 'dark', 'auto']>;
        notifications: z.ZodObject<
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
        showOnboarding: z.ZodBoolean;
        sidebarCollapsed: z.ZodBoolean;
      },
      'strip',
      z.ZodTypeAny,
      {
        notifications?: {
          mobile?: boolean;
          email?: boolean;
          browser?: boolean;
        };
        language?: string;
        timezone?: string;
        dateFormat?: string;
        timeFormat?: '12h' | '24h';
        theme?: 'auto' | 'light' | 'dark';
        showOnboarding?: boolean;
        sidebarCollapsed?: boolean;
      },
      {
        notifications?: {
          mobile?: boolean;
          email?: boolean;
          browser?: boolean;
        };
        language?: string;
        timezone?: string;
        dateFormat?: string;
        timeFormat?: '12h' | '24h';
        theme?: 'auto' | 'light' | 'dark';
        showOnboarding?: boolean;
        sidebarCollapsed?: boolean;
      }
    >;
    stats: z.ZodObject<
      {
        groupCount: z.ZodNumber;
        surveyCount: z.ZodNumber;
        responseCount: z.ZodNumber;
        lastLoginAt: z.ZodOptional<z.ZodDate>;
        lastActivityAt: z.ZodOptional<z.ZodDate>;
        loginCount: z.ZodNumber;
      },
      'strip',
      z.ZodTypeAny,
      {
        groupCount?: number;
        surveyCount?: number;
        responseCount?: number;
        lastLoginAt?: Date;
        lastActivityAt?: Date;
        loginCount?: number;
      },
      {
        groupCount?: number;
        surveyCount?: number;
        responseCount?: number;
        lastLoginAt?: Date;
        lastActivityAt?: Date;
        loginCount?: number;
      }
    >;
    security: z.ZodObject<
      {
        twoFactorEnabled: z.ZodBoolean;
        twoFactorSecret: z.ZodOptional<z.ZodString>;
        backupCodes: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
        passwordChangedAt: z.ZodOptional<z.ZodDate>;
        trustedDevices: z.ZodOptional<
          z.ZodArray<
            z.ZodObject<
              {
                id: z.ZodString;
                name: z.ZodString;
                lastUsed: z.ZodDate;
                userAgent: z.ZodString;
              },
              'strip',
              z.ZodTypeAny,
              {
                name?: string;
                id?: string;
                lastUsed?: Date;
                userAgent?: string;
              },
              {
                name?: string;
                id?: string;
                lastUsed?: Date;
                userAgent?: string;
              }
            >,
            'many'
          >
        >;
      },
      'strip',
      z.ZodTypeAny,
      {
        twoFactorEnabled?: boolean;
        twoFactorSecret?: string;
        backupCodes?: string[];
        passwordChangedAt?: Date;
        trustedDevices?: {
          name?: string;
          id?: string;
          lastUsed?: Date;
          userAgent?: string;
        }[];
      },
      {
        twoFactorEnabled?: boolean;
        twoFactorSecret?: string;
        backupCodes?: string[];
        passwordChangedAt?: Date;
        trustedDevices?: {
          name?: string;
          id?: string;
          lastUsed?: Date;
          userAgent?: string;
        }[];
      }
    >;
    customSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    tosVersion: z.ZodOptional<z.ZodString>;
    privacyVersion: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    passwordHash?: string;
    emailVerificationToken?: string;
    resetPasswordToken?: string;
    security?: {
      twoFactorEnabled?: boolean;
      twoFactorSecret?: string;
      backupCodes?: string[];
      passwordChangedAt?: Date;
      trustedDevices?: {
        name?: string;
        id?: string;
        lastUsed?: Date;
        userAgent?: string;
      }[];
    };
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    emailVerificationExpires?: Date;
    resetPasswordExpires?: Date;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    customSettings?: Record<string, unknown>;
    tosVersion?: string;
    privacyVersion?: string;
  },
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    passwordHash?: string;
    emailVerificationToken?: string;
    resetPasswordToken?: string;
    security?: {
      twoFactorEnabled?: boolean;
      twoFactorSecret?: string;
      backupCodes?: string[];
      passwordChangedAt?: Date;
      trustedDevices?: {
        name?: string;
        id?: string;
        lastUsed?: Date;
        userAgent?: string;
      }[];
    };
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    emailVerificationExpires?: Date;
    resetPasswordExpires?: Date;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    customSettings?: Record<string, unknown>;
    tosVersion?: string;
    privacyVersion?: string;
  }
>;
export declare const PublicUserSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    createdAt?: Date;
    avatar?: string;
    bio?: string;
  },
  {
    name?: string;
    id?: string;
    createdAt?: Date;
    avatar?: string;
    bio?: string;
  }
>;
export declare const UserProfileSchema: z.ZodObject<
  Omit<
    {
      id: z.ZodString;
    } & {
      createdAt: z.ZodDate;
      updatedAt: z.ZodDate;
    } & {
      createdBy: z.ZodOptional<z.ZodString>;
      updatedBy: z.ZodOptional<z.ZodString>;
    } & {
      email: z.ZodString;
      name: z.ZodString;
      passwordHash: z.ZodString;
      avatar: z.ZodOptional<z.ZodString>;
      status: z.ZodEnum<['active', 'unverified', 'suspended', 'deleted']>;
      systemRole: z.ZodEnum<['admin', 'user']>;
      emailVerified: z.ZodBoolean;
      emailVerificationToken: z.ZodOptional<z.ZodString>;
      emailVerificationExpires: z.ZodOptional<z.ZodDate>;
      resetPasswordToken: z.ZodOptional<z.ZodString>;
      resetPasswordExpires: z.ZodOptional<z.ZodDate>;
      bio: z.ZodOptional<z.ZodString>;
      contactInfo: z.ZodOptional<
        z.ZodObject<
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
        >
      >;
      preferences: z.ZodObject<
        {
          language: z.ZodString;
          timezone: z.ZodEffects<z.ZodString, string, string>;
          dateFormat: z.ZodString;
          timeFormat: z.ZodEnum<['12h', '24h']>;
          theme: z.ZodEnum<['light', 'dark', 'auto']>;
          notifications: z.ZodObject<
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
          showOnboarding: z.ZodBoolean;
          sidebarCollapsed: z.ZodBoolean;
        },
        'strip',
        z.ZodTypeAny,
        {
          notifications?: {
            mobile?: boolean;
            email?: boolean;
            browser?: boolean;
          };
          language?: string;
          timezone?: string;
          dateFormat?: string;
          timeFormat?: '12h' | '24h';
          theme?: 'auto' | 'light' | 'dark';
          showOnboarding?: boolean;
          sidebarCollapsed?: boolean;
        },
        {
          notifications?: {
            mobile?: boolean;
            email?: boolean;
            browser?: boolean;
          };
          language?: string;
          timezone?: string;
          dateFormat?: string;
          timeFormat?: '12h' | '24h';
          theme?: 'auto' | 'light' | 'dark';
          showOnboarding?: boolean;
          sidebarCollapsed?: boolean;
        }
      >;
      stats: z.ZodObject<
        {
          groupCount: z.ZodNumber;
          surveyCount: z.ZodNumber;
          responseCount: z.ZodNumber;
          lastLoginAt: z.ZodOptional<z.ZodDate>;
          lastActivityAt: z.ZodOptional<z.ZodDate>;
          loginCount: z.ZodNumber;
        },
        'strip',
        z.ZodTypeAny,
        {
          groupCount?: number;
          surveyCount?: number;
          responseCount?: number;
          lastLoginAt?: Date;
          lastActivityAt?: Date;
          loginCount?: number;
        },
        {
          groupCount?: number;
          surveyCount?: number;
          responseCount?: number;
          lastLoginAt?: Date;
          lastActivityAt?: Date;
          loginCount?: number;
        }
      >;
      security: z.ZodObject<
        {
          twoFactorEnabled: z.ZodBoolean;
          twoFactorSecret: z.ZodOptional<z.ZodString>;
          backupCodes: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
          passwordChangedAt: z.ZodOptional<z.ZodDate>;
          trustedDevices: z.ZodOptional<
            z.ZodArray<
              z.ZodObject<
                {
                  id: z.ZodString;
                  name: z.ZodString;
                  lastUsed: z.ZodDate;
                  userAgent: z.ZodString;
                },
                'strip',
                z.ZodTypeAny,
                {
                  name?: string;
                  id?: string;
                  lastUsed?: Date;
                  userAgent?: string;
                },
                {
                  name?: string;
                  id?: string;
                  lastUsed?: Date;
                  userAgent?: string;
                }
              >,
              'many'
            >
          >;
        },
        'strip',
        z.ZodTypeAny,
        {
          twoFactorEnabled?: boolean;
          twoFactorSecret?: string;
          backupCodes?: string[];
          passwordChangedAt?: Date;
          trustedDevices?: {
            name?: string;
            id?: string;
            lastUsed?: Date;
            userAgent?: string;
          }[];
        },
        {
          twoFactorEnabled?: boolean;
          twoFactorSecret?: string;
          backupCodes?: string[];
          passwordChangedAt?: Date;
          trustedDevices?: {
            name?: string;
            id?: string;
            lastUsed?: Date;
            userAgent?: string;
          }[];
        }
      >;
      customSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      tosVersion: z.ZodOptional<z.ZodString>;
      privacyVersion: z.ZodOptional<z.ZodString>;
    },
    'passwordHash' | 'emailVerificationToken' | 'resetPasswordToken' | 'security'
  >,
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    emailVerificationExpires?: Date;
    resetPasswordExpires?: Date;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    customSettings?: Record<string, unknown>;
    tosVersion?: string;
    privacyVersion?: string;
  },
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    emailVerificationExpires?: Date;
    resetPasswordExpires?: Date;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    customSettings?: Record<string, unknown>;
    tosVersion?: string;
    privacyVersion?: string;
  }
>;
export declare const AuthUserSchema: z.ZodObject<
  {
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<['active', 'unverified', 'suspended', 'deleted']>;
    systemRole: z.ZodEnum<['admin', 'user']>;
    emailVerified: z.ZodBoolean;
    preferences: z.ZodObject<
      {
        language: z.ZodString;
        timezone: z.ZodEffects<z.ZodString, string, string>;
        dateFormat: z.ZodString;
        timeFormat: z.ZodEnum<['12h', '24h']>;
        theme: z.ZodEnum<['light', 'dark', 'auto']>;
        notifications: z.ZodObject<
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
        showOnboarding: z.ZodBoolean;
        sidebarCollapsed: z.ZodBoolean;
      },
      'strip',
      z.ZodTypeAny,
      {
        notifications?: {
          mobile?: boolean;
          email?: boolean;
          browser?: boolean;
        };
        language?: string;
        timezone?: string;
        dateFormat?: string;
        timeFormat?: '12h' | '24h';
        theme?: 'auto' | 'light' | 'dark';
        showOnboarding?: boolean;
        sidebarCollapsed?: boolean;
      },
      {
        notifications?: {
          mobile?: boolean;
          email?: boolean;
          browser?: boolean;
        };
        language?: string;
        timezone?: string;
        dateFormat?: string;
        timeFormat?: '12h' | '24h';
        theme?: 'auto' | 'light' | 'dark';
        showOnboarding?: boolean;
        sidebarCollapsed?: boolean;
      }
    >;
    stats: z.ZodObject<
      {
        groupCount: z.ZodNumber;
        surveyCount: z.ZodNumber;
        responseCount: z.ZodNumber;
        lastLoginAt: z.ZodOptional<z.ZodDate>;
        lastActivityAt: z.ZodOptional<z.ZodDate>;
        loginCount: z.ZodNumber;
      },
      'strip',
      z.ZodTypeAny,
      {
        groupCount?: number;
        surveyCount?: number;
        responseCount?: number;
        lastLoginAt?: Date;
        lastActivityAt?: Date;
        loginCount?: number;
      },
      {
        groupCount?: number;
        surveyCount?: number;
        responseCount?: number;
        lastLoginAt?: Date;
        lastActivityAt?: Date;
        loginCount?: number;
      }
    >;
    currentGroupId: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    lastActivity: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    currentGroupId?: string;
    permissions?: string[];
    lastActivity?: Date;
  },
  {
    name?: string;
    id?: string;
    email?: string;
    status?: 'deleted' | 'active' | 'suspended' | 'unverified';
    avatar?: string;
    systemRole?: 'user' | 'admin';
    emailVerified?: boolean;
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
    stats?: {
      groupCount?: number;
      surveyCount?: number;
      responseCount?: number;
      lastLoginAt?: Date;
      lastActivityAt?: Date;
      loginCount?: number;
    };
    currentGroupId?: string;
    permissions?: string[];
    lastActivity?: Date;
  }
>;
export declare const LoginCredentialsSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
    twoFactorCode: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
  },
  {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
  }
>;
export declare const RegisterDataSchema: z.ZodEffects<
  z.ZodObject<
    {
      email: z.ZodString;
      name: z.ZodString;
      password: z.ZodString;
      invitationToken: z.ZodOptional<z.ZodString>;
      agreeToTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
      agreeToPrivacy: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    },
    'strip',
    z.ZodTypeAny,
    {
      name?: string;
      email?: string;
      password?: string;
      invitationToken?: string;
      agreeToTerms?: boolean;
      agreeToPrivacy?: boolean;
    },
    {
      name?: string;
      email?: string;
      password?: string;
      invitationToken?: string;
      agreeToTerms?: boolean;
      agreeToPrivacy?: boolean;
    }
  >,
  {
    name?: string;
    email?: string;
    password?: string;
    invitationToken?: string;
    agreeToTerms?: boolean;
    agreeToPrivacy?: boolean;
  },
  {
    name?: string;
    email?: string;
    password?: string;
    invitationToken?: string;
    agreeToTerms?: boolean;
    agreeToPrivacy?: boolean;
  }
>;
export declare const UpdateProfileDataSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    contactInfo: z.ZodOptional<
      z.ZodObject<
        {
          phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          socialLinks: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
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
      >
    >;
    preferences: z.ZodOptional<
      z.ZodObject<
        {
          language: z.ZodOptional<z.ZodString>;
          timezone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
          dateFormat: z.ZodOptional<z.ZodString>;
          timeFormat: z.ZodOptional<z.ZodEnum<['12h', '24h']>>;
          theme: z.ZodOptional<z.ZodEnum<['light', 'dark', 'auto']>>;
          notifications: z.ZodOptional<
            z.ZodObject<
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
            >
          >;
          showOnboarding: z.ZodOptional<z.ZodBoolean>;
          sidebarCollapsed: z.ZodOptional<z.ZodBoolean>;
        },
        'strip',
        z.ZodTypeAny,
        {
          notifications?: {
            mobile?: boolean;
            email?: boolean;
            browser?: boolean;
          };
          language?: string;
          timezone?: string;
          dateFormat?: string;
          timeFormat?: '12h' | '24h';
          theme?: 'auto' | 'light' | 'dark';
          showOnboarding?: boolean;
          sidebarCollapsed?: boolean;
        },
        {
          notifications?: {
            mobile?: boolean;
            email?: boolean;
            browser?: boolean;
          };
          language?: string;
          timezone?: string;
          dateFormat?: string;
          timeFormat?: '12h' | '24h';
          theme?: 'auto' | 'light' | 'dark';
          showOnboarding?: boolean;
          sidebarCollapsed?: boolean;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    avatar?: string;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
  },
  {
    name?: string;
    avatar?: string;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
  }
>;
export declare const ChangePasswordDataSchema: z.ZodEffects<
  z.ZodEffects<
    z.ZodObject<
      {
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
        confirmPassword: z.ZodString;
      },
      'strip',
      z.ZodTypeAny,
      {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
      },
      {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
      }
    >,
    {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    },
    {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    }
  >,
  {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  },
  {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }
>;
export declare const ForgotPasswordDataSchema: z.ZodObject<
  {
    email: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email?: string;
  },
  {
    email?: string;
  }
>;
export declare const ResetPasswordDataSchema: z.ZodEffects<
  z.ZodObject<
    {
      token: z.ZodString;
      password: z.ZodString;
      confirmPassword: z.ZodString;
    },
    'strip',
    z.ZodTypeAny,
    {
      password?: string;
      confirmPassword?: string;
      token?: string;
    },
    {
      password?: string;
      confirmPassword?: string;
      token?: string;
    }
  >,
  {
    password?: string;
    confirmPassword?: string;
    token?: string;
  },
  {
    password?: string;
    confirmPassword?: string;
    token?: string;
  }
>;
export declare const TokenPayloadSchema: z.ZodObject<
  {
    userId: z.ZodString;
    email: z.ZodString;
    systemRole: z.ZodEnum<['admin', 'user']>;
    currentGroupId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<['access', 'refresh']>;
    iat: z.ZodNumber;
    exp: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: 'refresh' | 'access';
    email?: string;
    systemRole?: 'user' | 'admin';
    currentGroupId?: string;
    userId?: string;
    iat?: number;
    exp?: number;
  },
  {
    type?: 'refresh' | 'access';
    email?: string;
    systemRole?: 'user' | 'admin';
    currentGroupId?: string;
    userId?: string;
    iat?: number;
    exp?: number;
  }
>;
export declare const AuthTokensSchema: z.ZodObject<
  {
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
    tokenType: z.ZodLiteral<'Bearer'>;
  },
  'strip',
  z.ZodTypeAny,
  {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: 'Bearer';
  },
  {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: 'Bearer';
  }
>;
export declare const UserQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodArray<z.ZodEnum<['active', 'unverified', 'suspended', 'deleted']>, 'many'>
    >;
    systemRole: z.ZodOptional<z.ZodArray<z.ZodEnum<['admin', 'user']>, 'many'>>;
    emailVerified: z.ZodOptional<z.ZodBoolean>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
    lastLoginAfter: z.ZodOptional<z.ZodDate>;
    lastLoginBefore: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    status?: ('deleted' | 'active' | 'suspended' | 'unverified')[];
    systemRole?: ('user' | 'admin')[];
    emailVerified?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
  },
  {
    search?: string;
    status?: ('deleted' | 'active' | 'suspended' | 'unverified')[];
    systemRole?: ('user' | 'admin')[];
    emailVerified?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
  }
>;
export declare const UserActivitySchema: z.ZodObject<
  {
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<
      [
        'login',
        'logout',
        'profile_update',
        'password_change',
        'email_verify',
        'group_join',
        'group_leave',
      ]
    >;
    description: z.ZodString;
    resourceId: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?:
      | 'login'
      | 'logout'
      | 'profile_update'
      | 'password_change'
      | 'email_verify'
      | 'group_join'
      | 'group_leave';
    id?: string;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
    description?: string;
    userAgent?: string;
    userId?: string;
    resourceId?: string;
    resourceType?: string;
    ipAddress?: string;
  },
  {
    type?:
      | 'login'
      | 'logout'
      | 'profile_update'
      | 'password_change'
      | 'email_verify'
      | 'group_join'
      | 'group_leave';
    id?: string;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
    description?: string;
    userAgent?: string;
    userId?: string;
    resourceId?: string;
    resourceType?: string;
    ipAddress?: string;
  }
>;
export declare const DefaultUserPreferencesSchema: z.ZodObject<
  {
    language: z.ZodLiteral<'zh-TW'>;
    timezone: z.ZodLiteral<'Asia/Taipei'>;
    dateFormat: z.ZodLiteral<'YYYY-MM-DD'>;
    timeFormat: z.ZodLiteral<'24h'>;
    theme: z.ZodLiteral<'auto'>;
    notifications: z.ZodObject<
      {
        email: z.ZodLiteral<true>;
        browser: z.ZodLiteral<true>;
        mobile: z.ZodLiteral<true>;
      },
      'strip',
      z.ZodTypeAny,
      {
        mobile?: true;
        email?: true;
        browser?: true;
      },
      {
        mobile?: true;
        email?: true;
        browser?: true;
      }
    >;
    showOnboarding: z.ZodLiteral<true>;
    sidebarCollapsed: z.ZodLiteral<false>;
  },
  'strip',
  z.ZodTypeAny,
  {
    notifications?: {
      mobile?: true;
      email?: true;
      browser?: true;
    };
    language?: 'zh-TW';
    timezone?: 'Asia/Taipei';
    dateFormat?: 'YYYY-MM-DD';
    timeFormat?: '24h';
    theme?: 'auto';
    showOnboarding?: true;
    sidebarCollapsed?: false;
  },
  {
    notifications?: {
      mobile?: true;
      email?: true;
      browser?: true;
    };
    language?: 'zh-TW';
    timezone?: 'Asia/Taipei';
    dateFormat?: 'YYYY-MM-DD';
    timeFormat?: '24h';
    theme?: 'auto';
    showOnboarding?: true;
    sidebarCollapsed?: false;
  }
>;
export declare const DefaultUserStatsSchema: z.ZodObject<
  {
    groupCount: z.ZodLiteral<0>;
    surveyCount: z.ZodLiteral<0>;
    responseCount: z.ZodLiteral<0>;
    loginCount: z.ZodLiteral<0>;
  },
  'strip',
  z.ZodTypeAny,
  {
    groupCount?: 0;
    surveyCount?: 0;
    responseCount?: 0;
    loginCount?: 0;
  },
  {
    groupCount?: 0;
    surveyCount?: 0;
    responseCount?: 0;
    loginCount?: 0;
  }
>;
export declare const DefaultUserSecuritySchema: z.ZodObject<
  {
    twoFactorEnabled: z.ZodLiteral<false>;
  },
  'strip',
  z.ZodTypeAny,
  {
    twoFactorEnabled?: false;
  },
  {
    twoFactorEnabled?: false;
  }
>;
export declare const validateUserRegistration: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    email?: string;
    password?: string;
    invitationToken?: string;
    agreeToTerms?: boolean;
    agreeToPrivacy?: boolean;
  },
  {
    name?: string;
    email?: string;
    password?: string;
    invitationToken?: string;
    agreeToTerms?: boolean;
    agreeToPrivacy?: boolean;
  }
>;
export declare const validateUserLogin: (data: unknown) => z.SafeParseReturnType<
  {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
  },
  {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    twoFactorCode?: string;
  }
>;
export declare const validatePasswordChange: (data: unknown) => z.SafeParseReturnType<
  {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  },
  {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }
>;
export declare const validateProfileUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    avatar?: string;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
  },
  {
    name?: string;
    avatar?: string;
    bio?: string;
    contactInfo?: {
      address?: string;
      phone?: string;
      website?: string;
      socialLinks?: Record<string, string>;
    };
    preferences?: {
      notifications?: {
        mobile?: boolean;
        email?: boolean;
        browser?: boolean;
      };
      language?: string;
      timezone?: string;
      dateFormat?: string;
      timeFormat?: '12h' | '24h';
      theme?: 'auto' | 'light' | 'dark';
      showOnboarding?: boolean;
      sidebarCollapsed?: boolean;
    };
  }
>;
export declare const checkPasswordStrength: (password: string) => {
  score: number;
  feedback: string[];
};
export declare const isValidEmailDomain: (email: string) => boolean;
