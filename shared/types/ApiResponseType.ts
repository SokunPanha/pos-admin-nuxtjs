// Auto-generated from OpenAPI spec — do not edit manually
// Generated at: 2026-02-17T14:39:43.771Z
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

export interface MasterCategoryListRequestType {
  name?: string;
}

export interface MasterCategoryItemType {
  uuid: string;
  name: Record<string, unknown>;
}

export interface MasterCategoryListResponseType {
  items: MasterCategoryItemType[];
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

export interface CreateProductRequestType {
  name: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
  categoryUuid?: string;
}

export interface ProductCategoryRefType {
  uuid: string;
  name: Record<string, unknown>;
}

export interface ProductItemType {
  uuid: string;
  name: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
  isActive: string;
  category?: ProductCategoryRefType;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductRequestType {
  name?: string;
  categoryUuid?: string;
  isActive?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponseType {
  total: number;
  items: ProductItemType[];
}

export interface UpdateProductRequestType {
  uuid: string;
  name?: Record<string, unknown>;
  description?: Record<string, unknown>;
  images?: string[];
  categoryUuid?: string;
}

export interface DeleteProductRequestType {
  uuid: string;
}

export interface UpdateProductStatusRequestType {
  uuid: string;
  isActive: "Y" | "N";
}

export interface CreateProductVariantRequestType {
  productUuid: string;
  name: Record<string, unknown>;
  images?: string[];
  sku: string;
  price: number;
  promotePrice?: number;
  stockQty?: number;
}

export interface ProductVariantItemType {
  uuid: string;
  name: Record<string, unknown>;
  images?: string[];
  sku: string;
  price: number;
  promotePrice: number;
  stockQty: number;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductVariantRequestType {
  productUuid: string;
  name?: string;
  sku?: string;
  isActive?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductVariantListResponseType {
  total: number;
  items: ProductVariantItemType[];
}

export interface UpdateProductVariantRequestType {
  uuid: string;
  name?: Record<string, unknown>;
  images?: string[];
  sku?: string;
  price?: number;
  promotePrice?: number;
  stockQty?: number;
}

export interface DeleteProductVariantRequestType {
  uuid: string;
}

export interface UpdateProductVariantStatusRequestType {
  uuid: string;
  isActive: "Y" | "N";
}

export interface AttributeValueInputType {
  value: Record<string, unknown>;
}

export interface CreateProductAttributeRequestType {
  productUuid: string;
  name: Record<string, unknown>;
  values: AttributeValueInputType[];
}

export interface ProductAttributeValueItemType {
  uuid: string;
  value: Record<string, unknown>;
}

export interface ProductAttributeItemType {
  uuid: string;
  name: Record<string, unknown>;
  values: ProductAttributeValueItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface ListProductAttributeRequestType {
  productUuid: string;
}

export interface ProductAttributeListResponseType {
  items: ProductAttributeItemType[];
}

export interface UpdateAttributeValueInputType {
  uuid?: string;
  value: Record<string, unknown>;
}

export interface UpdateProductAttributeRequestType {
  uuid: string;
  name?: Record<string, unknown>;
  values?: UpdateAttributeValueInputType[];
}

export interface DeleteProductAttributeRequestType {
  uuid: string;
}
