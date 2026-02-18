<script setup lang="ts">
import type { ProductAttributeItemType } from "~~/shared/types/ApiResponseType";
import { useProductAttributeColumns } from "~/components/pages/product-management/product-attribute/productAttributeColumns";

const { t } = useI18n();
const route = useRoute();
const productUuid = route.params.productId as string;
const { fetchProductAttributes } = useProductAttributeManagement({ productId: productUuid });

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedAttribute = ref<ProductAttributeItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(attribute: ProductAttributeItemType) {
  selectedAttribute.value = attribute;
  showEditModal.value = true;
}

function openDeleteModal(attribute: ProductAttributeItemType) {
  selectedAttribute.value = attribute;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns ---
const columns = useProductAttributeColumns({
  onEdit: openEditModal,
  onDelete: openDeleteModal,
});
</script>

<template>
  <UiTable
    :key="tableKey"
    :columns="columns()"
    :request="fetchProductAttributes"
    :toolbar="true"
    table-id="product-attributes-table"
    export-filename="product-attributes-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.productAttributes") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addProductAttribute") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <ProductAttributeCreateModal
    v-model:open="showCreateModal"
    :product-uuid="productUuid"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <ProductAttributeUpdateModal
    v-model:open="showEditModal"
    :attribute="selectedAttribute"
    @success="refreshTable"
  />

  <!-- Delete Modal -->
  <ProductAttributeDeleteModal
    v-model:open="showDeleteModal"
    :attribute="selectedAttribute"
    @success="refreshTable"
  />
</template>
