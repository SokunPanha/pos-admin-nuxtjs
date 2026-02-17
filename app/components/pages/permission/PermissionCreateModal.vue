<script setup lang="ts">
import { z } from "zod/v4";
import type { CreatePermissionRequestType } from "~~/shared/types/ApiResponseType";

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { createPermission } = usePermissionManagement();

const loading = ref(false);

const schema = z.object({
  code: z.string().min(1),
  resource: z.string().min(1),
  action: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
});

const formState = reactive({
  code: "",
  resource: "",
  action: "",
  descriptionEn: "",
  descriptionKm: "",
});

watch(open, (val) => {
  if (!val) return;
  formState.code = "";
  formState.resource = "";
  formState.action = "";
  formState.descriptionEn = "";
  formState.descriptionKm = "";
});

// Auto-generate code from resource:action
watch([() => formState.resource, () => formState.action], ([resource, action]) => {
  if (resource && action) {
    formState.code = `${resource}:${action}`.toLowerCase();
  }
});

async function onSubmit() {
  loading.value = true;
  try {
    const body: CreatePermissionRequestType = {
      code: formState.code,
      resource: formState.resource.toLowerCase(),
      action: formState.action.toLowerCase(),
    };
    if (formState.descriptionEn || formState.descriptionKm) {
      body.description = {};
      if (formState.descriptionEn) body.description.en = formState.descriptionEn;
      if (formState.descriptionKm) body.description.km = formState.descriptionKm;
    }
    await createPermission(body);
    toast.add({ title: t("message.permissionCreated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.addPermission") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.resource')" name="resource">
            <UInput v-model="formState.resource" placeholder="e.g. product" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.action')" name="action">
            <UInput v-model="formState.action" placeholder="e.g. create" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.permissionCode')" name="code">
            <UInput v-model="formState.code" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.descriptionEn')" name="descriptionEn">
            <UInput v-model="formState.descriptionEn" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.descriptionKm')" name="descriptionKm">
            <UInput v-model="formState.descriptionKm" class="w-full" />
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
