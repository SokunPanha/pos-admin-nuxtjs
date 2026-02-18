<script setup lang="ts">
import { z } from "zod/v4";
import type { CreateProductAttributeRequestType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  productUuid: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { createProductAttribute } = useProductAttributeManagement();

const loading = ref(false);

const schema = z.object({
  nameEn: z.string().min(1),
  nameKm: z.string().optional(),
});

interface ValueRow {
  en: string;
  km: string;
}

const formState = reactive({
  nameEn: "",
  nameKm: "",
});

const values = ref<ValueRow[]>([{ en: "", km: "" }]);

function addValue() {
  values.value.push({ en: "", km: "" });
}

function removeValue(index: number) {
  if (values.value.length > 1) {
    values.value.splice(index, 1);
  }
}

watch(open, (val) => {
  if (!val) return;
  formState.nameEn = "";
  formState.nameKm = "";
  values.value = [{ en: "", km: "" }];
});

async function onSubmit() {
  loading.value = true;
  try {
    const body: CreateProductAttributeRequestType = {
      productUuid: props.productUuid,
      name: {},
      values: values.value
        .filter((v) => v.en || v.km)
        .map((v) => {
          const value: Record<string, unknown> = {};
          if (v.en) value.en = v.en;
          if (v.km) value.km = v.km;
          return { value };
        }),
    };
    if (formState.nameEn) (body.name as any).en = formState.nameEn;
    if (formState.nameKm) (body.name as any).km = formState.nameKm;
    await createProductAttribute(body);
    toast.add({ title: t("message.productAttributeCreated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.addProductAttribute") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.attributeName')" name="nameEn">
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

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium">{{ t("label.attributeValues") }}</label>
              <UButton
                icon="i-lucide-plus"
                size="xs"
                variant="outline"
                @click="addValue"
              >
                {{ t("label.addValue") }}
              </UButton>
            </div>

            <div class="space-y-2">
              <div
                v-for="(val, index) in values"
                :key="index"
                class="flex gap-2 items-start"
              >
                <div class="flex-1 space-y-1">
                  <UInput
                    v-model="val.en"
                    :placeholder="t('label.english')"
                    size="sm"
                  />
                  <UInput
                    v-model="val.km"
                    :placeholder="t('label.khmer')"
                    size="sm"
                  />
                </div>
                <UButton
                  icon="i-lucide-x"
                  size="xs"
                  variant="ghost"
                  color="error"
                  :disabled="values.length <= 1"
                  class="mt-1"
                  @click="removeValue(index)"
                />
              </div>
            </div>
          </div>

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
