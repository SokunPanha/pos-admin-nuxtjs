<script setup lang="ts">
import type { ProductCategoryItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  category: ProductCategoryItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t, locale } = useI18n();
const toast = useToast();
const { deleteProductCategory } = useProductCategoryManagement();

const loading = ref(false);

const categoryName = computed(() => {
  return String(props.category?.name?.[locale.value] || props.category?.name?.en || "");
});

async function onConfirm() {
  if (!props.category) return;
  loading.value = true;
  try {
    await deleteProductCategory(props.category.uuid);
    toast.add({ title: t("message.categoryDeleted"), color: "success" });
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
          {{ t("message.confirmDeleteCategory", { name: categoryName }) }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton color="error" :loading="loading" @click="onConfirm">
              {{ t("label.deleteCategory") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
