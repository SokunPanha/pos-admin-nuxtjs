import { computed } from "vue";
import { defineFilter } from "~/components/ui/table/utils";
import { STATUS_OPTIONS } from "~~/shared/constants";

export function useProductFilters() {
  const { t } = useI18n();

  return computed(() => defineFilter([
    {
      label: t("tableColumn.productName"),
      index: "name",
      valueType: "text",
    },
    {
      label: t("tableColumn.status"),
      index: "isActive",
      valueType: "select",
      options: STATUS_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.value === "Y" ? "active" : "inactive"}`) })),
    },
  ]));
}
