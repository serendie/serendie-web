import { DataTable } from "@serendie/ui";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "ノートパソコン",
    category: "電子機器",
    price: 89000,
    inStock: true,
  },
  { id: 2, name: "マウス", category: "周辺機器", price: 2500, inStock: true },
  {
    id: 3,
    name: "キーボード",
    category: "周辺機器",
    price: 8500,
    inStock: false,
  },
  {
    id: 4,
    name: "モニター",
    category: "電子機器",
    price: 35000,
    inStock: true,
  },
];

export function ColumnHelperSample() {
  // 1. 型を指定してColumnHelperを作成
  const columnHelper = DataTable.createColumnHelper<Product>();

  // 2. 列定義を作成
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      enableSorting: true,
    }),
    columnHelper.accessor("name", {
      header: "商品名",
      enableSorting: true,
    }),
    columnHelper.accessor("category", {
      header: "カテゴリ",
      enableSorting: true,
    }),
    columnHelper.accessor("price", {
      header: "価格（円）",
      enableSorting: true,
    }),
    columnHelper.accessor("inStock", {
      header: "在庫状況",
      enableSorting: true,
      meta: {
        getType: (row: Product) => {
          return row.inStock ? "success" : "error";
        },
      },
    }),
  ];

  return <DataTable<Product> data={products} columns={columns} />;
}
