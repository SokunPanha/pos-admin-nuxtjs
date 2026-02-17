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
