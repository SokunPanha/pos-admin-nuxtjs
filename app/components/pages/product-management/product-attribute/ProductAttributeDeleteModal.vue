<script setup lang="ts">
import type { ProductAttributeItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  attribute: ProductAttributeItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t, locale } = useI18n();
const toast = useToast();
const { deleteProductAttribute } = useProductAttributeManagement();

const loading = ref(false);

const attributeName = computed(() => {
  return String(props.attribute?.name?.[locale.value] || props.attribute?.name?.en || "");
});

async function onConfirm() {
  if (!props.attribute) return;
  loading.value = true;
  try {
    await deleteProductAttribute(props.attribute.uuid);
    toast.add({ title: t("message.productAttributeDeleted"), color: "success" });
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
          {{ t("message.confirmDeleteProductAttribute", { name: attributeName }) }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.delete") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
