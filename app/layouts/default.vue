<script setup lang="ts">
const nav = [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: "Products",
    icon: "i-lucide-package",
    to: "/products",
  },
  {
    label: "Orders",
    icon: "i-lucide-shopping-cart",
    to: "/orders",
  },
  {
    label: "Customers",
    icon: "i-lucide-users",
    to: "/customers",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
  },
];
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header>
        <div class="flex items-center gap-2 px-1">
          <AppLogo class="h-6 w-auto shrink-0" />
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
          <UColorModeButton class="hidden lg:flex" />
        </template>
      </UDashboardNavbar>

      <UMain>
        <slot />
      </UMain>
    </div>
  </UDashboardGroup>
</template>
