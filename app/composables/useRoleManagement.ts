import type {
  CreateRoleRequestType,
  UpdateRoleRequestType,
  RoleItemType,
  RoleListResponseType,
} from "~~/shared/types/ApiResponseType";

export function useRoleManagement() {
  const fetchRoles = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<RoleListResponseType>("/api/admin/role/list", {
        method: "POST",
        body: {
          page: params?.page || 1,
          pageSize: params?.limit || 10,
          ...params?.filter,
        },
      });

      return {
        data: res.items || [],
        total: res.total || 0,
        success: true,
      };
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createRole = async (data: CreateRoleRequestType) => {
    return $fetch<RoleItemType>("/api/admin/role/create", {
      method: "POST",
      body: data,
    });
  };

  const updateRole = async (data: UpdateRoleRequestType) => {
    return $fetch<RoleItemType>("/api/admin/role/update", {
      method: "POST",
      body: data,
    });
  };

  const deleteRole = async (name: string) => {
    return $fetch("/api/admin/role/delete", {
      method: "POST",
      body: { name },
    });
  };

  const assignPermissions = async (name: string, permissionCodes: string[]) => {
    return $fetch<RoleItemType>("/api/admin/role/assign-permissions", {
      method: "POST",
      body: { name, permissionCodes },
    });
  };

  return {
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  };
}
