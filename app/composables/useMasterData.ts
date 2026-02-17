import type {
  MasterPermissionListResponseType,
  MasterPermissionItemType,
  MasterRoleListResponseType,
  MasterRoleItemType,
} from "~~/shared/types/ApiResponseType";

export function useMasterData() {
  const fetchAllPermissions = async (resource?: string): Promise<MasterPermissionItemType[]> => {
    const res = await $fetch<MasterPermissionListResponseType>("/api/admin/master-data/permissions", {
      method: "POST",
      body: resource ? { resource } : {},
    });
    return res.items || [];
  };

  const fetchAllRoles = async (name?: string): Promise<MasterRoleItemType[]> => {
    const res = await $fetch<MasterRoleListResponseType>("/api/admin/master-data/roles", {
      method: "POST",
      body: name ? { name } : {},
    });
    return res.items || [];
  };

  return {
    fetchAllPermissions,
    fetchAllRoles,
  };
}
