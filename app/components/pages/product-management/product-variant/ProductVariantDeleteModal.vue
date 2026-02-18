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
const { deleteProductVariant } = useProductVariantManagement();

const loading = ref(false);

const variantName = computed(() => {
  return String(props.variant?.name?.[locale.value] || props.variant?.name?.en || "");
});

async function onConfirm() {
  if (!props.variant) return;
  loading.value = true;
  try {
    await deleteProductVariant(props.variant.uuid);
    toast.add({ title: t("message.productVariantDeleted"), color: "success" });
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

        <p class="text-sm text-gray-600">
          {{ t("message.confirmDeleteProductVariant", { name: variantName }) }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.deleteProduct") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
