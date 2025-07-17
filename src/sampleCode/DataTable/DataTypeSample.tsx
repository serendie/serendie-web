import { DataTable } from "@serendie/ui";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  isActive: boolean;
  lastLogin: string;
};

const users: User[] = [
  {
    id: 1,
    name: "田中太郎",
    email: "tanaka@example.com",
    role: "admin",
    isActive: true,
    lastLogin: "2025-07-10 09:30",
  },
  {
    id: 2,
    name: "佐藤花子",
    email: "sato@example.com",
    role: "user",
    isActive: true,
    lastLogin: "2025-07-10 14:15",
  },
  {
    id: 3,
    name: "山田次郎",
    email: "yamada@example.com",
    role: "guest",
    isActive: false,
    lastLogin: "2025-07-08 16:45",
  },
  {
    id: 4,
    name: "鈴木美穂",
    email: "suzuki@example.com",
    role: "user",
    isActive: true,
    lastLogin: "2025-07-10 11:20",
  },
];

export function DataTypeSample() {
  const userColumnHelper = DataTable.createColumnHelper<User>();

  const columns = [
    userColumnHelper.accessor("id", {
      header: "ID",
      enableSorting: true,
    }),
    userColumnHelper.accessor("name", {
      header: "名前",
      enableSorting: true,
    }),
    userColumnHelper.accessor("email", {
      header: "メールアドレス",
      enableSorting: true,
    }),
    userColumnHelper.accessor("role", {
      header: "役割",
      enableSorting: true,
      meta: {
        getType: (row: User) => {
          if (row.role === "admin") return "success";
          if (row.role === "guest") return "notice";
          return "default";
        },
      },
    }),
    userColumnHelper.accessor("isActive", {
      header: "アクティブ",
      enableSorting: true,
      meta: {
        getType: (row: User) => {
          return row.isActive ? "success" : "error";
        },
      },
    }),
    userColumnHelper.accessor("lastLogin", {
      header: "最終ログイン",
      enableSorting: true,
    }),
  ];

  return (
    <DataTable<User>
      data={users}
      columns={columns}
      enableRowSelection={true}
      enableSorting={true}
    />
  );
}
