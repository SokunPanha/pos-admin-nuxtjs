<script setup lang="ts">
import type { PermissionItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  permission: PermissionItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { deletePermission } = usePermissionManagement();

const loading = ref(false);

async function onConfirm() {
  if (!props.permission) return;
  loading.value = true;
  try {
    await deletePermission(props.permission.code);
    toast.add({ title: t("message.permissionDeleted"), color: "success" });
    open.value = false;
    emit("success");
  } catch {
    toast.add({ title: t("message.operationFailed"), color: "error" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ t("label.confirmDelete") }}</h3>
        </template>

        <p>{{ t("message.confirmDeletePermission", { name: permission?.code }) }}</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.deletePermission") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
