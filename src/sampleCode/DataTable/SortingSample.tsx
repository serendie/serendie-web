import { DataTable } from "@serendie/ui";

export type Sales = {
  id: number;
  region: string;
  salesperson: string;
  amount: number;
  date: string;
};

const salesData: Sales[] = [
  {
    id: 1,
    region: "東京",
    salesperson: "高橋",
    amount: 1200000,
    date: "2025-01-15",
  },
  {
    id: 2,
    region: "大阪",
    salesperson: "伊藤",
    amount: 950000,
    date: "2025-01-18",
  },
  {
    id: 3,
    region: "名古屋",
    salesperson: "中村",
    amount: 800000,
    date: "2025-01-22",
  },
  {
    id: 4,
    region: "福岡",
    salesperson: "小林",
    amount: 1350000,
    date: "2025-01-25",
  },
  {
    id: 5,
    region: "東京",
    salesperson: "松本",
    amount: 750000,
    date: "2025-01-28",
  },
];

export function SortingSample() {
  const columnHelper = DataTable.createColumnHelper<Sales>();

  const columns = [
    columnHelper.accessor("region", {
      header: "地域",
      enableSorting: true,
      sortDescFirst: true,
    }),
    columnHelper.accessor("salesperson", {
      header: "営業担当",
      enableSorting: true,
    }),
    columnHelper.accessor("amount", {
      header: "売上金額",
      enableSorting: true,
    }),
    columnHelper.accessor("date", {
      header: "日付",
      enableSorting: true,
    }),
  ];

  return <DataTable<Sales> data={salesData} columns={columns} />;
}
