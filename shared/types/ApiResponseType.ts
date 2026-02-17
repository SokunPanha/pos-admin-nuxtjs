// Auto-generated from OpenAPI spec — do not edit manually
// Generated at: 2026-02-16T16:42:13.051Z
// Source: http://localhost:4000/admin/docs-yaml

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateUserRequestType {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  roleName: string;
}

export interface RoleItemType {
  name: string;
  description: Record<string, unknown>;
}

export interface UserItemType {
  uuid: string;
  username: string;
  fullName: string;
  phone?: string;
  isActive: "Y" | "N";
  role: RoleItemType;
  createdAt: string;
  updatedAt: string;
}

export interface ListUserRequestType {
  username?: string;
  fullName?: string;
  isActive?: "Y" | "N";
  roleName?: string;
  page?: number;
  pageSize?: number;
}

export interface UserListResponseType {
  total: number;
  items: UserItemType[];
}

export interface UpdateUserRequestType {
  uuid: string;
  fullName?: string;
  phone?: string;
  password?: string;
}

export interface DeleteUserRequestType {
  uuid: string;
}

export interface UpdateUserStatusRequestType {
  uuid: string;
  isActive: "Y" | "N";
}

export interface AssignUserRoleRequestType {
  uuid: string;
  roleName: string;
}

// --- Role ---

export interface PermissionItemType {
  code: string;
  resource: string;
  action: string;
  description: Record<string, string>;
  createdAt: string;
}

export interface FullRoleItemType {
  name: string;
  description: Record<string, string>;
  isSystem: "Y" | "N";
  permissions: PermissionItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface ListRoleRequestType {
  name?: string;
  isSystem?: "Y" | "N";
  page?: number;
  pageSize?: number;
}

export interface RoleListResponseType {
  total: number;
  items: FullRoleItemType[];
}

export interface CreateRoleRequestType {
  name: string;
  description?: Record<string, string>;
  isSystem: "Y" | "N";
}

export interface UpdateRoleRequestType {
  name: string;
  newName?: string;
  description?: Record<string, string>;
}

export interface DeleteRoleRequestType {
  name: string;
}

export interface AssignRolePermissionsRequestType {
  name: string;
  permissionCodes: string[];
}

// --- Permission ---

export interface ListPermissionRequestType {
  code?: string;
  resource?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}

export interface PermissionListResponseType {
  total: number;
  items: PermissionItemType[];
}

export interface CreatePermissionRequestType {
  code: string;
  resource: string;
  action: string;
  description?: Record<string, string>;
}

export interface UpdatePermissionRequestType {
  code: string;
  description?: Record<string, string>;
}

export interface DeletePermissionRequestType {
  code: string;
}

// --- Master Data ---

export interface MasterPermissionItemType {
  code: string;
  resource: string;
  action: string;
  description: Record<string, string>;
}

export interface MasterPermissionListResponseType {
  items: MasterPermissionItemType[];
}

export interface MasterRoleItemType {
  name: string;
  description: Record<string, string>;
}

export interface MasterRoleListResponseType {
  items: MasterRoleItemType[];
}
