<script setup lang="ts">
import type { ProductVariantItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  variant: ProductVariantItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t, locale } = useI18n();
const toast = useToast();
const { updateProductVariantStatus } = useProductVariantManagement();

const loading = ref(false);

const willActivate = computed(() => props.variant?.isActive !== "Y");

const variantName = computed(() => {
  return String(props.variant?.name?.[locale.value] || props.variant?.name?.en || "");
});

async function onConfirm() {
  if (!props.variant) return;
  loading.value = true;
  try {
    const newStatus = willActivate.value ? "Y" : "N";
    await updateProductVariantStatus(props.variant.uuid, newStatus);
    toast.add({ title: t("message.productVariantStatusUpdated"), color: "success" });
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
              ? t("message.confirmActivateProductVariant", { name: variantName })
              : t("message.confirmDeactivateProductVariant", { name: variantName })
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
