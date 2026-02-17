<script setup lang="ts">
import { z } from "zod/v4";
import type { UpdatePermissionRequestType, PermissionItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  permission: PermissionItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { updatePermission } = usePermissionManagement();

const loading = ref(false);

const schema = z.object({
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
});

const formState = reactive({
  descriptionEn: "",
  descriptionKm: "",
});

watch(open, (val) => {
  if (!val || !props.permission) return;
  formState.descriptionEn = props.permission.description?.en || "";
  formState.descriptionKm = props.permission.description?.km || "";
});

async function onSubmit() {
  if (!props.permission) return;
  loading.value = true;
  try {
    const body: UpdatePermissionRequestType = {
      code: props.permission.code,
      description: {
        en: formState.descriptionEn,
        km: formState.descriptionKm,
      },
    };
    await updatePermission(body);
    toast.add({ title: t("message.permissionUpdated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.editPermission") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="text-sm text-gray-500">
            <span class="font-medium">{{ t("label.permissionCode") }}:</span>
            <code class="ml-1 px-2 py-1 rounded bg-gray-100 font-mono">{{ permission?.code }}</code>
          </div>

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
