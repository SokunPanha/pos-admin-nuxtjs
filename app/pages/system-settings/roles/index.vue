<script setup lang="ts">
import type { FullRoleItemType } from "~~/shared/types/ApiResponseType";
import { useRoleColumns } from "~/components/pages/role/roleColumns";
import { useRoleFilters } from "~/components/pages/role/roleFilters";

const { t } = useI18n();
const { fetchRoles } = useRoleManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedRole = ref<FullRoleItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(role: FullRoleItemType) {
  selectedRole.value = role;
  showEditModal.value = true;
}

function openDeleteModal(role: FullRoleItemType) {
  selectedRole.value = role;
  showDeleteModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useRoleColumns({
  onEdit: openEditModal,
  onDelete: openDeleteModal,
});

const filterField = useRoleFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchRoles"
    :toolbar="true"
    table-id="roles-table"
    export-filename="roles-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.roles") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addRole") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <RoleCreateModal
    v-model:open="showCreateModal"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <RoleUpdateModal
    v-model:open="showEditModal"
    :role="selectedRole"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <RoleDeleteModal
    v-model:open="showDeleteModal"
    :role="selectedRole"
    @success="refreshTable"
  />
</template>