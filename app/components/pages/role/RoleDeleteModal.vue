<script setup lang="ts">
import type { FullRoleItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  role: FullRoleItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { deleteRole } = useRoleManagement();

const loading = ref(false);

async function onConfirm() {
  if (!props.role) return;
  loading.value = true;
  try {
    await deleteRole(props.role.name);
    toast.add({ title: t("message.roleDeleted"), color: "success" });
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

        <p>{{ t("message.confirmDeleteRole", { name: role?.name }) }}</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.deleteRole") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>