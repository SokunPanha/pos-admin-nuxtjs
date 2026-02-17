<script setup lang="ts">
import type { PermissionItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";
import { usePermissionColumns } from "~/components/pages/systems-setting/permission/permissionColumns";
import { usePermissionFilters } from "~/components/pages/systems-setting/permission/permissionFilters";

definePageMeta({ middleware: "permission", requiredPermission: "permission:view" });

const { t } = useI18n();
const { hasPermission } = usePermission();
const { fetchPermissions } = usePermissionManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedPermission = ref<PermissionItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(permission: PermissionItemType) {
  selectedPermission.value = permission;
  showEditModal.value = true;
}

function openDeleteModal(permission: PermissionItemType) {
  selectedPermission.value = permission;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = usePermissionColumns({
  onEdit: openEditModal,
  onDelete: openDeleteModal,
});

const filterField = usePermissionFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchPermissions"
    :toolbar="true"
    table-id="permissions-table"
    export-filename="permissions-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.permissionsTitle") }}</h1>
        <UButton v-if="hasPermission(PERMISSIONS.PERMISSION_CREATE)" icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addPermission") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <PermissionCreateModal
    v-model:open="showCreateModal"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <PermissionUpdateModal
    v-model:open="showEditModal"
    :permission="selectedPermission"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <PermissionDeleteModal
    v-model:open="showDeleteModal"
    :permission="selectedPermission"
    @success="refreshTable"
  />
</template>
