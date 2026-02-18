import { computed } from "vue";
import { defineFilter } from "~/components/ui/table/utils";

export function usePermissionFilters() {
  const { t } = useI18n();

  return computed(() => defineFilter([
    {
      label: t("tableColumn.permissionCode"),
      index: "code",
      valueType: "text",
    },
    {
      label: t("tableColumn.resource"),
      index: "resource",
      valueType: "text",
    },
    {
      label: t("tableColumn.action"),
      index: "action",
      valueType: "text",
    },
  ]));
}
