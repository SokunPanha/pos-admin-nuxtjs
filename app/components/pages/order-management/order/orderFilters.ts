import { computed } from "vue";
import { defineFilter } from "~/components/ui/table/utils";
import { ORDER_STATUS_OPTIONS } from "~~/shared/constants";

export function useOrderFilters() {
  const { t } = useI18n();

  return computed(() => defineFilter([
    {
      label: t("tableColumn.status"),
      index: "status",
      valueType: "select",
      options: ORDER_STATUS_OPTIONS.map((option) => ({
        ...option,
        label: t(`common.${option.label.toLowerCase()}`),
      })),
    },
    {
      label: t("tableColumn.createdAt"),
      index: "range",
      valueType: "dateRange",
    },
  ]));
}
