<script setup lang="ts">
import type { UserItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  user: UserItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { deleteUser } = useUserManagement();

const loading = ref(false);

async function onConfirm() {
  if (!props.user) return;
  loading.value = true;
  try {
    await deleteUser(props.user.uuid);
    toast.add({ title: t("message.userDeleted"), color: "success" });
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

        <p>{{ t("message.confirmDeleteUser", { name: user?.username }) }}</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.deleteUser") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
