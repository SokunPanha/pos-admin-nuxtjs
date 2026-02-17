import type {
  CreatePermissionRequestType,
  UpdatePermissionRequestType,
  PermissionItemType,
  PermissionListResponseType,
} from "~~/shared/types/ApiResponseType";

export function usePermissionManagement() {
  const fetchPermissions = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<PermissionListResponseType>("/api/admin/permission/list", {
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
      console.error("Failed to fetch permissions:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createPermission = async (data: CreatePermissionRequestType) => {
    return $fetch<PermissionItemType>("/api/admin/permission/create", {
      method: "POST",
      body: data,
    });
  };

  const updatePermission = async (data: UpdatePermissionRequestType) => {
    return $fetch<PermissionItemType>("/api/admin/permission/update", {
      method: "POST",
      body: data,
    });
  };

  const deletePermission = async (code: string) => {
    return $fetch("/api/admin/permission/delete", {
      method: "POST",
      body: { code },
    });
  };

  return {
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  };
}
