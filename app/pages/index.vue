<script setup lang="ts">
import type { DashboardResponseType } from "~~/shared/types/ApiResponseType";

const { locale, t } = useI18n();

// Forward browser cookies during SSR so the auth token is included
const headers = useRequestHeaders(["cookie"]);

const { data: dashboard, pending, error } = await useAsyncData("dashboard", () =>
  $fetch<DashboardResponseType>("/api/admin/dashboard", {
    method: "POST",
    headers,
    body: { trendDays: 30, topProductsLimit: 10, recentOrdersLimit: 10, lowStockThreshold: 10 },
  }),
);

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const getName = (val: Record<string, unknown> | undefined) =>
  String(val?.[locale.value] ?? val?.en ?? "-");

// Revenue trend
const revenueTrend = computed(() => dashboard.value?.revenueTrend ?? []);

const revenueTrendXFormatter = (tick: number) => {
  const item = revenueTrend.value[Math.round(tick)];
  if (!item) return "";
  return new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const revenueYFormatter = (tick: number) =>
  tick >= 1000 ? "$" + (tick / 1000).toFixed(0) + "k" : "$" + tick;

// Order status donut — computed so names react to locale changes
const orderStatusCategories = computed(() => ({
  pending: { name: t("label.pending"), color: "#f59e0b" },
  paid: { name: t("label.paid"), color: "#10b981" },
  cancelled: { name: t("label.cancelled"), color: "#ef4444" },
}));

const orderStatusData = computed(() => {
  const s = dashboard.value?.orderStatus;
  return [s?.pending ?? 0, s?.paid ?? 0, s?.cancelled ?? 0];
});

// Top products bar chart
interface TopProductRow { name: string; revenue: number }
const topProductsData = computed<TopProductRow[]>(() =>
  (dashboard.value?.topProducts ?? []).map(p => ({
    name: getName(p.productName as Record<string, unknown>),
    revenue: p.totalRevenue,
  })),
);

const revenueCategory = computed(() => ({
  revenue: { name: t("label.revenue"), color: "#6366f1" },
}));

// Revenue by payment method donut
const paymentColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const paymentMethodData = computed(() =>
  (dashboard.value?.revenueByPaymentMethod ?? []).map(m => m.totalRevenue),
);

const paymentMethodCategories = computed(() =>
  Object.fromEntries(
    (dashboard.value?.revenueByPaymentMethod ?? []).map((m, i) => [
      `pm_${i}`,
      { name: getName(m.name as Record<string, unknown>), color: paymentColors[i % paymentColors.length] },
    ]),
  ),
);

const orderStatusBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
</script>

<template>
  <div class="p-6 space-y-6 h-full overflow-scroll">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center h-64">
      <UIcon name="i-lucide-loader-circle" class="animate-spin size-10 text-primary" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center h-64 gap-2 text-red-500">
      <UIcon name="i-lucide-alert-circle" class="size-10" />
      <p>{{ t("label.failedToLoadDashboard") }}</p>
    </div>

    <template v-else-if="dashboard">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg shrink-0">
              <UIcon name="i-lucide-shopping-cart" class="text-indigo-600 dark:text-indigo-300 size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-gray-500 truncate">{{ t("label.totalOrders") }}</p>
              <p class="text-xl font-bold">{{ dashboard.summary.totalOrders.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg shrink-0">
              <UIcon name="i-lucide-dollar-sign" class="text-green-600 dark:text-green-300 size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-gray-500 truncate">{{ t("label.totalRevenue") }}</p>
              <p class="text-xl font-bold">{{ formatCurrency(dashboard.summary.totalRevenue) }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
              <UIcon name="i-lucide-package" class="text-blue-600 dark:text-blue-300 size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-gray-500 truncate">{{ t("label.totalProducts") }}</p>
              <p class="text-xl font-bold">{{ dashboard.summary.totalProducts.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg shrink-0">
              <UIcon name="i-lucide-grid-3x3" class="text-purple-600 dark:text-purple-300 size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-gray-500 truncate">{{ t("label.totalCategories") }}</p>
              <p class="text-xl font-bold">{{ dashboard.summary.totalCategories.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg shrink-0">
              <UIcon name="i-lucide-users" class="text-orange-600 dark:text-orange-300 size-5" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-gray-500 truncate">{{ t("label.totalUsers") }}</p>
              <p class="text-xl font-bold">{{ dashboard.summary.totalUsers.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Revenue Period Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UCard>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-500">{{ t("label.todayRevenue") }}</p>
            <UIcon name="i-lucide-sun" class="text-yellow-400 size-4" />
          </div>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(dashboard.revenue.today.amount) }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ dashboard.revenue.today.orderCount }} {{ t("label.ordersCount") }}</p>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-500">{{ t("label.thisWeek") }}</p>
            <UIcon name="i-lucide-calendar-days" class="text-blue-400 size-4" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(dashboard.revenue.thisWeek.amount) }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ dashboard.revenue.thisWeek.orderCount }} {{ t("label.ordersCount") }}</p>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-gray-500">{{ t("label.thisMonth") }}</p>
            <UIcon name="i-lucide-calendar" class="text-indigo-400 size-4" />
          </div>
          <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(dashboard.revenue.thisMonth.amount) }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ dashboard.revenue.thisMonth.orderCount }} {{ t("label.ordersCount") }}</p>
        </UCard>
      </div>

      <!-- Revenue Trend + Order Status -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-base font-semibold">{{ t("label.revenueTrend") }}</h3>
          </template>
          <LineChart
            v-if="revenueTrend.length > 0"
            :data="revenueTrend"
            :height="250"
            :categories="revenueCategory"
            :x-formatter="revenueTrendXFormatter"
            :y-formatter="revenueYFormatter"
            :x-num-ticks="7"
          />
          <div v-else class="flex items-center justify-center h-60 text-gray-400 text-sm">
            {{ t("label.noTrendData") }}
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">{{ t("label.orderStatus") }}</h3>
          </template>
          <div class="flex flex-col items-center gap-4 pt-2">
            <DonutChart
              :data="orderStatusData"
              :radius="90"
              :arc-width="36"
              :height="200"
              :categories="orderStatusCategories"
              hide-legend
            />
            <div class="flex gap-6 justify-center text-sm w-full">
              <div class="text-center">
                <div class="text-yellow-500 font-bold text-lg">{{ dashboard.orderStatus.pending }}</div>
                <div class="text-xs text-gray-500">{{ t("label.pending") }}</div>
              </div>
              <div class="text-center">
                <div class="text-green-600 font-bold text-lg">{{ dashboard.orderStatus.paid }}</div>
                <div class="text-xs text-gray-500">{{ t("label.paid") }}</div>
              </div>
              <div class="text-center">
                <div class="text-red-500 font-bold text-lg">{{ dashboard.orderStatus.cancelled }}</div>
                <div class="text-xs text-gray-500">{{ t("label.cancelled") }}</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Top Products + Revenue by Payment Method -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-base font-semibold">{{ t("label.topProductsByRevenue") }}</h3>
          </template>
          <BarChart
            v-if="topProductsData.length > 0"
            :data="topProductsData"
            :height="250"
            :x-axis="'name'"
            :y-axis="['revenue']"
            :categories="revenueCategory"
            :y-formatter="revenueYFormatter"
            :radius="4"
          />
          <div v-else class="flex items-center justify-center h-60 text-gray-400 text-sm">
            {{ t("label.noProductData") }}
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">{{ t("label.revenueByPaymentMethod") }}</h3>
          </template>
          <DonutChart
            v-if="paymentMethodData.length > 0"
            :data="paymentMethodData"
            :radius="90"
            :arc-width="36"
            :height="280"
            :categories="paymentMethodCategories"
          />
          <div v-else class="flex items-center justify-center h-60 text-gray-400 text-sm">
            {{ t("label.noPaymentData") }}
          </div>
        </UCard>
      </div>

      <!-- Recent Orders + Low Stock Alerts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-base font-semibold">{{ t("label.recentOrders") }}</h3>
          </template>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th class="pb-3 pr-4 font-medium">{{ t("label.cashier") }}</th>
                  <th class="pb-3 pr-4 font-medium">{{ t("label.amount") }}</th>
                  <th class="pb-3 pr-4 font-medium">{{ t("label.status") }}</th>
                  <th class="pb-3 pr-4 font-medium">{{ t("label.payment") }}</th>
                  <th class="pb-3 font-medium">{{ t("label.date") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in dashboard.recentOrders"
                  :key="order.uuid"
                  class="border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <td class="py-2.5 pr-4 font-medium">{{ order.cashierName }}</td>
                  <td class="py-2.5 pr-4">{{ formatCurrency(order.totalAmount) }}</td>
                  <td class="py-2.5 pr-4">
                    <span
                      :class="['px-2 py-0.5 rounded-full text-xs font-medium', orderStatusBadge[order.status] ?? 'bg-gray-100 text-gray-600']"
                    >
                      {{ t(`label.${order.status}`, order.status) }}
                    </span>
                  </td>
                  <td class="py-2.5 pr-4 text-gray-500">
                    {{ order.paymentMethod ? getName(order.paymentMethod as Record<string, unknown>) : "-" }}
                  </td>
                  <td class="py-2.5 text-gray-400 text-xs">
                    {{
                      new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    }}
                  </td>
                </tr>
                <tr v-if="dashboard.recentOrders.length === 0">
                  <td colspan="5" class="py-8 text-center text-gray-400">{{ t("label.noRecentOrders") }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-alert-triangle" class="text-orange-500 size-4" />
              <h3 class="text-base font-semibold">{{ t("label.lowStockAlerts") }}</h3>
            </div>
          </template>
          <div class="space-y-0">
            <div
              v-if="dashboard.lowStockAlerts.length === 0"
              class="text-center text-gray-400 text-sm py-8"
            >
              {{ t("label.allItemsWellStocked") }}
            </div>
            <div
              v-for="item in dashboard.lowStockAlerts"
              :key="item.uuid"
              class="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0"
            >
              <div class="min-w-0 flex-1 pr-2">
                <p class="font-medium text-sm truncate">{{ getName(item.productName as Record<string, unknown>) }}</p>
                <p class="text-xs text-gray-400 truncate">
                  {{ getName(item.variantName as Record<string, unknown>) }} · {{ item.sku }}
                </p>
              </div>
              <span class="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-1 rounded-full shrink-0">
                {{ item.stockQty }} {{ t("label.stockLeft") }}
              </span>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>
