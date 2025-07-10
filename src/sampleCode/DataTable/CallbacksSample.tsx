import { DataTable } from "@serendie/ui";
import { Button } from "@serendie/ui";
import { ModalDialog } from "@serendie/ui";
import { css } from "@serendie/ui/css";
import { useState } from "react";

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
    customer: "田中商事",
    product: "ノートPC",
    quantity: 5,
    total: 450000,
    status: "処理中",
  },
  {
    id: 1002,
    customer: "佐藤工業",
    product: "プリンター",
    quantity: 2,
    total: 80000,
    status: "配送中",
  },
  {
    id: 1003,
    customer: "山田建設",
    product: "タブレット",
    quantity: 10,
    total: 250000,
    status: "完了",
  },
  {
    id: 1004,
    customer: "鈴木電機",
    product: "モニター",
    quantity: 3,
    total: 105000,
    status: "処理中",
  },
];

export function CallbacksSample() {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
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

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    console.log("選択された注文:", selection);
    setSelectedRows(selection);
  };

  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
    console.log("ソート変更:", sorting);
  };

  const selectedOrderIndices = Object.keys(selectedRows).filter(
    (key) => selectedRows[key]
  );
  const selectedOrders = orders.filter((order, index) =>
    selectedOrderIndices.includes(index.toString())
  );

  const handleShowModal = () => {
    if (selectedOrderIndices.length > 0) {
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
          disabled={selectedOrderIndices.length === 0}
        >
          選択した注文を確認 ({selectedOrderIndices.length}件)
        </Button>
      </div>

      <DataTable<Order>
        data={orders}
        columns={columns}
        onRowSelectionChange={handleRowSelectionChange}
        onSortingChange={handleSortingChange}
        initialSorting={[{ id: "total", desc: true }]}
      />

      <ModalDialog
        isOpen={isModalOpen}
        title="選択された注文"
        submitButtonLabel="閉じる"
        onButtonClick={handleCloseModal}
        onOpenChange={(details) => {
          if (!details.open) {
            setIsModalOpen(false);
          }
        }}
      >
        <div className={css({ padding: "sd.system.dimension.spacing.medium" })}>
          {selectedOrders.length > 0 ? (
            <div>
              <p
                className={css({
                  marginBottom: "sd.system.dimension.spacing.medium",
                })}
              >
                {selectedOrders.length}件の注文が選択されています：
              </p>
              {selectedOrders.map((order) => (
                <div
                  key={order.id}
                  className={css({
                    marginBottom: "sd.system.dimension.spacing.small",
                    padding: "sd.system.dimension.spacing.small",
                    border: "1px solid sd.system.color.outline.default",
                    borderRadius: "sd.system.dimension.corner.small",
                  })}
                >
                  <p>
                    <strong>注文ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>顧客名:</strong> {order.customer}
                  </p>
                  <p>
                    <strong>商品:</strong> {order.product}
                  </p>
                  <p>
                    <strong>数量:</strong> {order.quantity}個
                  </p>
                  <p>
                    <strong>合計金額:</strong> ¥{order.total.toLocaleString()}
                  </p>
                  <p>
                    <strong>ステータス:</strong> {order.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>注文が選択されていません。</p>
          )}
        </div>
      </ModalDialog>
    </div>
  );
}
