import { DataTable } from "@serendie/ui";
import { css } from "@serendie/ui/css";

export type Task = {
  id: number;
  title: string;
  status: "完了" | "進行中" | "未着手";
  assignee: string;
};

const tasks: Task[] = [
  { id: 1, title: "UI設計", status: "完了", assignee: "田中" },
  { id: 2, title: "API開発", status: "進行中", assignee: "佐藤" },
  { id: 3, title: "テスト作成", status: "未着手", assignee: "山田" },
  { id: 4, title: "デプロイ準備", status: "未着手", assignee: "鈴木" },
];

export function SelectionSample() {
  const columnHelper = DataTable.createColumnHelper<Task>();

  const columns = [
    columnHelper.accessor("title", {
      header: "タスク名",
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "ステータス",
      enableSorting: true,
      meta: {
        getType: (row: Task) => {
          if (row.status === "完了") return "success";
          if (row.status === "進行中") return "notice";
          return "default";
        },
      },
    }),
    columnHelper.accessor("assignee", {
      header: "担当者",
      enableSorting: true,
    }),
  ];

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "sd.system.dimension.spacing.extraLarge",
      })}
    >
      <div>
        <h3
          className={css({
            marginBottom: "sd.system.dimension.spacing.medium",
          })}
        >
          行選択機能あり
        </h3>
        <DataTable<Task>
          data={tasks}
          columns={columns}
          enableRowSelection={true}
          onRowSelectionChange={(selection) =>
            console.log("選択されたタスク:", selection)
          }
        />
      </div>

      <div>
        <h3
          className={css({
            marginBottom: "sd.system.dimension.spacing.medium",
          })}
        >
          行選択機能なし
        </h3>
        <DataTable<Task>
          data={tasks}
          columns={columns}
          enableRowSelection={false}
        />
      </div>
    </div>
  );
}
