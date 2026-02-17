<script setup lang="ts">
const { t } = useI18n();
const { user, clear } = useUserSession();
const toast = useToast();

async function logout() {
  try {
    await $fetch("/api/admin/auth/logout", { method: "POST" });
    await clear();
    reloadNuxtApp({ path: "/auth/login" });
  } catch {
    toast.add({ title: t("message.logoutFailed"), color: "error" });
  }
}

const userMenuItems = computed(() => [
  [
    {
      label: t("label.logout"),
      icon: "i-lucide-log-out",
      onSelect: logout,
    },
  ],
]);

const nav = computed(() => [
  {
    label: t("label.dashboard"),
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: t("label.products"),
    icon: "i-lucide-package",
    to: "/products",
  },
  {
    label: t("label.orders"),
    icon: "i-lucide-shopping-cart",
    to: "/orders",
  },
  {
    label: t("label.customers"),
    icon: "i-lucide-users",
    to: "/customers",
  },
  {
    label: t("label.system_settings"),
    icon: "i-lucide-settings",
    children: [
      {
        label: t("label.users"),
        to: "/system-settings/users",
      },
      {
        label: t("label.roles"),
        to: "/system-settings/roles",
      },
      {
        label: t("label.permissionsTitle"),
        to: "/system-settings/permissions",
      },
    ],
  },
]);
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-1">
          <UIcon v-if="collapsed" name="i-lucide-store" class="size-5 shrink-0" />
          <span v-else class="text-lg font-semibold truncate">Tiny POS</span>
        </div>
      </template>

      <UNavigationMenu :items="nav" orientation="vertical" />

      <template #footer>
        <div class="flex items-center justify-between">
          <UDashboardSidebarCollapse />
        </div>
      </template>
    </UDashboardSidebar>

    <div class="flex flex-1 flex-col min-w-0">
      <UDashboardNavbar toggle>
        <template #right>
          <UiLanguageSwitcher />
          <UColorModeButton />
          <UDropdownMenu :items="userMenuItems">
            <UButton variant="ghost" color="neutral" class="gap-2">
              <UIcon name="i-lucide-user-circle" class="size-5" />
              <span class="hidden sm:inline text-sm">{{ user?.username }}</span>
            </UButton>
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
      <UMain>
        <slot />
      </UMain>
    </div>
  </UDashboardGroup>
</template>
