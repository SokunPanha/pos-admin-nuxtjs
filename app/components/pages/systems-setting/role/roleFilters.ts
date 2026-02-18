import { computed } from "vue";
import { defineFilter } from "~/components/ui/table/utils";
import { SYSTEM_ROLE_OPTIONS } from "~~/shared/constants";

export function useRoleFilters() {
  const { t } = useI18n();

  return computed(() => defineFilter([
    {
      label: t("tableColumn.roleName"),
      index: "name",
      valueType: "text",
    },
    {
      label: t("tableColumn.isSystem"),
      index: "isSystem",
      valueType: "select",
      options: SYSTEM_ROLE_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.value === "Y" ? "yes" : "no"}`) })),
    },
  ]));
}