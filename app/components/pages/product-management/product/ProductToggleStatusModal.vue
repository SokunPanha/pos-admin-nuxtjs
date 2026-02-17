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
const { updateProductStatus } = useProductManagement();

const loading = ref(false);

const willActivate = computed(() => props.product?.isActive !== "Y");

const productName = computed(() => {
  return String(props.product?.name?.[locale.value] || props.product?.name?.en || "");
});

async function onConfirm() {
  if (!props.product) return;
  loading.value = true;
  try {
    const newStatus = willActivate.value ? "Y" : "N";
    await updateProductStatus(props.product.uuid, newStatus);
    toast.add({ title: t("message.productStatusUpdated"), color: "success" });
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
              ? t("message.confirmActivateProduct", { name: productName })
              : t("message.confirmDeactivateProduct", { name: productName })
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
