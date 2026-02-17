<script setup lang="ts">
import type { UserItemType } from "~~/shared/types/ApiResponseType";
import { useUserColumns } from "~/components/pages/user/userColumns";
import { useUserFilters } from "~/components/pages/user/userFilters";

const { t } = useI18n();
const { fetchUsers } = useUserManagement();

// --- Table key for refresh ---
const tableKey = ref(0);

// --- Modal state ---
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showToggleStatusModal = ref(false);
const showAssignRoleModal = ref(false);
const selectedUser = ref<UserItemType | null>(null);

function openCreateModal() {
  showCreateModal.value = true;
}

function openEditModal(user: UserItemType) {
  selectedUser.value = user;
  showEditModal.value = true;
}

function openDeleteModal(user: UserItemType) {
  selectedUser.value = user;
  showDeleteModal.value = true;
}

function openToggleStatusModal(user: UserItemType) {
  selectedUser.value = user;
  showToggleStatusModal.value = true;
}

function openAssignRoleModal(user: UserItemType) {
  selectedUser.value = user;
  showAssignRoleModal.value = true;
}

function refreshTable() {
  tableKey.value++;
}

// --- Columns & Filters ---
const columns = useUserColumns({
  onEdit: openEditModal,
  onToggleStatus: openToggleStatusModal,
  onDelete: openDeleteModal,
  onAssignRole: openAssignRoleModal,
});

const filterField = useUserFilters();
</script>

<template>
  <UiTable
    :key="tableKey"
    :filter-field="filterField"
    :pagination="{ paginationOptions: [10, 20, 50, 100] }"
    :columns="columns()"
    :request="fetchUsers"
    :toolbar="true"
    table-id="users-table"
    export-filename="users-export.csv"
  >
    <template #table-header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ t("label.users") }}</h1>
        <UButton icon="i-lucide-plus" @click="openCreateModal">
          {{ t("label.addUser") }}
        </UButton>
      </div>
    </template>
  </UiTable>

  <!-- Create Modal -->
  <UserCreateModal
    v-model:open="showCreateModal"
    @success="refreshTable"
  />

  <!-- Edit Modal -->
  <UserUpdateModal
    v-model:open="showEditModal"
    :user="selectedUser"
    @success="refreshTable"
  />

  <!-- Toggle Status Confirmation Modal -->
  <UserToggleStatusModal
    v-model:open="showToggleStatusModal"
    :user="selectedUser"
    @success="refreshTable"
  />

  <!-- Assign Role Modal -->
  <UserAssignRoleModal
    v-model:open="showAssignRoleModal"
    :user="selectedUser"
    @success="refreshTable"
  />

  <!-- Delete Confirmation Modal -->
  <UserDeleteModal
    v-model:open="showDeleteModal"
    :user="selectedUser"
    @success="refreshTable"
  />
</template>
