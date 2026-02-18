import { computed } from "vue";
import { defineFilter } from "~/components/ui/table/utils";

export function useProductCategoryFilters() {
  const { t } = useI18n();

  return computed(() => defineFilter([
    {
      label: t("tableColumn.categoryName"),
      index: "name",
      valueType: "text",
    },
  ]));
}
