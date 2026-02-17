<script setup lang="ts">
import type { ProductItemType } from "~~/shared/types/ApiResponseType";
import { useProductColumns } from "~/components/pages/product-management/product/productColumns";
import { useProductFilters } from "~/components/pages/product-management/product/productFilters";

const { t } = useI18n();
const { fetchProducts } = useProductManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showToggleStatusModal = ref(false);
const selectedProduct = ref<ProductItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(product: ProductItemType) {
  selectedProduct.value = product;
  showEditModal.value = true;
}

function openToggleStatusModal(product: ProductItemType) {
  selectedProduct.value = product;
  showToggleStatusModal.value = true;
}

function openDeleteModal(product: ProductItemType) {
  selectedProduct.value = product;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useProductColumns({
  onEdit: openEditModal,
  onToggleStatus: openToggleStatusModal,
  onDelete: openDeleteModal,
});

const filterField = useProductFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchProducts"
    :toolbar="true"
    table-id="products-table"
    export-filename="products-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.products") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addProduct") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <ProductCreateModal
    v-model:open="showCreateModal"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <ProductUpdateModal
    v-model:open="showEditModal"
    :product="selectedProduct"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <ProductDeleteModal
    v-model:open="showDeleteModal"
    :product="selectedProduct"
    @success="refreshTable"
  />

  <!-- Toggle Status Modal -->
  <ProductToggleStatusModal
    v-model:open="showToggleStatusModal"
    :product="selectedProduct"
    @success="refreshTable"
  />
</template>
