<script setup lang="ts">
const { t } = useI18n();

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
    label: t("label.settings"),
    icon: "i-lucide-settings",
    to: "/settings",
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
        </template>
      </UDashboardNavbar>

      <UMain>
        <slot />
      </UMain>
    </div>
  </UDashboardGroup>
</template>
