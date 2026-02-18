import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { OrderItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";

interface OrderColumnActions {
  onView: (order: OrderItemType) => void;
}

export function useOrderColumns(actions: OrderColumnActions) {
  const { t, locale } = useI18n();
  const { hasPermission } = usePermission();

  return () => {
    const cols = defineProTableColumns([
      {
        accessorKey: "orderId",
        header: t("tableColumn.orderId"),
        title: t("tableColumn.orderId"),
      },
      {
        accessorKey: "cashier",
        header: t("tableColumn.cashier"),
        title: t("tableColumn.cashier"),
        cell: ({ row }: any) => {
          return row.getValue("cashier")?.fullName || "-";
        },
      },
      {
        accessorKey: "totalAmount",
        header: t("tableColumn.totalAmount"),
        title: t("tableColumn.totalAmount"),
        cell: ({ row }: any) => {
          const amount = row.getValue("totalAmount");
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
        },
      },
      {
        accessorKey: "discount",
        header: t("tableColumn.discount"),
        title: t("tableColumn.discount"),
        cell: ({ row }: any) => {
          const discount = row.getValue("discount");
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(discount);
        },
      },
      {
        accessorKey: "paymentMethod",
        header: t("tableColumn.paymentMethod"),
        title: t("tableColumn.paymentMethod"),
        cell: ({ row }: any) => {
          const pm = row.getValue("paymentMethod");
          return pm?.name?.[locale.value] || pm?.name?.en || "-";
        },
      },
      {
        accessorKey: "status",
        header: t("tableColumn.status"),
        title: t("tableColumn.status"),
        cell: ({ row }: any) => {
           return h('span', { class: 'capitalize' }, row.getValue("status")?.toLowerCase());
        },
      },
      {
        accessorKey: "createdAt",
        header: t("tableColumn.createdAt"),
        title: t("tableColumn.createdAt"),
        cell: ({ row }: any) => {
          return new Date(row.getValue("createdAt")).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        },
      },
    ] as any);

    if (hasPermission(PERMISSIONS.ORDER_VIEW)) {
      cols.push({
        id: "actions",
        header: t("tableColumn.actions"),
        title: t("tableColumn.actions"),
        fixed: true,
        cell: ({ row }: any) => {
          return h(
            UButton,
            {
              icon: "i-lucide-eye",
              variant: "ghost",
              color: "neutral",
              size: "xs",
              onClick: () => actions.onView(row.original as OrderItemType),
            }
          );
        },
        meta: {
          class: {
            th: "text-center",
            td: "text-center",
          },
        },
      });
    }

    return cols;
  };
}
