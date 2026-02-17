<script setup lang="ts">
import { z } from "zod/v4";
import type { UpdateUserRequestType, UserItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  user: UserItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { updateUser } = useUserManagement();

const loading = ref(false);

const schema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  password: z.string().optional(),
});

const formState = reactive({
  fullName: "",
  phone: "",
  password: "",
});

watch(open, (val) => {
  if (!val || !props.user) return;
  formState.fullName = props.user.fullName;
  formState.phone = props.user.phone || "";
  formState.password = "";
});

async function onSubmit() {
  if (!props.user) return;
  loading.value = true;
  try {
    const body: UpdateUserRequestType = {
      uuid: props.user.uuid,
      fullName: formState.fullName,
      phone: formState.phone || undefined,
    };
    if (formState.password) {
      body.password = formState.password;
    }
    await updateUser(body);
    toast.add({ title: t("message.userUpdated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.editUser") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.fullName')" name="fullName">
            <UInput v-model="formState.fullName" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.phone')" name="phone">
            <UInput v-model="formState.phone" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.password')" name="password">
            <UInput v-model="formState.password" type="password" class="w-full" />
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
