/**
 * 權限系統相關 Zod 驗證 schemas
 * 包含權限、角色、ABAC 模型等相關驗證規則
 */
import { z } from 'zod';
export declare const PermissionResourceSchema: z.ZodEnum<
  ['survey', 'analytics', 'team', 'role', 'group']
>;
export declare const PermissionActionSchema: z.ZodEnum<
  [
    'create',
    'read',
    'update',
    'delete',
    'manage',
    'publish',
    'duplicate',
    'export',
    'invite',
    'remove',
    'assign',
  ]
>;
export declare const PermissionScopeSchema: z.ZodEnum<['own', 'assigned', 'group', 'all']>;
export declare const PermissionCategorySchema: z.ZodEnum<['survey', 'analytics', 'team', 'role']>;
export declare const PermissionSchema: z.ZodObject<
  {
    id: z.ZodString;
    resource: z.ZodEnum<['survey', 'analytics', 'team', 'role', 'group']>;
    action: z.ZodEnum<
      [
        'create',
        'read',
        'update',
        'delete',
        'manage',
        'publish',
        'duplicate',
        'export',
        'invite',
        'remove',
        'assign',
      ]
    >;
    scope: z.ZodEnum<['own', 'assigned', 'group', 'all']>;
    description: z.ZodString;
    category: z.ZodEnum<['survey', 'analytics', 'team', 'role']>;
    createdAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    action?:
      | 'remove'
      | 'update'
      | 'create'
      | 'read'
      | 'delete'
      | 'manage'
      | 'publish'
      | 'duplicate'
      | 'export'
      | 'invite'
      | 'assign';
    description?: string;
    createdAt?: Date;
    resource?: 'role' | 'group' | 'team' | 'survey' | 'analytics';
    scope?: 'all' | 'group' | 'own' | 'assigned';
    category?: 'role' | 'team' | 'survey' | 'analytics';
  },
  {
    id?: string;
    action?:
      | 'remove'
      | 'update'
      | 'create'
      | 'read'
      | 'delete'
      | 'manage'
      | 'publish'
      | 'duplicate'
      | 'export'
      | 'invite'
      | 'assign';
    description?: string;
    createdAt?: Date;
    resource?: 'role' | 'group' | 'team' | 'survey' | 'analytics';
    scope?: 'all' | 'group' | 'own' | 'assigned';
    category?: 'role' | 'team' | 'survey' | 'analytics';
  }
>;
export declare const RoleSchema: z.ZodObject<
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
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    isSystemRole: z.ZodBoolean;
    isDeletable: z.ZodBoolean;
    isEditable: z.ZodBoolean;
    color: z.ZodOptional<z.ZodString>;
    memberCount: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    color?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    permissions?: string[];
    memberCount?: number;
    groupId?: string;
    isSystemRole?: boolean;
    isDeletable?: boolean;
    isEditable?: boolean;
  },
  {
    name?: string;
    id?: string;
    color?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    permissions?: string[];
    memberCount?: number;
    groupId?: string;
    isSystemRole?: boolean;
    isDeletable?: boolean;
    isEditable?: boolean;
  }
>;
export declare const RoleSummarySchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    isSystemRole: z.ZodBoolean;
    memberCount: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    color?: string;
    description?: string;
    memberCount?: number;
    isSystemRole?: boolean;
  },
  {
    name?: string;
    id?: string;
    color?: string;
    description?: string;
    memberCount?: number;
    isSystemRole?: boolean;
  }
>;
export declare const PermissionContextSchema: z.ZodObject<
  {
    userId: z.ZodString;
    groupId: z.ZodString;
    resourceId: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    attributes?: Record<string, unknown>;
    userId?: string;
    resourceId?: string;
    groupId?: string;
  },
  {
    attributes?: Record<string, unknown>;
    userId?: string;
    resourceId?: string;
    groupId?: string;
  }
>;
export declare const PermissionCheckResultSchema: z.ZodObject<
  {
    granted: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    userRole: z.ZodOptional<z.ZodString>;
    matchedPermissions: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    reason?: string;
    granted?: boolean;
    userRole?: string;
    matchedPermissions?: string[];
  },
  {
    reason?: string;
    granted?: boolean;
    userRole?: string;
    matchedPermissions?: string[];
  }
>;
export declare const CreateRoleDataSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    color: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  },
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  }
>;
export declare const UpdateRoleDataSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    color: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  },
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  }
>;
export declare const AssignRoleDataSchema: z.ZodObject<
  {
    userId: z.ZodString;
    roleId: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    userId?: string;
    roleId?: string;
  },
  {
    userId?: string;
    roleId?: string;
  }
>;
export declare const RoleQuerySchema: z.ZodObject<
  {
    search: z.ZodOptional<z.ZodString>;
    systemRolesOnly: z.ZodOptional<z.ZodBoolean>;
    customRolesOnly: z.ZodOptional<z.ZodBoolean>;
    editableOnly: z.ZodOptional<z.ZodBoolean>;
    hasPermissions: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
  },
  'strip',
  z.ZodTypeAny,
  {
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    systemRolesOnly?: boolean;
    customRolesOnly?: boolean;
    editableOnly?: boolean;
    hasPermissions?: string[];
  },
  {
    search?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    systemRolesOnly?: boolean;
    customRolesOnly?: boolean;
    editableOnly?: boolean;
    hasPermissions?: string[];
  }
>;
export declare const PermissionTemplateSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    category: z.ZodString;
    isRecommended: z.ZodBoolean;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    description?: string;
    category?: string;
    permissions?: string[];
    isRecommended?: boolean;
  },
  {
    name?: string;
    id?: string;
    description?: string;
    category?: string;
    permissions?: string[];
    isRecommended?: boolean;
  }
>;
export declare const PermissionBundleSchema: z.ZodObject<
  {
    name: z.ZodString;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    required: z.ZodBoolean;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    required?: boolean;
    permissions?: string[];
  },
  {
    name?: string;
    required?: boolean;
    permissions?: string[];
  }
>;
export declare const PermissionDependencySchema: z.ZodObject<
  {
    permission: z.ZodString;
    dependencies: z.ZodArray<z.ZodString, 'many'>;
    conflicts: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    dependencies?: string[];
    permission?: string;
    conflicts?: string[];
  },
  {
    dependencies?: string[];
    permission?: string;
    conflicts?: string[];
  }
>;
export declare const RoleAnalysisSchema: z.ZodObject<
  {
    roleId: z.ZodString;
    roleName: z.ZodString;
    permissionCount: z.ZodNumber;
    memberCount: z.ZodNumber;
    permissionsByCategory: z.ZodRecord<
      z.ZodEnum<['survey', 'analytics', 'team', 'role']>,
      z.ZodArray<z.ZodString, 'many'>
    >;
    missingRecommendedPermissions: z.ZodArray<z.ZodString, 'many'>;
    conflictingPermissions: z.ZodArray<z.ZodString, 'many'>;
    suggestedImprovements: z.ZodArray<z.ZodString, 'many'>;
  },
  'strip',
  z.ZodTypeAny,
  {
    memberCount?: number;
    roleName?: string;
    roleId?: string;
    permissionCount?: number;
    permissionsByCategory?: Partial<Record<'role' | 'team' | 'survey' | 'analytics', string[]>>;
    missingRecommendedPermissions?: string[];
    conflictingPermissions?: string[];
    suggestedImprovements?: string[];
  },
  {
    memberCount?: number;
    roleName?: string;
    roleId?: string;
    permissionCount?: number;
    permissionsByCategory?: Partial<Record<'role' | 'team' | 'survey' | 'analytics', string[]>>;
    missingRecommendedPermissions?: string[];
    conflictingPermissions?: string[];
    suggestedImprovements?: string[];
  }
>;
export declare const DefaultRoleConfigSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodString;
    permissions: z.ZodArray<z.ZodString, 'many'>;
    isSystemRole: z.ZodLiteral<true>;
    isDeletable: z.ZodBoolean;
    isEditable: z.ZodBoolean;
    color: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
    isSystemRole?: true;
    isDeletable?: boolean;
    isEditable?: boolean;
  },
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
    isSystemRole?: true;
    isDeletable?: boolean;
    isEditable?: boolean;
  }
>;
export declare const DefaultRolesSchema: z.ZodRecord<
  z.ZodEnum<['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']>,
  z.ZodObject<
    {
      name: z.ZodString;
      description: z.ZodString;
      permissions: z.ZodArray<z.ZodString, 'many'>;
      isSystemRole: z.ZodLiteral<true>;
      isDeletable: z.ZodBoolean;
      isEditable: z.ZodBoolean;
      color: z.ZodString;
    },
    'strip',
    z.ZodTypeAny,
    {
      name?: string;
      color?: string;
      description?: string;
      permissions?: string[];
      isSystemRole?: true;
      isDeletable?: boolean;
      isEditable?: boolean;
    },
    {
      name?: string;
      color?: string;
      description?: string;
      permissions?: string[];
      isSystemRole?: true;
      isDeletable?: boolean;
      isEditable?: boolean;
    }
  >
>;
export declare const PermissionDefinitionSchema: z.ZodRecord<
  z.ZodString,
  z.ZodObject<
    Omit<
      {
        id: z.ZodString;
        resource: z.ZodEnum<['survey', 'analytics', 'team', 'role', 'group']>;
        action: z.ZodEnum<
          [
            'create',
            'read',
            'update',
            'delete',
            'manage',
            'publish',
            'duplicate',
            'export',
            'invite',
            'remove',
            'assign',
          ]
        >;
        scope: z.ZodEnum<['own', 'assigned', 'group', 'all']>;
        description: z.ZodString;
        category: z.ZodEnum<['survey', 'analytics', 'team', 'role']>;
        createdAt: z.ZodDate;
      },
      'id' | 'createdAt'
    >,
    'strip',
    z.ZodTypeAny,
    {
      action?:
        | 'remove'
        | 'update'
        | 'create'
        | 'read'
        | 'delete'
        | 'manage'
        | 'publish'
        | 'duplicate'
        | 'export'
        | 'invite'
        | 'assign';
      description?: string;
      resource?: 'role' | 'group' | 'team' | 'survey' | 'analytics';
      scope?: 'all' | 'group' | 'own' | 'assigned';
      category?: 'role' | 'team' | 'survey' | 'analytics';
    },
    {
      action?:
        | 'remove'
        | 'update'
        | 'create'
        | 'read'
        | 'delete'
        | 'manage'
        | 'publish'
        | 'duplicate'
        | 'export'
        | 'invite'
        | 'assign';
      description?: string;
      resource?: 'role' | 'group' | 'team' | 'survey' | 'analytics';
      scope?: 'all' | 'group' | 'own' | 'assigned';
      category?: 'role' | 'team' | 'survey' | 'analytics';
    }
  >
>;
export declare const PermissionTemplatesSchema: z.ZodArray<
  z.ZodObject<
    {
      id: z.ZodString;
      name: z.ZodString;
      description: z.ZodString;
      permissions: z.ZodArray<z.ZodString, 'many'>;
      category: z.ZodString;
      isRecommended: z.ZodBoolean;
    },
    'strip',
    z.ZodTypeAny,
    {
      name?: string;
      id?: string;
      description?: string;
      category?: string;
      permissions?: string[];
      isRecommended?: boolean;
    },
    {
      name?: string;
      id?: string;
      description?: string;
      category?: string;
      permissions?: string[];
      isRecommended?: boolean;
    }
  >,
  'many'
>;
export declare const validateRoleCreation: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  },
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  }
>;
export declare const validateRoleUpdate: (data: unknown) => z.SafeParseReturnType<
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  },
  {
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  }
>;
export declare const validateRoleAssignment: (data: unknown) => z.SafeParseReturnType<
  {
    userId?: string;
    roleId?: string;
  },
  {
    userId?: string;
    roleId?: string;
  }
>;
export declare const validatePermissionContext: (data: unknown) => z.SafeParseReturnType<
  {
    attributes?: Record<string, unknown>;
    userId?: string;
    resourceId?: string;
    groupId?: string;
  },
  {
    attributes?: Record<string, unknown>;
    userId?: string;
    resourceId?: string;
    groupId?: string;
  }
>;
export declare const isValidPermissionId: (permissionId: string) => boolean;
export declare const parsePermissionId: (permissionId: string) => {
  resource: string;
  action: string;
  scope?: string;
} | null;
export declare const hasWildcardPermission: (permissions: string[]) => boolean;
export declare const matchesPermissionPattern: (permission: string, patterns: string[]) => boolean;
export declare const checkPermissionConflicts: (permissions: string[]) => string[];
export declare const suggestRolePermissions: (roleName: string) => string[];
