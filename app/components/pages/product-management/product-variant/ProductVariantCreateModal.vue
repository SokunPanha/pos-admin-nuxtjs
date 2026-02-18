<script setup lang="ts">
import { z } from "zod/v4";
import type { CreateProductVariantRequestType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  productUuid: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { createProductVariant } = useProductVariantManagement();

const loading = ref(false);

const schema = z.object({
  nameEn: z.string().min(1),
  nameKm: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().min(0),
  promotePrice: z.number().min(0).optional(),
  stockQty: z.number().int().min(0).optional(),
});

const formState = reactive({
  nameEn: "",
  nameKm: "",
  sku: "",
  price: 0,
  promotePrice: undefined as number | undefined,
  stockQty: undefined as number | undefined,
  images: [] as string[],
});

watch(open, (val) => {
  if (!val) return;
  formState.nameEn = "";
  formState.nameKm = "";
  formState.sku = "";
  formState.price = 0;
  formState.promotePrice = undefined;
  formState.stockQty = undefined;
  formState.images = [];
});

async function onSubmit() {
  loading.value = true;
  try {
    const body: CreateProductVariantRequestType = {
      productUuid: props.productUuid,
      name: {},
      sku: formState.sku,
      price: formState.price,
    };
    if (formState.nameEn) (body.name as any).en = formState.nameEn;
    if (formState.nameKm) (body.name as any).km = formState.nameKm;
    if (formState.promotePrice !== undefined) body.promotePrice = formState.promotePrice;
    if (formState.stockQty !== undefined) body.stockQty = formState.stockQty;
    if (formState.images.length > 0) body.images = formState.images;
    await createProductVariant(body);
    toast.add({ title: t("message.productVariantCreated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.addProductVariant") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.variantName')" name="nameEn">
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

          <UFormField :label="t('label.sku')" name="sku">
            <UInput v-model="formState.sku" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('label.price')" name="price">
              <UInput v-model.number="formState.price" type="number" :min="0" class="w-full" />
            </UFormField>

            <UFormField :label="t('label.promotePrice')" name="promotePrice">
              <UInput v-model.number="formState.promotePrice" type="number" :min="0" class="w-full" />
            </UFormField>
          </div>

          <UFormField :label="t('label.stockQty')" name="stockQty">
            <UInput v-model.number="formState.stockQty" type="number" :min="0" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.images')">
            <UiImageUpload v-model="formState.images" :max="5" />
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
