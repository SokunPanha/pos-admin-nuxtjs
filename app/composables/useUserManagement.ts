import type {
  CreateUserRequestType,
  UpdateUserRequestType,
  UserItemType,
  UserListResponseType
} from "~~/shared/types/ApiResponseType";

export function useUserManagement() {
  const fetchUsers = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<UserListResponseType>("/api/admin/user/list", {
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
      console.error("Failed to fetch users:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createUser = async (data: CreateUserRequestType) => {
    return $fetch<UserItemType>("/api/admin/user/create", {
      method: "POST",
      body: data,
    });
  };

  const updateUser = async (data: UpdateUserRequestType) => {
    return $fetch<UserItemType>("/api/admin/user/update", {
      method: "POST",
      body: data,
    });
  };

  const deleteUser = async (uuid: string) => {
    return $fetch("/api/admin/user/delete", {
      method: "POST",
      body: { uuid },
    });
  };

  const updateUserStatus = async (uuid: string, isActive: "Y" | "N") => {
    return $fetch<UserItemType>("/api/admin/user/update-status", {
      method: "POST",
      body: { uuid, isActive },
    });
  };

  const assignUserRole = async (uuid: string, roleName: string) => {
    return $fetch<UserItemType>("/api/admin/user/assign-role", {
      method: "POST",
      body: { uuid, roleName },
    });
  };

  return {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    assignUserRole,
  };
}
