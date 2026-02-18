import { defineFilter } from "~/components/ui/table/utils";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "~~/shared/constants";
import type { MasterRoleItemType } from "~~/shared/types/ApiResponseType";

export function useUserFilters() {
  const { t } = useI18n();
  const { fetchAllRoles } = useMasterData();

  const roles = ref<MasterRoleItemType[]>([]);

  onMounted(async () => {
    try {
      roles.value = await fetchAllRoles();
    } catch {
      roles.value = [];
    }
  });

  const filters = computed(() =>
    defineFilter([
      {
        label: t("tableColumn.username"),
        index: "username",
        valueType: "text",
      },
      {
        label: t("tableColumn.fullName"),
        index: "fullName",
        valueType: "text",
      },
      {
        label: t("tableColumn.status"),
        index: "isActive",
        valueType: "select",
        options: STATUS_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.value === "Y" ? "active" : "inactive"}`) })),
      },
      {
        label: t("tableColumn.role"),
        index: "roleName",
        valueType: "select",
        options: ROLE_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.label}`) })),
      },
    ]),
  );

  return filters;
}
