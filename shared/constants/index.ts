export const ROLE_OPTIONS = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Cashier", value: "CASHIER" },
];

export const USER_STATUS_OPTIONS = [
  { label: "Active", value: "Y" },
  { label: "Inactive", value: "N" },
];

export const SYSTEM_ROLE_OPTIONS = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" },
];

export const PERMISSIONS = {
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_UPDATE_STATUS: "user:update-status",
  USER_ASSIGN_ROLE: "user:assign-role",
  ROLE_VIEW: "role:view",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_ASSIGN_PERMISSIONS: "role:assign-permissions",
  PERMISSION_VIEW: "permission:view",
  PERMISSION_CREATE: "permission:create",
  PERMISSION_UPDATE: "permission:update",
  PERMISSION_DELETE: "permission:delete",
} as const;
