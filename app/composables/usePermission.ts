export function usePermission() {
  const { user } = useUserSession();

  const permissions = computed(() => user.value?.permissions ?? []);

  function hasPermission(code: string): boolean {
    return permissions.value.includes(code);
  }

  function hasAnyPermission(codes: string[]): boolean {
    return codes.some((code) => permissions.value.includes(code));
  }

  function hasAllPermissions(codes: string[]): boolean {
    return codes.every((code) => permissions.value.includes(code));
  }

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
