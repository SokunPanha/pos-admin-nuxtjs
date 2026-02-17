<script setup lang="ts">
import type { ProductCategoryItemType } from "~~/shared/types/ApiResponseType";
import { useProductCategoryColumns } from "~/components/pages/product-management/product-category/productCategoryColumns";
import { useProductCategoryFilters } from "~/components/pages/product-management/product-category/productCategoryFilters";

const { t } = useI18n();
const { fetchProductCategories } = useProductCategoryManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedCategory = ref<ProductCategoryItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(category: ProductCategoryItemType) {
  selectedCategory.value = category;
  showEditModal.value = true;
}

function openDeleteModal(category: ProductCategoryItemType) {
  selectedCategory.value = category;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useProductCategoryColumns({
  onEdit: openEditModal,
  onDelete: openDeleteModal,
});

const filterField = useProductCategoryFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchProductCategories"
    :toolbar="true"
    table-id="product-categories-table"
    export-filename="product-categories-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.productCategories") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addCategory") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <ProductCategoryCreateModal
    v-model:open="showCreateModal"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <ProductCategoryUpdateModal
    v-model:open="showEditModal"
    :category="selectedCategory"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <ProductCategoryDeleteModal
    v-model:open="showDeleteModal"
    :category="selectedCategory"
    @success="refreshTable"
  />
</template>
