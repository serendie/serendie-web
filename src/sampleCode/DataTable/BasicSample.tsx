import { DataTable } from "@serendie/ui";

export type Employee = {
  id: number;
  name: string;
  department: string;
  position: string;
  salary: number;
};

const employees: Employee[] = [
  {
    id: 1,
    name: "田中太郎",
    department: "開発",
    position: "エンジニア",
    salary: 450000,
  },
  {
    id: 2,
    name: "佐藤花子",
    department: "営業",
    position: "マネージャー",
    salary: 520000,
  },
  {
    id: 3,
    name: "山田次郎",
    department: "開発",
    position: "シニアエンジニア",
    salary: 680000,
  },
  {
    id: 4,
    name: "鈴木美穂",
    department: "人事",
    position: "アシスタント",
    salary: 380000,
  },
];

export function BasicSample() {
  const columnHelper = DataTable.createColumnHelper<Employee>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      enableSorting: true,
    }),
    columnHelper.accessor("name", {
      header: "氏名",
      enableSorting: true,
    }),
    columnHelper.accessor("department", {
      header: "部署",
      enableSorting: true,
    }),
    columnHelper.accessor("position", {
      header: "役職",
      enableSorting: true,
    }),
    columnHelper.accessor("salary", {
      header: "給与",
      enableSorting: true,
    }),
  ];

  return <DataTable<Employee> data={employees} columns={columns} />;
}
