// Auto-generated from OpenAPI spec — do not edit manually
// Generated at: 2026-02-17T07:26:46.575Z
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

export interface UserRoleItemType {
  name: string;
  description: Record<string, unknown>;
}

export interface UserItemType {
  uuid: string;
  username: string;
  fullName: string;
  phone?: string;
  isActive: "Y" | "N";
  role: UserRoleItemType;
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

export interface CreateRoleRequestType {
  name: string;
  description?: Record<string, unknown>;
  isSystem: "Y" | "N";
}

export interface RolePermissionItemType {
  code: string;
  resource: string;
  action: string;
  description: Record<string, unknown>;
}

export interface RoleItemType {
  name: string;
  description: Record<string, unknown>;
  isSystem: "Y" | "N";
  permissions: RolePermissionItemType[];
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
  items: RoleItemType[];
}

export interface UpdateRoleRequestType {
  name: string;
  newName?: string;
  description?: Record<string, unknown>;
}

export interface DeleteRoleRequestType {
  name: string;
}

export interface AssignRolePermissionsRequestType {
  name: string;
  permissionCodes: string[];
}

export interface CreatePermissionRequestType {
  code: string;
  resource: string;
  action: string;
  description?: Record<string, unknown>;
}

export interface PermissionItemType {
  code: string;
  resource: string;
  action: string;
  description: Record<string, unknown>;
  createdAt: string;
}

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

export interface UpdatePermissionRequestType {
  code: string;
  description?: Record<string, unknown>;
}

export interface DeletePermissionRequestType {
  code: string;
}

export interface MasterPermissionListRequestType {
  resource?: string;
}

export interface MasterPermissionItemType {
  code: string;
  resource: string;
  action: string;
  description: Record<string, unknown>;
}

export interface MasterPermissionListResponseType {
  items: MasterPermissionItemType[];
}

export interface MasterRoleListRequestType {
  name?: string;
}

export interface MasterRoleItemType {
  name: string;
  description: Record<string, unknown>;
}

export interface MasterRoleListResponseType {
  items: MasterRoleItemType[];
}

export interface CreateProductCategoryRequestType {
  name: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
}

export interface ProductCategoryItemType {
  uuid: string;
  name: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListProductCategoryRequestType {
  name?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductCategoryListResponseType {
  total: number;
  items: ProductCategoryItemType[];
}

export interface UpdateProductCategoryRequestType {
  uuid: string;
  name?: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
}

export interface DeleteProductCategoryRequestType {
  uuid: string;
}
