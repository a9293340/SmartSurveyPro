/**
 * 關聯表相關 Zod 驗證 schemas
 * 包含用戶-群組-角色關聯、成員管理等相關驗證規則
 */
import { z } from 'zod';
export declare const UserGroupStatusSchema: z.ZodEnum<['active', 'pending', 'blocked', 'removed']>;
export declare const JoinSourceSchema: z.ZodEnum<['invitation', 'direct', 'import', 'system']>;
export declare const UserGroupRoleSchema: z.ZodObject<
  {
    id: z.ZodString;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
  } & {
    userId: z.ZodString;
    groupId: z.ZodString;
    roleId: z.ZodString;
    status: z.ZodEnum<['active', 'pending', 'blocked', 'removed']>;
    joinedAt: z.ZodDate;
    invitedBy: z.ZodOptional<z.ZodString>;
    lastActivityAt: z.ZodOptional<z.ZodDate>;
    removedAt: z.ZodOptional<z.ZodDate>;
    removedBy: z.ZodOptional<z.ZodString>;
    removeReason: z.ZodOptional<z.ZodString>;
    joinSource: z.ZodOptional<z.ZodEnum<['invitation', 'direct', 'import', 'system']>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    metadata?: Record<string, unknown>;
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    invitedBy?: string;
    lastActivityAt?: Date;
    userId?: string;
    groupId?: string;
    joinedAt?: Date;
    roleId?: string;
    removedAt?: Date;
    removedBy?: string;
    removeReason?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  },
  {
    id?: string;
    metadata?: Record<string, unknown>;
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    invitedBy?: string;
    lastActivityAt?: Date;
    userId?: string;
    groupId?: string;
    joinedAt?: Date;
    roleId?: string;
    removedAt?: Date;
    removedBy?: string;
    removeReason?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  }
>;
export declare const MemberDetailsSchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    userId: z.ZodString;
    groupId: z.ZodString;
    roleId: z.ZodString;
    status: z.ZodEnum<['active', 'pending', 'blocked', 'removed']>;
    joinedAt: z.ZodDate;
    lastActivityAt: z.ZodOptional<z.ZodDate>;
    user: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        emailVerified: z.ZodBoolean;
        lastLoginAt: z.ZodOptional<z.ZodDate>;
      },
      'strip',
      z.ZodTypeAny,
      {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
        emailVerified?: boolean;
        lastLoginAt?: Date;
      },
      {
        name?: string;
        id?: string;
        email?: string;
        avatar?: string;
        emailVerified?: boolean;
        lastLoginAt?: Date;
      }
    >;
    role: z.ZodObject<
      {
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        isSystemRole: z.ZodBoolean;
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
        isSystemRole?: boolean;
      },
      {
        name?: string;
        id?: string;
        color?: string;
        description?: string;
        permissions?: string[];
        isSystemRole?: boolean;
      }
    >;
    invitedBy: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          name: z.ZodString;
          email: z.ZodString;
        },
        'strip',
        z.ZodTypeAny,
        {
          name?: string;
          id?: string;
          email?: string;
        },
        {
          name?: string;
          id?: string;
          email?: string;
        }
      >
    >;
    stats: z.ZodOptional<
      z.ZodObject<
        {
          surveysCreated: z.ZodNumber;
          responsesReceived: z.ZodNumber;
          lastSurveyAt: z.ZodOptional<z.ZodDate>;
          activityScore: z.ZodNumber;
        },
        'strip',
        z.ZodTypeAny,
        {
          surveysCreated?: number;
          responsesReceived?: number;
          lastSurveyAt?: Date;
          activityScore?: number;
        },
        {
          surveysCreated?: number;
          responsesReceived?: number;
          lastSurveyAt?: Date;
          activityScore?: number;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    role?: {
      name?: string;
      id?: string;
      color?: string;
      description?: string;
      permissions?: string[];
      isSystemRole?: boolean;
    };
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    user?: {
      name?: string;
      id?: string;
      email?: string;
      avatar?: string;
      emailVerified?: boolean;
      lastLoginAt?: Date;
    };
    stats?: {
      surveysCreated?: number;
      responsesReceived?: number;
      lastSurveyAt?: Date;
      activityScore?: number;
    };
    invitedBy?: {
      name?: string;
      id?: string;
      email?: string;
    };
    lastActivityAt?: Date;
    userId?: string;
    groupId?: string;
    joinedAt?: Date;
    roleId?: string;
    relationshipId?: string;
  },
  {
    role?: {
      name?: string;
      id?: string;
      color?: string;
      description?: string;
      permissions?: string[];
      isSystemRole?: boolean;
    };
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    user?: {
      name?: string;
      id?: string;
      email?: string;
      avatar?: string;
      emailVerified?: boolean;
      lastLoginAt?: Date;
    };
    stats?: {
      surveysCreated?: number;
      responsesReceived?: number;
      lastSurveyAt?: Date;
      activityScore?: number;
    };
    invitedBy?: {
      name?: string;
      id?: string;
      email?: string;
    };
    lastActivityAt?: Date;
    userId?: string;
    groupId?: string;
    joinedAt?: Date;
    roleId?: string;
    relationshipId?: string;
  }
>;
export declare const MemberSummarySchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    userId: z.ZodString;
    userName: z.ZodString;
    userEmail: z.ZodString;
    userAvatar: z.ZodOptional<z.ZodString>;
    roleName: z.ZodString;
    roleColor: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<['active', 'pending', 'blocked', 'removed']>;
    joinedAt: z.ZodDate;
    lastActivityAt: z.ZodOptional<z.ZodDate>;
    isOnline: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    lastActivityAt?: Date;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    roleName?: string;
    roleColor?: string;
    joinedAt?: Date;
    relationshipId?: string;
    isOnline?: boolean;
  },
  {
    status?: 'active' | 'removed' | 'pending' | 'blocked';
    lastActivityAt?: Date;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    roleName?: string;
    roleColor?: string;
    joinedAt?: Date;
    relationshipId?: string;
    isOnline?: boolean;
  }
>;
export declare const AddMemberDataSchema: z.ZodObject<
  {
    userId: z.ZodString;
    roleId: z.ZodString;
    joinSource: z.ZodOptional<z.ZodEnum<['invitation', 'direct', 'import', 'system']>>;
    invitedBy: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    metadata?: Record<string, unknown>;
    invitedBy?: string;
    userId?: string;
    roleId?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  },
  {
    metadata?: Record<string, unknown>;
    invitedBy?: string;
    userId?: string;
    roleId?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  }
>;
export declare const UpdateMemberRoleDataSchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    newRoleId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    relationshipId?: string;
    newRoleId?: string;
  },
  {
    reason?: string;
    relationshipId?: string;
    newRoleId?: string;
  }
>;
export declare const UpdateMemberStatusDataSchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    newStatus: z.ZodEnum<['active', 'pending', 'blocked', 'removed']>;
    reason: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    relationshipId?: string;
    newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
  },
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    relationshipId?: string;
    newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
  }
>;
export declare const RemoveMemberDataSchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    softDelete: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    relationshipId?: string;
    softDelete?: boolean;
  },
  {
    reason?: string;
    relationshipId?: string;
    softDelete?: boolean;
  }
>;
export declare const BulkMemberOperationDataSchema: z.ZodObject<
  {
    relationshipIds: z.ZodArray<z.ZodString, 'many'>;
    operation: z.ZodEnum<['update_role', 'update_status', 'remove']>;
    params: z.ZodObject<
      {
        newRoleId: z.ZodOptional<z.ZodString>;
        newStatus: z.ZodOptional<z.ZodEnum<['active', 'pending', 'blocked', 'removed']>>;
        reason: z.ZodOptional<z.ZodString>;
      },
      'strip',
      z.ZodTypeAny,
      {
        reason?: string;
        newRoleId?: string;
        newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
      },
      {
        reason?: string;
        newRoleId?: string;
        newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
      }
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    params?: {
      reason?: string;
      newRoleId?: string;
      newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
    };
    relationshipIds?: string[];
    operation?: 'remove' | 'update_role' | 'update_status';
  },
  {
    params?: {
      reason?: string;
      newRoleId?: string;
      newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
    };
    relationshipIds?: string[];
    operation?: 'remove' | 'update_role' | 'update_status';
  }
>;
export declare const MemberQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    roleIds: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    status: z.ZodOptional<
      z.ZodArray<z.ZodEnum<['active', 'pending', 'blocked', 'removed']>, 'many'>
    >;
    onlineOnly: z.ZodOptional<z.ZodBoolean>;
    joinedAfter: z.ZodOptional<z.ZodDate>;
    joinedBefore: z.ZodOptional<z.ZodDate>;
    lastActivityAfter: z.ZodOptional<z.ZodDate>;
    lastActivityBefore: z.ZodOptional<z.ZodDate>;
    joinSources: z.ZodOptional<
      z.ZodArray<z.ZodEnum<['invitation', 'direct', 'import', 'system']>, 'many'>
    >;
    invitedBy: z.ZodOptional<z.ZodString>;
    includeRemoved: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    status?: ('active' | 'removed' | 'pending' | 'blocked')[];
    roleIds?: string[];
    onlineOnly?: boolean;
    joinedAfter?: Date;
    joinedBefore?: Date;
    lastActivityAfter?: Date;
    lastActivityBefore?: Date;
    joinSources?: ('direct' | 'invitation' | 'import' | 'system')[];
    invitedBy?: string;
    includeRemoved?: boolean;
  },
  {
    search?: string;
    status?: ('active' | 'removed' | 'pending' | 'blocked')[];
    roleIds?: string[];
    onlineOnly?: boolean;
    joinedAfter?: Date;
    joinedBefore?: Date;
    lastActivityAfter?: Date;
    lastActivityBefore?: Date;
    joinSources?: ('direct' | 'invitation' | 'import' | 'system')[];
    invitedBy?: string;
    includeRemoved?: boolean;
  }
>;
export declare const BulkMemberOperationResultSchema: z.ZodObject<
  {
    total: z.ZodNumber;
    success: z.ZodNumber;
    failed: z.ZodNumber;
    skipped: z.ZodNumber;
    successful: z.ZodArray<z.ZodString, 'many'>;
    failures: z.ZodArray<
      z.ZodObject<
        {
          relationshipId: z.ZodString;
          error: z.ZodString;
          code: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          code?: string;
          error?: string;
          relationshipId?: string;
        },
        {
          code?: string;
          error?: string;
          relationshipId?: string;
        }
      >,
      'many'
    >;
    skipped_records: z.ZodArray<
      z.ZodObject<
        {
          relationshipId: z.ZodString;
          reason: z.ZodString;
        },
        'strip',
        z.ZodTypeAny,
        {
          reason?: string;
          relationshipId?: string;
        },
        {
          reason?: string;
          relationshipId?: string;
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
    successful?: string[];
    failures?: {
      code?: string;
      error?: string;
      relationshipId?: string;
    }[];
    skipped_records?: {
      reason?: string;
      relationshipId?: string;
    }[];
  },
  {
    skipped?: number;
    total?: number;
    failed?: number;
    success?: number;
    successful?: string[];
    failures?: {
      code?: string;
      error?: string;
      relationshipId?: string;
    }[];
    skipped_records?: {
      reason?: string;
      relationshipId?: string;
    }[];
  }
>;
export declare const MemberActivitySchema: z.ZodObject<
  {
    id: z.ZodString;
    relationshipId: z.ZodString;
    userId: z.ZodString;
    groupId: z.ZodString;
    type: z.ZodEnum<
      ['join', 'leave', 'role_change', 'status_change', 'activity', 'login', 'survey_action']
    >;
    description: z.ZodString;
    oldValue: z.ZodOptional<z.ZodString>;
    newValue: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    actorId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    type?:
      | 'join'
      | 'login'
      | 'leave'
      | 'role_change'
      | 'status_change'
      | 'activity'
      | 'survey_action';
    id?: string;
    timestamp?: Date;
    newValue?: string;
    oldValue?: string;
    metadata?: Record<string, unknown>;
    description?: string;
    userId?: string;
    resourceId?: string;
    groupId?: string;
    relationshipId?: string;
    actorId?: string;
  },
  {
    type?:
      | 'join'
      | 'login'
      | 'leave'
      | 'role_change'
      | 'status_change'
      | 'activity'
      | 'survey_action';
    id?: string;
    timestamp?: Date;
    newValue?: string;
    oldValue?: string;
    metadata?: Record<string, unknown>;
    description?: string;
    userId?: string;
    resourceId?: string;
    groupId?: string;
    relationshipId?: string;
    actorId?: string;
  }
>;
export declare const MemberStatsSchema: z.ZodObject<
  {
    total: z.ZodNumber;
    active: z.ZodNumber;
    pending: z.ZodNumber;
    blocked: z.ZodNumber;
    newThisMonth: z.ZodNumber;
    byRole: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byJoinSource: z.ZodRecord<z.ZodString, z.ZodNumber>;
    averageDaysActive: z.ZodNumber;
    activeRate: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    total?: number;
    active?: number;
    pending?: number;
    blocked?: number;
    newThisMonth?: number;
    byRole?: Record<string, number>;
    byJoinSource?: Record<string, number>;
    averageDaysActive?: number;
    activeRate?: number;
  },
  {
    total?: number;
    active?: number;
    pending?: number;
    blocked?: number;
    newThisMonth?: number;
    byRole?: Record<string, number>;
    byJoinSource?: Record<string, number>;
    averageDaysActive?: number;
    activeRate?: number;
  }
>;
export declare const MemberPermissionSummarySchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    userId: z.ZodString;
    groupId: z.ZodString;
    roleId: z.ZodString;
    roleName: z.ZodString;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    isOwner: z.ZodBoolean;
    isAdmin: z.ZodBoolean;
    permissionLevel: z.ZodNumber;
    canManageMembers: z.ZodArray<z.ZodString, 'many'>;
  },
  'strip',
  z.ZodTypeAny,
  {
    permissions?: string[];
    userId?: string;
    groupId?: string;
    roleName?: string;
    roleId?: string;
    relationshipId?: string;
    isOwner?: boolean;
    isAdmin?: boolean;
    permissionLevel?: number;
    canManageMembers?: string[];
  },
  {
    permissions?: string[];
    userId?: string;
    groupId?: string;
    roleName?: string;
    roleId?: string;
    relationshipId?: string;
    isOwner?: boolean;
    isAdmin?: boolean;
    permissionLevel?: number;
    canManageMembers?: string[];
  }
>;
export declare const RoleTransferDataSchema: z.ZodObject<
  {
    fromRelationshipId: z.ZodString;
    toRelationshipId: z.ZodString;
    roleId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    immediate: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    roleId?: string;
    fromRelationshipId?: string;
    toRelationshipId?: string;
    immediate?: boolean;
  },
  {
    reason?: string;
    roleId?: string;
    fromRelationshipId?: string;
    toRelationshipId?: string;
    immediate?: boolean;
  }
>;
export declare const MemberInviteStatsSchema: z.ZodObject<
  {
    totalInvites: z.ZodNumber;
    successfulJoins: z.ZodNumber;
    pendingInvites: z.ZodNumber;
    successRate: z.ZodNumber;
    byInviter: z.ZodArray<
      z.ZodObject<
        {
          inviterId: z.ZodString;
          inviterName: z.ZodString;
          inviteCount: z.ZodNumber;
          successCount: z.ZodNumber;
          successRate: z.ZodNumber;
        },
        'strip',
        z.ZodTypeAny,
        {
          inviterId?: string;
          inviterName?: string;
          successRate?: number;
          inviteCount?: number;
          successCount?: number;
        },
        {
          inviterId?: string;
          inviterName?: string;
          successRate?: number;
          inviteCount?: number;
          successCount?: number;
        }
      >,
      'many'
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    totalInvites?: number;
    successfulJoins?: number;
    pendingInvites?: number;
    successRate?: number;
    byInviter?: {
      inviterId?: string;
      inviterName?: string;
      successRate?: number;
      inviteCount?: number;
      successCount?: number;
    }[];
  },
  {
    totalInvites?: number;
    successfulJoins?: number;
    pendingInvites?: number;
    successRate?: number;
    byInviter?: {
      inviterId?: string;
      inviterName?: string;
      successRate?: number;
      inviteCount?: number;
      successCount?: number;
    }[];
  }
>;
export declare const MemberOperationLogSchema: z.ZodObject<
  {
    id: z.ZodString;
    relationshipId: z.ZodString;
    operation: z.ZodEnum<['add', 'remove', 'role_change', 'status_change', 'permission_change']>;
    operatorId: z.ZodString;
    operatorName: z.ZodString;
    targetUserId: z.ZodString;
    targetUserName: z.ZodString;
    details: z.ZodString;
    beforeState: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    afterState: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    timestamp: z.ZodDate;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    timestamp?: Date;
    details?: string;
    userAgent?: string;
    ipAddress?: string;
    relationshipId?: string;
    operation?: 'add' | 'remove' | 'role_change' | 'status_change' | 'permission_change';
    operatorId?: string;
    operatorName?: string;
    targetUserId?: string;
    targetUserName?: string;
    beforeState?: Record<string, unknown>;
    afterState?: Record<string, unknown>;
  },
  {
    id?: string;
    timestamp?: Date;
    details?: string;
    userAgent?: string;
    ipAddress?: string;
    relationshipId?: string;
    operation?: 'add' | 'remove' | 'role_change' | 'status_change' | 'permission_change';
    operatorId?: string;
    operatorName?: string;
    targetUserId?: string;
    targetUserName?: string;
    beforeState?: Record<string, unknown>;
    afterState?: Record<string, unknown>;
  }
>;
export declare const QuickMemberActionSchema: z.ZodEnum<
  ['promote_to_admin', 'demote_to_editor', 'demote_to_viewer', 'block', 'unblock', 'remove']
>;
export declare const QuickMemberActionDataSchema: z.ZodObject<
  {
    relationshipId: z.ZodString;
    action: z.ZodEnum<
      ['promote_to_admin', 'demote_to_editor', 'demote_to_viewer', 'block', 'unblock', 'remove']
    >;
    reason: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    action?:
      | 'block'
      | 'remove'
      | 'promote_to_admin'
      | 'demote_to_editor'
      | 'demote_to_viewer'
      | 'unblock';
    relationshipId?: string;
  },
  {
    reason?: string;
    action?:
      | 'block'
      | 'remove'
      | 'promote_to_admin'
      | 'demote_to_editor'
      | 'demote_to_viewer'
      | 'unblock';
    relationshipId?: string;
  }
>;
export declare const DefaultMemberQuerySchema: z.ZodObject<
  {
    status: z.ZodArray<z.ZodLiteral<'active'>, 'many'>;
    includeRemoved: z.ZodLiteral<false>;
    onlineOnly: z.ZodLiteral<false>;
  },
  'strip',
  z.ZodTypeAny,
  {
    status?: 'active'[];
    onlineOnly?: false;
    includeRemoved?: false;
  },
  {
    status?: 'active'[];
    onlineOnly?: false;
    includeRemoved?: false;
  }
>;
export declare const MemberPermissionLevelsSchema: z.ZodObject<
  {
    OWNER: z.ZodLiteral<100>;
    ADMIN: z.ZodLiteral<80>;
    EDITOR: z.ZodLiteral<60>;
    VIEWER: z.ZodLiteral<20>;
    CUSTOM: z.ZodLiteral<50>;
  },
  'strip',
  z.ZodTypeAny,
  {
    OWNER?: 100;
    ADMIN?: 80;
    EDITOR?: 60;
    VIEWER?: 20;
    CUSTOM?: 50;
  },
  {
    OWNER?: 100;
    ADMIN?: 80;
    EDITOR?: 60;
    VIEWER?: 20;
    CUSTOM?: 50;
  }
>;
export declare const validateMemberAddition: (data: unknown) => z.SafeParseReturnType<
  {
    metadata?: Record<string, unknown>;
    invitedBy?: string;
    userId?: string;
    roleId?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  },
  {
    metadata?: Record<string, unknown>;
    invitedBy?: string;
    userId?: string;
    roleId?: string;
    joinSource?: 'direct' | 'invitation' | 'import' | 'system';
  }
>;
export declare const validateMemberRoleUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    reason?: string;
    relationshipId?: string;
    newRoleId?: string;
  },
  {
    reason?: string;
    relationshipId?: string;
    newRoleId?: string;
  }
>;
export declare const validateMemberStatusUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    relationshipId?: string;
    newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
  },
  {
    reason?: string;
    metadata?: Record<string, unknown>;
    relationshipId?: string;
    newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
  }
>;
export declare const validateMemberRemoval: (data: unknown) => z.SafeParseReturnType<
  {
    reason?: string;
    relationshipId?: string;
    softDelete?: boolean;
  },
  {
    reason?: string;
    relationshipId?: string;
    softDelete?: boolean;
  }
>;
export declare const validateBulkMemberOperation: (data: unknown) => z.SafeParseReturnType<
  {
    params?: {
      reason?: string;
      newRoleId?: string;
      newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
    };
    relationshipIds?: string[];
    operation?: 'remove' | 'update_role' | 'update_status';
  },
  {
    params?: {
      reason?: string;
      newRoleId?: string;
      newStatus?: 'active' | 'removed' | 'pending' | 'blocked';
    };
    relationshipIds?: string[];
    operation?: 'remove' | 'update_role' | 'update_status';
  }
>;
export declare const validateQuickMemberAction: (data: unknown) => z.SafeParseReturnType<
  {
    reason?: string;
    action?:
      | 'block'
      | 'remove'
      | 'promote_to_admin'
      | 'demote_to_editor'
      | 'demote_to_viewer'
      | 'unblock';
    relationshipId?: string;
  },
  {
    reason?: string;
    action?:
      | 'block'
      | 'remove'
      | 'promote_to_admin'
      | 'demote_to_editor'
      | 'demote_to_viewer'
      | 'unblock';
    relationshipId?: string;
  }
>;
export declare const canUpdateMemberRole: (
  operatorPermissionLevel: number,
  targetPermissionLevel: number,
  newPermissionLevel: number
) => {
  allowed: boolean;
  reason?: string;
};
export declare const canRemoveMember: (
  operatorPermissionLevel: number,
  targetPermissionLevel: number,
  isOwner: boolean
) => {
  allowed: boolean;
  reason?: string;
};
export declare const calculateActivityScore: (stats: {
  surveysCreated: number;
  responsesReceived: number;
  lastSurveyAt?: Date;
  lastActivityAt?: Date;
}) => number;
export declare const validateStatusTransition: (
  currentStatus: z.infer<typeof UserGroupStatusSchema>,
  newStatus: z.infer<typeof UserGroupStatusSchema>
) => {
  valid: boolean;
  reason?: string;
};
