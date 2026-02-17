<script setup lang="ts">
import type { ProductItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  product: ProductItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t, locale } = useI18n();
const toast = useToast();
const { deleteProduct } = useProductManagement();

const loading = ref(false);

const productName = computed(() => {
  return String(props.product?.name?.[locale.value] || props.product?.name?.en || "");
});

async function onConfirm() {
  if (!props.product) return;
  loading.value = true;
  try {
    await deleteProduct(props.product.uuid);
    toast.add({ title: t("message.productDeleted"), color: "success" });
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
          {{ t("message.confirmDeleteProduct", { name: productName }) }}
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
