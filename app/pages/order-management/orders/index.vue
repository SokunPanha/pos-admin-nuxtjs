<script setup lang="ts">
import { useOrderColumns } from '~/components/pages/order-management/order/orderColumns';
import { useOrderFilters } from '~/components/pages/order-management/order/orderFilters';


const { t } = useI18n();
const { fetchOrders } = useOrderManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showDetailModal = ref(false);
const selectedOrderUuid = ref<string | null>(null);

function openDetailModal(order: OrderItemType) {
  selectedOrderUuid.value = order.uuid;
  showDetailModal.value = true;
  console.log("🚀 ~ openDetailModal ~ showDetailModal.value:", showDetailModal.value)
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useOrderColumns({
  onView: openDetailModal,
});

const filterField = useOrderFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchOrders"
    :toolbar="true"
    table-id="orders-table"
    export-filename="orders-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.orderList") }}</h1>
      </div>
    </template>
  </UiTable>

  <!-- Detail Modal -->
  <OrderDetailModal
    v-model:open="showDetailModal"
    :uuid="selectedOrderUuid"
  />
</template>
