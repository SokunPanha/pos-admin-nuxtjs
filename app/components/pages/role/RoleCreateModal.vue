<script setup lang="ts">
import { z } from "zod/v4";
import type { CreateRoleRequestType } from "~~/shared/types/ApiResponseType";

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { createRole } = useRoleManagement();

const loading = ref(false);

const schema = z.object({
  name: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
});

const formState = reactive({
  name: "",
  descriptionEn: "",
  descriptionKm: "",
});

watch(open, (val) => {
  if (!val) return;
  formState.name = "";
  formState.descriptionEn = "";
  formState.descriptionKm = "";
});

async function onSubmit() {
  loading.value = true;
  try {
    const body: CreateRoleRequestType = {
      name: formState.name.toUpperCase(),
      isSystem: "N",
    };
    if (formState.descriptionEn || formState.descriptionKm) {
      body.description = {};
      if (formState.descriptionEn) body.description.en = formState.descriptionEn;
      if (formState.descriptionKm) body.description.km = formState.descriptionKm;
    }
    await createRole(body);
    toast.add({ title: t("message.roleCreated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.addRole") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.roleName')" name="name">
            <UInput v-model="formState.name" class="w-full" />
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