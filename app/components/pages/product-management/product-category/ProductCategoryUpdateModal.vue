<script setup lang="ts">
import { z } from "zod/v4";
import type { ProductCategoryItemType, UpdateProductCategoryRequestType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  category: ProductCategoryItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { updateProductCategory } = useProductCategoryManagement();

const loading = ref(false);

const schema = z.object({
  nameEn: z.string().min(1),
  nameKm: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
});

const formState = reactive({
  nameEn: "",
  nameKm: "",
  descriptionEn: "",
  descriptionKm: "",
});

watch(open, (val) => {
  if (!val || !props.category) return;
  formState.nameEn = String(props.category.name?.en || "");
  formState.nameKm = String(props.category.name?.km || "");
  formState.descriptionEn = String(props.category.description?.en || "");
  formState.descriptionKm = String(props.category.description?.km || "");
});

async function onSubmit() {
  if (!props.category) return;
  loading.value = true;
  try {
    const body: UpdateProductCategoryRequestType = {
      uuid: props.category.uuid,
    };
    body.name = {};
    if (formState.nameEn) (body.name as any).en = formState.nameEn;
    if (formState.nameKm) (body.name as any).km = formState.nameKm;
    if (formState.descriptionEn || formState.descriptionKm) {
      body.description = {};
      if (formState.descriptionEn) (body.description as any).en = formState.descriptionEn;
      if (formState.descriptionKm) (body.description as any).km = formState.descriptionKm;
    }
    await updateProductCategory(body);
    toast.add({ title: t("message.categoryUpdated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.editCategory") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.categoryName')" name="nameEn">
            <UTabs
              :items="[{ label: t('label.english'), value: 'en' }, { label: t('label.khmer'), value: 'km' }]"
              class="w-full"
            >
              <template #content="{ item }">
                <UInput
                  v-if="item.value === 'en'"
                  v-model="formState.nameEn"
                  class="w-full mt-2"
                />
                <UInput
                  v-else
                  v-model="formState.nameKm"
                  class="w-full mt-2"
                />
              </template>
            </UTabs>
          </UFormField>

          <UFormField :label="t('label.description')">
            <UTabs
              :items="[{ label: t('label.english'), value: 'en' }, { label: t('label.khmer'), value: 'km' }]"
              class="w-full"
            >
              <template #content="{ item }">
                <UInput
                  v-if="item.value === 'en'"
                  v-model="formState.descriptionEn"
                  class="w-full mt-2"
                />
                <UInput
                  v-else
                  v-model="formState.descriptionKm"
                  class="w-full mt-2"
                />
              </template>
            </UTabs>
          </UFormField>

          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton type="submit" :loading="loading">
              {{ t("label.save") }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>
</template>
