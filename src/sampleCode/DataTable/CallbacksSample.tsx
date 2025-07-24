import { Badge, DataTable } from "@serendie/ui";
import { Button } from "@serendie/ui";
import { ModalDialog } from "@serendie/ui";
import { List, ListItem } from "@serendie/ui";
import { css } from "@serendie/ui/css";
import { useState } from "react";
import { SerendieSymbol } from "@serendie/symbols";

type RowSelectionState = Record<string, boolean>;
type OnRowSelectionChange = (
  updaterOrValue:
    | RowSelectionState
    | ((old: RowSelectionState) => RowSelectionState)
) => void;

export type Order = {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  status: "処理中" | "配送中" | "完了";
};

const orders: Order[] = [
  {
    id: 1001,
    customer: "A",
    product: "ノートPC",
    quantity: 5,
    total: 450000,
    status: "処理中",
  },
  {
    id: 1002,
    customer: "B",
    product: "プリンター",
    quantity: 2,
    total: 80000,
    status: "配送中",
  },
  {
    id: 1003,
    customer: "C",
    product: "タブレット",
    quantity: 10,
    total: 250000,
    status: "完了",
  },
  {
    id: 1004,
    customer: "D",
    product: "モニター",
    quantity: 3,
    total: 105000,
    status: "処理中",
  },
];

export function CallbacksSample() {
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columnHelper = DataTable.createColumnHelper<Order>();

  const columns = [
    columnHelper.accessor("id", {
      header: "注文ID",
      enableSorting: true,
    }),
    columnHelper.accessor("customer", {
      header: "顧客名",
      enableSorting: true,
    }),
    columnHelper.accessor("product", {
      header: "商品",
      enableSorting: true,
    }),
    columnHelper.accessor("quantity", {
      header: "数量",
      enableSorting: true,
    }),
    columnHelper.accessor("total", {
      header: "合計金額",
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "ステータス",
      enableSorting: true,
      meta: {
        getType: (row: Order) => {
          if (row.status === "完了") return "success";
          if (row.status === "配送中") return "notice";
          return "default";
        },
      },
    }),
  ];

  const handleRowSelectionChange: OnRowSelectionChange = (updaterOrValue) => {
    const selection =
      typeof updaterOrValue === "function"
        ? updaterOrValue(selectedRows)
        : updaterOrValue;
    console.log("選択された注文:", selection);
    setSelectedRows(selection);
  };

  const selectedOrderIds = Object.keys(selectedRows).filter(
    (key) => selectedRows[key]
  );
  const selectedOrders = orders.filter((order) =>
    selectedOrderIds.includes(order.id.toString())
  );

  const handleShowModal = () => {
    if (selectedOrderIds.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        className={css({ marginBottom: "sd.system.dimension.spacing.medium" })}
      >
        <p
          className={css({
            marginBottom: "sd.system.dimension.spacing.small",
            color: "sd.system.color.component.onSurface",
          })}
        >
          注文を選択してボタンを押すと、選択された注文の詳細がモーダルで表示されます。
        </p>
        <Button
          onClick={handleShowModal}
          disabled={selectedOrderIds.length === 0}
        >
          選択した注文を確認 ({selectedOrderIds.length}件)
        </Button>
      </div>

      <DataTable<Order>
        data={orders}
        columns={columns}
        enableRowSelection={true}
        getRowId={(row) => row.id.toString()}
        onRowSelectionChange={handleRowSelectionChange}
        state={{
          rowSelection: selectedRows,
        }}
        initialState={{
          sorting: [{ id: "total", desc: true }],
        }}
      />

      <ModalDialog
        isOpen={isModalOpen}
        title="選択された注文"
        submitButtonLabel="完了"
        onButtonClick={handleCloseModal}
        onOpenChange={(details) => {
          if (!details.open) {
            setIsModalOpen(false);
          }
        }}
      >
        {selectedOrders.length > 0 ? (
          <div>
            <p
              className={css({
                marginBottom: "sd.system.dimension.spacing.medium",
              })}
            >
              {selectedOrders.length}件の注文が選択されています：
            </p>
            <List>
              {selectedOrders.map((order) => (
                <ListItem
                  key={order.id}
                  title={`注文ID: ${order.id}`}
                  description={`顧客: ${order.customer} | 商品: ${order.product}`}
                  leftIcon={<SerendieSymbol name="package" />}
                  isLargeLeftIcon
                >
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "sd.system.dimension.spacing.small",
                    })}
                  >
                    <Badge
                      size="small"
                      styleColor={
                        order.status === "完了"
                          ? "green"
                          : order.status === "配送中"
                            ? "yellow"
                            : "gray"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span>
                      {`数量: ${order.quantity}個 | ¥${order.total.toLocaleString()}`}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <p>注文が選択されていません。</p>
        )}
      </ModalDialog>
    </div>
  );
}
