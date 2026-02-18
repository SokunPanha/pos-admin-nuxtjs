<script setup lang="ts">
import type { ProductVariantItemType } from "~~/shared/types/ApiResponseType";
import { useProductVariantColumns } from "~/components/pages/product-management/product-variant/productVariantColumns";
import { useProductVariantFilters } from "~/components/pages/product-management/product-variant/productVariantFilters";

const { t } = useI18n();
const route = useRoute();
const productUuid = route.params.productId as string;
const { fetchProductsVariant } = useProductVariantManagement({ productId: productUuid });

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showToggleStatusModal = ref(false);
const selectedVariant = ref<ProductVariantItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(variant: ProductVariantItemType) {
  selectedVariant.value = variant;
  showEditModal.value = true;
}

function openToggleStatusModal(variant: ProductVariantItemType) {
  selectedVariant.value = variant;
  showToggleStatusModal.value = true;
}

function openDeleteModal(variant: ProductVariantItemType) {
  selectedVariant.value = variant;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useProductVariantColumns({
  onEdit: openEditModal,
  onToggleStatus: openToggleStatusModal,
  onDelete: openDeleteModal,
});

const filterField = useProductVariantFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchProductsVariant"
    :toolbar="true"
    table-id="product-variants-table"
    export-filename="product-variants-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.productVariants") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addProductVariant") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <ProductVariantCreateModal
    v-model:open="showCreateModal"
    :product-uuid="productUuid"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <ProductVariantUpdateModal
    v-model:open="showEditModal"
    :variant="selectedVariant"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <ProductVariantDeleteModal
    v-model:open="showDeleteModal"
    :variant="selectedVariant"
    @success="refreshTable"
  />

  <!-- Toggle Status Modal -->
  <ProductVariantToggleStatusModal
    v-model:open="showToggleStatusModal"
    :variant="selectedVariant"
    @success="refreshTable"
  />
</template>
