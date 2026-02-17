<script setup lang="ts">
import { z } from "zod/v4";
import type { UpdateRoleRequestType, FullRoleItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  role: FullRoleItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { updateRole } = useRoleManagement();

const loading = ref(false);

const schema = z.object({
  newName: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
});

const formState = reactive({
  newName: "",
  descriptionEn: "",
  descriptionKm: "",
});

watch(open, (val) => {
  if (!val || !props.role) return;
  formState.newName = props.role.name;
  formState.descriptionEn = props.role.description?.en || "";
  formState.descriptionKm = props.role.description?.km || "";
});

async function onSubmit() {
  if (!props.role) return;
  loading.value = true;
  try {
    const body: UpdateRoleRequestType = {
      name: props.role.name,
    };
    if (formState.newName && formState.newName !== props.role.name) {
      body.newName = formState.newName.toUpperCase();
    }
    body.description = {
      en: formState.descriptionEn,
      km: formState.descriptionKm,
    };
    await updateRole(body);
    toast.add({ title: t("message.roleUpdated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.editRole") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.roleName')" name="newName">
            <UInput v-model="formState.newName" class="w-full" />
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