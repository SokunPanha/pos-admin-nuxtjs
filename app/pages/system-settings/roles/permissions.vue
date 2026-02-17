<script setup lang="ts">
import type { MasterPermissionItemType } from "~~/shared/types/ApiResponseType";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const { fetchAllPermissions } = useMasterData();
const { assignPermissions } = useRoleManagement();

const roleName = computed(() => route.query.name as string);

// --- Search ---
const searchQuery = ref("");
const debouncedSearch = ref("");
let searchTimer: ReturnType<typeof setTimeout>;
watch(searchQuery, (val) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    debouncedSearch.value = val;
  }, 300);
});

// --- State ---
const loading = ref(true);
const saving = ref(false);
const allPermissions = ref<MasterPermissionItemType[]>([]);
const selectedCodes = ref<Set<string>>(new Set());
const originalCodes = ref<Set<string>>(new Set());

// --- Colors per resource module ---
const moduleColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  product: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  order: {
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
  },
  user: {
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  role: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  report: {
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
  },
  customer: {
    bg: "bg-teal-50 dark:bg-teal-950",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
  },
  permission: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  setting: {
    bg: "bg-pink-50 dark:bg-pink-950",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
  },
};

const fallbackColors = [
  {
    bg: "bg-indigo-50 dark:bg-indigo-950",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  {
    bg: "bg-cyan-50 dark:bg-cyan-950",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
];

function getModuleColor(resource: string): { bg: string; text: string; border: string } {
  if (moduleColors[resource]) return moduleColors[resource]!;
  const hash = resource.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return fallbackColors[hash % fallbackColors.length]!;
}

// --- Group permissions by resource ---
const groupedPermissions = computed(() => {
  const groups: { [key: string]: MasterPermissionItemType[] } = {};
  for (const perm of allPermissions.value) {
    (groups[perm.resource] ??= []).push(perm);
  }
  return groups;
});

function getPerms(resource: string): MasterPermissionItemType[] {
  return groupedPermissions.value[resource] ?? [];
}

const resources = computed(() => {
  const all = Object.keys(groupedPermissions.value).sort();
  const query = debouncedSearch.value.trim().toLowerCase();
  if (!query) return all;
  return all.filter((r) => r.toLowerCase().includes(query));
});

const hasChanges = computed(() => {
  if (selectedCodes.value.size !== originalCodes.value.size) return true;
  for (const code of selectedCodes.value) {
    if (!originalCodes.value.has(code)) return true;
  }
  return false;
});

const selectAllValue = computed(() => {
  if (allPermissions.value.length === 0) return false;
  if (selectedCodes.value.size === allPermissions.value.length) return true;
  if (selectedCodes.value.size > 0) return "indeterminate" as const;
  return false;
});

function getResourceCheckValue(resource: string): boolean | "indeterminate" {
  const perms = getPerms(resource);
  if (perms.length === 0) return false;
  const count = perms.filter((p) => selectedCodes.value.has(p.code)).length;
  if (count === perms.length) return true;
  if (count > 0) return "indeterminate";
  return false;
}

function getResourceSelectedCount(resource: string) {
  const perms = getPerms(resource);
  return perms.filter((p) => selectedCodes.value.has(p.code)).length;
}

// --- Toggle functions ---
function togglePermission(code: string) {
  const newSet = new Set(selectedCodes.value);
  if (newSet.has(code)) {
    newSet.delete(code);
  } else {
    newSet.add(code);
  }
  selectedCodes.value = newSet;
}

function toggleResource(resource: string) {
  const perms = getPerms(resource);
  const newSet = new Set(selectedCodes.value);
  if (getResourceCheckValue(resource) === true) {
    for (const p of perms) newSet.delete(p.code);
  } else {
    for (const p of perms) newSet.add(p.code);
  }
  selectedCodes.value = newSet;
}

function toggleAll() {
  if (selectAllValue.value === true) {
    selectedCodes.value = new Set();
  } else {
    selectedCodes.value = new Set(allPermissions.value.map((p) => p.code));
  }
}

// --- Load data ---
async function loadData() {
  loading.value = true;
  try {
    const [permissions, roleRes] = await Promise.all([
      fetchAllPermissions(),
      $fetch<{ items: any[] }>("/api/admin/role/list", {
        method: "POST",
        body: { name: roleName.value, page: 1, pageSize: 1 },
      }),
    ]);

    allPermissions.value = permissions;

    const role = roleRes.items?.[0];
    const assignedCodes = new Set<string>(
      (role?.permissions || []).map((p: any) => p.code),
    );
    selectedCodes.value = new Set(assignedCodes);
    originalCodes.value = new Set(assignedCodes);
  } catch (error) {
    console.error("Failed to load data:", error);
    toast.add({ title: t("message.operationFailed"), color: "error" });
  } finally {
    loading.value = false;
  }
}

async function onSave() {
  saving.value = true;
  try {
    await assignPermissions(roleName.value, Array.from(selectedCodes.value));
    toast.add({ title: t("message.permissionsAssigned"), color: "success" });
    originalCodes.value = new Set(selectedCodes.value);
  } catch {
    toast.add({ title: t("message.operationFailed"), color: "error" });
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-4 h-full p-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          @click="router.push('/system-settings/roles')"
        />
        <div>
          <h1 class="text-xl font-semibold">
            {{ t("label.assignPermissions") }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ t("message.assignPermissionsFor", { name: roleName }) }}
          </p>
        </div>
      </div>
      <UButton
        :loading="saving"
        :disabled="!hasChanges"
        icon="i-lucide-save"
        @click="onSave"
      >
        {{ t("label.save") }}
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="size-8 animate-spin text-gray-400"
      />
    </div>

    <!-- Permissions -->
    <template v-else>
      <!-- Search -->
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        :placeholder="t('label.searchByResource')"
      />

      <!-- Select All -->
      <div
        class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <UCheckbox
          :model-value="selectAllValue"
          :label="`${t('label.selectAll')} (${selectedCodes.size}/${allPermissions.length})`"
          @update:model-value="toggleAll"
        />
      </div>
      <main class="h-[70%] overflow-scroll grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
        <!-- Grouped by resource -->
        <div
          v-for="resource in resources"
          :key="resource"
          class="rounded-lg border h-fit"
          :class="getModuleColor(resource).border"
        >
          <!-- Resource header -->
          <div
            class="flex items-center gap-3 px-4 py-3 flex-wrap"
            :class="getModuleColor(resource).bg"
          >
            <UCheckbox
              :model-value="getResourceCheckValue(resource)"
              @update:model-value="toggleResource(resource)"
            />
            <span
              class="font-semibold capitalize"
              :class="getModuleColor(resource).text"
            >
              {{ resource }}
            </span>
            <span class="text-xs" :class="getModuleColor(resource).text">
              ({{ getResourceSelectedCount(resource) }}/{{
                getPerms(resource).length
              }})
            </span>
          </div>

          <!-- Permission checkboxes -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0">
            <div
              v-for="perm in getPerms(resource)"
              :key="perm.code"
              class="flex items-center gap-2 px-4 py-2.5 border-t cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
              :class="getModuleColor(resource).border"
              @click="togglePermission(perm.code)"
            >
              <UCheckbox
                :model-value="selectedCodes.has(perm.code)"
                :label="perm.action"
                class="capitalize"
                @click.stop
                @update:model-value="togglePermission(perm.code)"
              />
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>
