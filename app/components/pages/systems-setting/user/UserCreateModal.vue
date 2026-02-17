<script setup lang="ts">
import { z } from "zod/v4";
import type { CreateUserRequestType, MasterRoleItemType } from "~~/shared/types/ApiResponseType";

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { createUser } = useUserManagement();
const { fetchAllRoles } = useMasterData();

const loading = ref(false);
const roles = ref<MasterRoleItemType[]>([]);
const loadingRoles = ref(false);

const roleOptions = computed(() =>
  roles.value.map((r) => ({ label: r.name, value: r.name })),
);

const schema = z.object({
  username: z.string().min(1, t("validation.usernameRequired")),
  password: z.string().min(6, t("validation.passwordMin")),
  fullName: z.string().min(1),
  phone: z.string().optional(),
  roleName: z.string().min(1),
});

const formState = reactive({
  username: "",
  password: "",
  fullName: "",
  phone: "",
  roleName: "CASHIER",
});

watch(open, async (val) => {
  if (!val) return;
  formState.username = "";
  formState.password = "";
  formState.fullName = "";
  formState.phone = "";
  formState.roleName = "";
  loadingRoles.value = true;
  try {
    roles.value = await fetchAllRoles();
  } catch {
    roles.value = [];
  } finally {
    loadingRoles.value = false;
  }
});

async function onSubmit() {
  loading.value = true;
  try {
    const body: CreateUserRequestType = {
      username: formState.username,
      password: formState.password,
      fullName: formState.fullName,
      phone: formState.phone || undefined,
      roleName: formState.roleName,
    };
    await createUser(body);
    toast.add({ title: t("message.userCreated"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.addUser") }}</h3>
        </template>

        <UForm
          :schema="schema"
          :state="formState"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField :label="t('label.username')" name="username">
            <UInput v-model="formState.username" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.fullName')" name="fullName">
            <UInput v-model="formState.fullName" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.phone')" name="phone">
            <UInput v-model="formState.phone" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.password')" name="password">
            <UInput v-model="formState.password" type="password" class="w-full" />
          </UFormField>

          <UFormField :label="t('label.role')" name="roleName">
            <USelect v-model="formState.roleName" :items="roleOptions" :loading="loadingRoles" class="w-full" />
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
