<script setup lang="ts">
import type { UserItemType, MasterRoleItemType } from "~~/shared/types/ApiResponseType";

const props = defineProps<{
  user: UserItemType | null;
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useI18n();
const toast = useToast();
const { assignUserRole } = useUserManagement();
const { fetchAllRoles } = useMasterData();

const loading = ref(false);
const loadingRoles = ref(false);
const roles = ref<MasterRoleItemType[]>([]);
const selectedRole = ref("");

watch(open, async (val) => {
  if (!val || !props.user) return;
  selectedRole.value = props.user.role?.name || "";
  loadingRoles.value = true;
  try {
    roles.value = await fetchAllRoles();
  } catch {
    roles.value = [];
  } finally {
    loadingRoles.value = false;
  }
});

const hasChanged = computed(() => {
  return selectedRole.value && selectedRole.value !== props.user?.role?.name;
});

async function onSubmit() {
  if (!props.user || !selectedRole.value) return;
  loading.value = true;
  try {
    await assignUserRole(props.user.uuid, selectedRole.value);
    toast.add({ title: t("message.userRoleAssigned"), color: "success" });
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
          <h3 class="text-lg font-semibold">{{ t("label.assignRole") }}</h3>
        </template>

        <div class="space-y-4">
          <div class="text-sm text-gray-500">
            {{ t("message.assignRoleFor", { name: user?.fullName || user?.username }) }}
          </div>

          <!-- Loading -->
          <div v-if="loadingRoles" class="flex justify-center py-4">
            <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-gray-400" />
          </div>

          <!-- Role list -->
          <URadioGroup
            v-else
            v-model="selectedRole"
            :items="roles.map((r) => ({ label: r.name, value: r.name, description: (r.description?.en || r.description?.km || '') as string }))"
          />

          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="outline" @click="open = false">
              {{ t("label.cancel") }}
            </UButton>
            <UButton
              :loading="loading"
              :disabled="!hasChanged"
              @click="onSubmit"
            >
              {{ t("label.save") }}
            </UButton> 
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
