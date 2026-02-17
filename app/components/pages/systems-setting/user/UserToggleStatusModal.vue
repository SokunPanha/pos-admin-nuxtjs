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
const { updateUserStatus } = useUserManagement();

const loading = ref(false);

const willActivate = computed(() => props.user?.isActive !== "Y");

async function onConfirm() {
  if (!props.user) return;
  loading.value = true;
  try {
    const newStatus = willActivate.value ? "Y" : "N";
    await updateUserStatus(props.user.uuid, newStatus);
    toast.add({ title: t("message.userStatusUpdated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.confirmStatusChange") }}</h3>
        </template>

        <p>
          {{
            willActivate
              ? t("message.confirmActivateUser", { name: user?.username })
              : t("message.confirmDeactivateUser", { name: user?.username })
          }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton
              :color="willActivate ? 'success' : 'warning'"
              :loading="loading"
              @click="onConfirm"
            >
              {{ willActivate ? t("label.activate") : t("label.deactivate") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
