/**
 * 邀請系統相關 Zod 驗證 schemas
 * 包含邀請實體、邀請流程、邀請狀態等相關驗證規則
 */
import { z } from 'zod';
export declare const InvitationStatusSchema: z.ZodEnum<
  ['pending', 'accepted', 'rejected', 'expired', 'cancelled']
>;
export declare const InvitationTypeSchema: z.ZodEnum<['email', 'link', 'internal']>;
export declare const InvitationSchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  } & {
    groupId: z.ZodString;
    inviterId: z.ZodString;
    email: z.ZodString;
    roleId: z.ZodString;
    token: z.ZodString;
    status: z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>;
    type: z.ZodEnum<['email', 'link', 'internal']>;
    message: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodDate;
    acceptedAt: z.ZodOptional<z.ZodDate>;
    rejectedAt: z.ZodOptional<z.ZodDate>;
    cancelledAt: z.ZodOptional<z.ZodDate>;
    source: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    id?: string;
    source?: string;
    metadata?: Record<string, unknown>;
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    token?: string;
    groupId?: string;
    roleId?: string;
    inviterId?: string;
    expiresAt?: Date;
    acceptedAt?: Date;
    rejectedAt?: Date;
    cancelledAt?: Date;
  },
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    id?: string;
    source?: string;
    metadata?: Record<string, unknown>;
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    token?: string;
    groupId?: string;
    roleId?: string;
    inviterId?: string;
    expiresAt?: Date;
    acceptedAt?: Date;
    rejectedAt?: Date;
    cancelledAt?: Date;
  }
>;
export declare const InvitationSummarySchema: z.ZodObject<
  {
    id: z.ZodString;
    groupId: z.ZodString;
    groupName: z.ZodString;
    inviterName: z.ZodString;
    inviterAvatar: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    roleName: z.ZodString;
    roleColor: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>;
    type: z.ZodEnum<['email', 'link', 'internal']>;
    message: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodDate;
    createdAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    id?: string;
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    createdAt?: Date;
    groupId?: string;
    roleName?: string;
    roleColor?: string;
    expiresAt?: Date;
    groupName?: string;
    inviterName?: string;
    inviterAvatar?: string;
  },
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    id?: string;
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    createdAt?: Date;
    groupId?: string;
    roleName?: string;
    roleColor?: string;
    expiresAt?: Date;
    groupName?: string;
    inviterName?: string;
    inviterAvatar?: string;
  }
>;
export declare const InvitationDetailsSchema: z.ZodObject<
  {
    id: z.ZodString;
    token: z.ZodString;
    status: z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>;
    group: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        memberCount: z.ZodNumber;
        subscriptionTier: z.ZodString;
      },
      'strip',
      z.ZodTypeAny,
      {
        name?: string;
        id?: string;
        description?: string;
        avatar?: string;
        memberCount?: number;
        subscriptionTier?: string;
      },
      {
        name?: string;
        id?: string;
        description?: string;
        avatar?: string;
        memberCount?: number;
        subscriptionTier?: string;
      }
    >;
    inviter: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
      },
      'strip',
      z.ZodTypeAny,
      {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
      },
      {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
      }
    >;
    role: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        permissions: z.ZodArray<z.ZodString, 'many'>;
      },
      'strip',
      z.ZodTypeAny,
      {
        name?: string;
        id?: string;
        color?: string;
        description?: string;
        permissions?: string[];
      },
      {
        name?: string;
        id?: string;
        color?: string;
        description?: string;
        permissions?: string[];
      }
    >;
    email: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodDate;
    createdAt: z.ZodDate;
    invitee: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          name: z.ZodString;
          avatar: z.ZodOptional<z.ZodString>;
          isRegistered: z.ZodBoolean;
        },
        'strip',
        z.ZodTypeAny,
        {
          name?: string;
          id?: string;
          avatar?: string;
          isRegistered?: boolean;
        },
        {
          name?: string;
          id?: string;
          avatar?: string;
          isRegistered?: boolean;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    message?: string;
    id?: string;
    role?: {
      name?: string;
      id?: string;
      color?: string;
      description?: string;
      permissions?: string[];
    };
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    group?: {
      name?: string;
      id?: string;
      description?: string;
      avatar?: string;
      memberCount?: number;
      subscriptionTier?: string;
    };
    createdAt?: Date;
    token?: string;
    expiresAt?: Date;
    inviter?: {
      name?: string;
      id?: string;
      email?: string;
      avatar?: string;
    };
    invitee?: {
      name?: string;
      id?: string;
      avatar?: string;
      isRegistered?: boolean;
    };
  },
  {
    message?: string;
    id?: string;
    role?: {
      name?: string;
      id?: string;
      color?: string;
      description?: string;
      permissions?: string[];
    };
    email?: string;
    status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
    group?: {
      name?: string;
      id?: string;
      description?: string;
      avatar?: string;
      memberCount?: number;
      subscriptionTier?: string;
    };
    createdAt?: Date;
    token?: string;
    expiresAt?: Date;
    inviter?: {
      name?: string;
      id?: string;
      email?: string;
      avatar?: string;
    };
    invitee?: {
      name?: string;
      id?: string;
      avatar?: string;
      isRegistered?: boolean;
    };
  }
>;
export declare const SendInvitationDataSchema: z.ZodObject<
  {
    email: z.ZodString;
    roleId: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<['email', 'link', 'internal']>>;
    expiresAt: z.ZodOptional<z.ZodEffects<z.ZodDate, Date, Date>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    email?: string;
    roleId?: string;
    expiresAt?: Date;
  },
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    email?: string;
    roleId?: string;
    expiresAt?: Date;
  }
>;
export declare const BulkInvitationDataSchema: z.ZodObject<
  {
    invitations: z.ZodArray<
      z.ZodObject<
        {
          email: z.ZodString;
          roleId: z.ZodString;
          message: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          message?: string;
          email?: string;
          roleId?: string;
        },
        {
          message?: string;
          email?: string;
          roleId?: string;
        }
      >,
      'many'
    >;
    defaultRoleId: z.ZodOptional<z.ZodString>;
    defaultMessage: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<['email', 'link', 'internal']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?: 'link' | 'internal' | 'email';
    invitations?: {
      message?: string;
      email?: string;
      roleId?: string;
    }[];
    defaultRoleId?: string;
    defaultMessage?: string;
  },
  {
    type?: 'link' | 'internal' | 'email';
    invitations?: {
      message?: string;
      email?: string;
      roleId?: string;
    }[];
    defaultRoleId?: string;
    defaultMessage?: string;
  }
>;
export declare const AcceptInvitationDataSchema: z.ZodObject<
  {
    token: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    metadata?: Record<string, unknown>;
    token?: string;
    userId?: string;
  },
  {
    metadata?: Record<string, unknown>;
    token?: string;
    userId?: string;
  }
>;
export declare const RejectInvitationDataSchema: z.ZodObject<
  {
    token: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    token?: string;
  },
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    token?: string;
  }
>;
export declare const ResendInvitationDataSchema: z.ZodObject<
  {
    invitationId: z.ZodString;
    newExpiresAt: z.ZodOptional<z.ZodEffects<z.ZodDate, Date, Date>>;
    newMessage: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    invitationId?: string;
    newExpiresAt?: Date;
    newMessage?: string;
  },
  {
    invitationId?: string;
    newExpiresAt?: Date;
    newMessage?: string;
  }
>;
export declare const InvitationQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    groupId: z.ZodOptional<z.ZodString>;
    inviterId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodArray<z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>, 'many'>
    >;
    type: z.ZodOptional<z.ZodArray<z.ZodEnum<['email', 'link', 'internal']>, 'many'>>;
    roleIds: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    includeExpired: z.ZodOptional<z.ZodBoolean>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
    expiresAfter: z.ZodOptional<z.ZodDate>;
    expiresBefore: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    type?: ('link' | 'internal' | 'email')[];
    status?: ('pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled')[];
    roleIds?: string[];
    createdAfter?: Date;
    createdBefore?: Date;
    groupId?: string;
    inviterId?: string;
    includeExpired?: boolean;
    expiresAfter?: Date;
    expiresBefore?: Date;
  },
  {
    search?: string;
    type?: ('link' | 'internal' | 'email')[];
    status?: ('pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled')[];
    roleIds?: string[];
    createdAfter?: Date;
    createdBefore?: Date;
    groupId?: string;
    inviterId?: string;
    includeExpired?: boolean;
    expiresAfter?: Date;
    expiresBefore?: Date;
  }
>;
export declare const InvitationStatsSchema: z.ZodObject<
  {
    total: z.ZodNumber;
    pending: z.ZodNumber;
    accepted: z.ZodNumber;
    rejected: z.ZodNumber;
    expired: z.ZodNumber;
    cancelled: z.ZodNumber;
    acceptanceRate: z.ZodNumber;
    responseRate: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    total?: number;
    pending?: number;
    expired?: number;
    rejected?: number;
    accepted?: number;
    cancelled?: number;
    acceptanceRate?: number;
    responseRate?: number;
  },
  {
    total?: number;
    pending?: number;
    expired?: number;
    rejected?: number;
    accepted?: number;
    cancelled?: number;
    acceptanceRate?: number;
    responseRate?: number;
  }
>;
export declare const BulkInvitationResultSchema: z.ZodObject<
  {
    total: z.ZodNumber;
    success: z.ZodNumber;
    failed: z.ZodNumber;
    skipped: z.ZodNumber;
    successful: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
        } & {
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
        } & {
          createdBy: z.ZodOptional<z.ZodString>;
          updatedBy: z.ZodOptional<z.ZodString>;
        } & {
          groupId: z.ZodString;
          inviterId: z.ZodString;
          email: z.ZodString;
          roleId: z.ZodString;
          token: z.ZodString;
          status: z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>;
          type: z.ZodEnum<['email', 'link', 'internal']>;
          message: z.ZodOptional<z.ZodString>;
          expiresAt: z.ZodDate;
          acceptedAt: z.ZodOptional<z.ZodDate>;
          rejectedAt: z.ZodOptional<z.ZodDate>;
          cancelledAt: z.ZodOptional<z.ZodDate>;
          source: z.ZodOptional<z.ZodString>;
          metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        },
        'strip',
        z.ZodTypeAny,
        {
          type?: 'link' | 'internal' | 'email';
          message?: string;
          id?: string;
          source?: string;
          metadata?: Record<string, unknown>;
          email?: string;
          status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
          createdAt?: Date;
          updatedAt?: Date;
          createdBy?: string;
          updatedBy?: string;
          token?: string;
          groupId?: string;
          roleId?: string;
          inviterId?: string;
          expiresAt?: Date;
          acceptedAt?: Date;
          rejectedAt?: Date;
          cancelledAt?: Date;
        },
        {
          type?: 'link' | 'internal' | 'email';
          message?: string;
          id?: string;
          source?: string;
          metadata?: Record<string, unknown>;
          email?: string;
          status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
          createdAt?: Date;
          updatedAt?: Date;
          createdBy?: string;
          updatedBy?: string;
          token?: string;
          groupId?: string;
          roleId?: string;
          inviterId?: string;
          expiresAt?: Date;
          acceptedAt?: Date;
          rejectedAt?: Date;
          cancelledAt?: Date;
        }
      >,
      'many'
    >;
    failures: z.ZodArray<
      z.ZodObject<
        {
          email: z.ZodString;
          error: z.ZodString;
          code: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          code?: string;
          error?: string;
          email?: string;
        },
        {
          code?: string;
          error?: string;
          email?: string;
        }
      >,
      'many'
    >;
    skipped_records: z.ZodArray<
      z.ZodObject<
        {
          email: z.ZodString;
          reason: z.ZodString;
        },
        'strip',
        z.ZodTypeAny,
        {
          reason?: string;
          email?: string;
        },
        {
          reason?: string;
          email?: string;
        }
      >,
      'many'
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    skipped?: number;
    total?: number;
    failed?: number;
    success?: number;
    successful?: {
      type?: 'link' | 'internal' | 'email';
      message?: string;
      id?: string;
      source?: string;
      metadata?: Record<string, unknown>;
      email?: string;
      status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
      createdAt?: Date;
      updatedAt?: Date;
      createdBy?: string;
      updatedBy?: string;
      token?: string;
      groupId?: string;
      roleId?: string;
      inviterId?: string;
      expiresAt?: Date;
      acceptedAt?: Date;
      rejectedAt?: Date;
      cancelledAt?: Date;
    }[];
    failures?: {
      code?: string;
      error?: string;
      email?: string;
    }[];
    skipped_records?: {
      reason?: string;
      email?: string;
    }[];
  },
  {
    skipped?: number;
    total?: number;
    failed?: number;
    success?: number;
    successful?: {
      type?: 'link' | 'internal' | 'email';
      message?: string;
      id?: string;
      source?: string;
      metadata?: Record<string, unknown>;
      email?: string;
      status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
      createdAt?: Date;
      updatedAt?: Date;
      createdBy?: string;
      updatedBy?: string;
      token?: string;
      groupId?: string;
      roleId?: string;
      inviterId?: string;
      expiresAt?: Date;
      acceptedAt?: Date;
      rejectedAt?: Date;
      cancelledAt?: Date;
    }[];
    failures?: {
      code?: string;
      error?: string;
      email?: string;
    }[];
    skipped_records?: {
      reason?: string;
      email?: string;
    }[];
  }
>;
export declare const InvitationActionResultSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodString;
    redirectUrl: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    data?: Record<string, unknown>;
    message?: string;
    success?: boolean;
    redirectUrl?: string;
  },
  {
    data?: Record<string, unknown>;
    message?: string;
    success?: boolean;
    redirectUrl?: string;
  }
>;
export declare const InvitationValidationResultSchema: z.ZodObject<
  {
    valid: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    errorCode: z.ZodOptional<
      z.ZodEnum<
        [
          'EXPIRED',
          'NOT_FOUND',
          'ALREADY_ACCEPTED',
          'ALREADY_REJECTED',
          'CANCELLED',
          'INVALID_TOKEN',
        ]
      >
    >;
    invitation: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          token: z.ZodString;
          status: z.ZodEnum<['pending', 'accepted', 'rejected', 'expired', 'cancelled']>;
          group: z.ZodObject<
            {
              id: z.ZodString;
              name: z.ZodString;
              description: z.ZodOptional<z.ZodString>;
              avatar: z.ZodOptional<z.ZodString>;
              memberCount: z.ZodNumber;
              subscriptionTier: z.ZodString;
            },
            'strip',
            z.ZodTypeAny,
            {
              name?: string;
              id?: string;
              description?: string;
              avatar?: string;
              memberCount?: number;
              subscriptionTier?: string;
            },
            {
              name?: string;
              id?: string;
              description?: string;
              avatar?: string;
              memberCount?: number;
              subscriptionTier?: string;
            }
          >;
          inviter: z.ZodObject<
            {
              id: z.ZodString;
              name: z.ZodString;
              email: z.ZodString;
              avatar: z.ZodOptional<z.ZodString>;
            },
            'strip',
            z.ZodTypeAny,
            {
              name?: string;
              id?: string;
              email?: string;
              avatar?: string;
            },
            {
              name?: string;
              id?: string;
              email?: string;
              avatar?: string;
            }
          >;
          role: z.ZodObject<
            {
              id: z.ZodString;
              name: z.ZodString;
              description: z.ZodOptional<z.ZodString>;
              color: z.ZodOptional<z.ZodString>;
              permissions: z.ZodArray<z.ZodString, 'many'>;
            },
            'strip',
            z.ZodTypeAny,
            {
              name?: string;
              id?: string;
              color?: string;
              description?: string;
              permissions?: string[];
            },
            {
              name?: string;
              id?: string;
              color?: string;
              description?: string;
              permissions?: string[];
            }
          >;
          email: z.ZodString;
          message: z.ZodOptional<z.ZodString>;
          expiresAt: z.ZodDate;
          createdAt: z.ZodDate;
          invitee: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
                name: z.ZodString;
                avatar: z.ZodOptional<z.ZodString>;
                isRegistered: z.ZodBoolean;
              },
              'strip',
              z.ZodTypeAny,
              {
                name?: string;
                id?: string;
                avatar?: string;
                isRegistered?: boolean;
              },
              {
                name?: string;
                id?: string;
                avatar?: string;
                isRegistered?: boolean;
              }
            >
          >;
        },
        'strip',
        z.ZodTypeAny,
        {
          message?: string;
          id?: string;
          role?: {
            name?: string;
            id?: string;
            color?: string;
            description?: string;
            permissions?: string[];
          };
          email?: string;
          status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
          group?: {
            name?: string;
            id?: string;
            description?: string;
            avatar?: string;
            memberCount?: number;
            subscriptionTier?: string;
          };
          createdAt?: Date;
          token?: string;
          expiresAt?: Date;
          inviter?: {
            name?: string;
            id?: string;
            email?: string;
            avatar?: string;
          };
          invitee?: {
            name?: string;
            id?: string;
            avatar?: string;
            isRegistered?: boolean;
          };
        },
        {
          message?: string;
          id?: string;
          role?: {
            name?: string;
            id?: string;
            color?: string;
            description?: string;
            permissions?: string[];
          };
          email?: string;
          status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
          group?: {
            name?: string;
            id?: string;
            description?: string;
            avatar?: string;
            memberCount?: number;
            subscriptionTier?: string;
          };
          createdAt?: Date;
          token?: string;
          expiresAt?: Date;
          inviter?: {
            name?: string;
            id?: string;
            email?: string;
            avatar?: string;
          };
          invitee?: {
            name?: string;
            id?: string;
            avatar?: string;
            isRegistered?: boolean;
          };
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    errorCode?:
      | 'EXPIRED'
      | 'NOT_FOUND'
      | 'ALREADY_ACCEPTED'
      | 'ALREADY_REJECTED'
      | 'CANCELLED'
      | 'INVALID_TOKEN';
    valid?: boolean;
    invitation?: {
      message?: string;
      id?: string;
      role?: {
        name?: string;
        id?: string;
        color?: string;
        description?: string;
        permissions?: string[];
      };
      email?: string;
      status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
      group?: {
        name?: string;
        id?: string;
        description?: string;
        avatar?: string;
        memberCount?: number;
        subscriptionTier?: string;
      };
      createdAt?: Date;
      token?: string;
      expiresAt?: Date;
      inviter?: {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
      };
      invitee?: {
        name?: string;
        id?: string;
        avatar?: string;
        isRegistered?: boolean;
      };
    };
  },
  {
    reason?: string;
    errorCode?:
      | 'EXPIRED'
      | 'NOT_FOUND'
      | 'ALREADY_ACCEPTED'
      | 'ALREADY_REJECTED'
      | 'CANCELLED'
      | 'INVALID_TOKEN';
    valid?: boolean;
    invitation?: {
      message?: string;
      id?: string;
      role?: {
        name?: string;
        id?: string;
        color?: string;
        description?: string;
        permissions?: string[];
      };
      email?: string;
      status?: 'pending' | 'expired' | 'rejected' | 'accepted' | 'cancelled';
      group?: {
        name?: string;
        id?: string;
        description?: string;
        avatar?: string;
        memberCount?: number;
        subscriptionTier?: string;
      };
      createdAt?: Date;
      token?: string;
      expiresAt?: Date;
      inviter?: {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
      };
      invitee?: {
        name?: string;
        id?: string;
        avatar?: string;
        isRegistered?: boolean;
      };
    };
  }
>;
export declare const InvitationSettingsSchema: z.ZodObject<
  {
    defaultExpirationDays: z.ZodNumber;
    maxExpirationDays: z.ZodNumber;
    allowResend: z.ZodBoolean;
    resendIntervalHours: z.ZodNumber;
    requireMessage: z.ZodBoolean;
    maxMessageLength: z.ZodNumber;
    autoCleanupExpired: z.ZodBoolean;
    cleanupAfterDays: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    defaultExpirationDays?: number;
    maxExpirationDays?: number;
    allowResend?: boolean;
    resendIntervalHours?: number;
    requireMessage?: boolean;
    maxMessageLength?: number;
    autoCleanupExpired?: boolean;
    cleanupAfterDays?: number;
  },
  {
    defaultExpirationDays?: number;
    maxExpirationDays?: number;
    allowResend?: boolean;
    resendIntervalHours?: number;
    requireMessage?: boolean;
    maxMessageLength?: number;
    autoCleanupExpired?: boolean;
    cleanupAfterDays?: number;
  }
>;
export declare const InvitationTemplateSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    messageTemplate: z.ZodString;
    subjectTemplate: z.ZodString;
    applicableRoles: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    isDefault: z.ZodBoolean;
    category: z.ZodEnum<['general', 'role_specific', 'onboarding', 'collaboration']>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    description?: string;
    category?: 'collaboration' | 'general' | 'role_specific' | 'onboarding';
    applicableRoles?: string[];
    messageTemplate?: string;
    subjectTemplate?: string;
    isDefault?: boolean;
  },
  {
    name?: string;
    id?: string;
    description?: string;
    category?: 'collaboration' | 'general' | 'role_specific' | 'onboarding';
    applicableRoles?: string[];
    messageTemplate?: string;
    subjectTemplate?: string;
    isDefault?: boolean;
  }
>;
export declare const InvitationEventSchema: z.ZodObject<
  {
    type: z.ZodEnum<
      [
        'invitation_sent',
        'invitation_accepted',
        'invitation_rejected',
        'invitation_expired',
        'invitation_cancelled',
      ]
    >;
    invitationId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?:
      | 'invitation_sent'
      | 'invitation_accepted'
      | 'invitation_rejected'
      | 'invitation_expired'
      | 'invitation_cancelled';
    data?: Record<string, unknown>;
    timestamp?: Date;
    userId?: string;
    invitationId?: string;
  },
  {
    type?:
      | 'invitation_sent'
      | 'invitation_accepted'
      | 'invitation_rejected'
      | 'invitation_expired'
      | 'invitation_cancelled';
    data?: Record<string, unknown>;
    timestamp?: Date;
    userId?: string;
    invitationId?: string;
  }
>;
export declare const InvitationLimitCheckSchema: z.ZodObject<
  {
    allowed: z.ZodBoolean;
    currentCount: z.ZodNumber;
    limit: z.ZodNumber;
    resetAt: z.ZodOptional<z.ZodDate>;
    reason: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    limit?: number;
    allowed?: boolean;
    currentCount?: number;
    resetAt?: Date;
  },
  {
    reason?: string;
    limit?: number;
    allowed?: boolean;
    currentCount?: number;
    resetAt?: Date;
  }
>;
export declare const DefaultInvitationSettingsSchema: z.ZodObject<
  {
    defaultExpirationDays: z.ZodLiteral<7>;
    maxExpirationDays: z.ZodLiteral<30>;
    allowResend: z.ZodLiteral<true>;
    resendIntervalHours: z.ZodLiteral<24>;
    requireMessage: z.ZodLiteral<false>;
    maxMessageLength: z.ZodLiteral<500>;
    autoCleanupExpired: z.ZodLiteral<true>;
    cleanupAfterDays: z.ZodLiteral<30>;
  },
  'strip',
  z.ZodTypeAny,
  {
    defaultExpirationDays?: 7;
    maxExpirationDays?: 30;
    allowResend?: true;
    resendIntervalHours?: 24;
    requireMessage?: false;
    maxMessageLength?: 500;
    autoCleanupExpired?: true;
    cleanupAfterDays?: 30;
  },
  {
    defaultExpirationDays?: 7;
    maxExpirationDays?: 30;
    allowResend?: true;
    resendIntervalHours?: 24;
    requireMessage?: false;
    maxMessageLength?: 500;
    autoCleanupExpired?: true;
    cleanupAfterDays?: 30;
  }
>;
export declare const DefaultInvitationTemplatesSchema: z.ZodArray<
  z.ZodObject<
    {
      id: z.ZodString;
      name: z.ZodString;
      description: z.ZodString;
      messageTemplate: z.ZodString;
      subjectTemplate: z.ZodString;
      applicableRoles: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
      isDefault: z.ZodBoolean;
      category: z.ZodEnum<['general', 'role_specific', 'onboarding', 'collaboration']>;
    },
    'strip',
    z.ZodTypeAny,
    {
      name?: string;
      id?: string;
      description?: string;
      category?: 'collaboration' | 'general' | 'role_specific' | 'onboarding';
      applicableRoles?: string[];
      messageTemplate?: string;
      subjectTemplate?: string;
      isDefault?: boolean;
    },
    {
      name?: string;
      id?: string;
      description?: string;
      category?: 'collaboration' | 'general' | 'role_specific' | 'onboarding';
      applicableRoles?: string[];
      messageTemplate?: string;
      subjectTemplate?: string;
      isDefault?: boolean;
    }
  >,
  'many'
>;
export declare const validateInvitationSending: (data: unknown) => z.SafeParseReturnType<
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    email?: string;
    roleId?: string;
    expiresAt?: Date;
  },
  {
    type?: 'link' | 'internal' | 'email';
    message?: string;
    email?: string;
    roleId?: string;
    expiresAt?: Date;
  }
>;
export declare const validateBulkInvitation: (data: unknown) => z.SafeParseReturnType<
  {
    type?: 'link' | 'internal' | 'email';
    invitations?: {
      message?: string;
      email?: string;
      roleId?: string;
    }[];
    defaultRoleId?: string;
    defaultMessage?: string;
  },
  {
    type?: 'link' | 'internal' | 'email';
    invitations?: {
      message?: string;
      email?: string;
      roleId?: string;
    }[];
    defaultRoleId?: string;
    defaultMessage?: string;
  }
>;
export declare const validateInvitationAcceptance: (data: unknown) => z.SafeParseReturnType<
  {
    metadata?: Record<string, unknown>;
    token?: string;
    userId?: string;
  },
  {
    metadata?: Record<string, unknown>;
    token?: string;
    userId?: string;
  }
>;
export declare const validateInvitationRejection: (data: unknown) => z.SafeParseReturnType<
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    token?: string;
  },
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    token?: string;
  }
>;
export declare const isInvitationExpired: (invitation: { expiresAt: Date }) => boolean;
export declare const canResendInvitation: (
  invitation: {
    status: string;
    createdAt: Date;
  },
  settings: {
    allowResend: boolean;
    resendIntervalHours: number;
  }
) => boolean;
export declare const validateInvitationEmail: (
  email: string,
  existingEmails: string[]
) => {
  valid: boolean;
  reason?: string;
};
export declare const replaceTemplateVariables: (
  template: string,
  variables: Record<string, string>
) => string;
export declare const calculateInvitationStats: (
  invitations: Array<{
    status: string;
  }>
) => z.infer<typeof InvitationStatsSchema>;
