import { DataTable } from "@serendie/ui";

export type Device = {
  id: number;
  name: string;
  type: string;
  status: "オンライン" | "オフライン" | "メンテナンス中";
  lastSeen: string;
};

const devices: Device[] = [
  {
    id: 1,
    name: "Router-001",
    type: "ルーター",
    status: "オンライン",
    lastSeen: "2025-07-10 14:30",
  },
  {
    id: 2,
    name: "Switch-002",
    type: "スイッチ",
    status: "オフライン",
    lastSeen: "2025-07-10 12:15",
  },
  {
    id: 3,
    name: "AP-003",
    type: "アクセスポイント",
    status: "オンライン",
    lastSeen: "2025-07-10 14:28",
  },
  {
    id: 4,
    name: "Camera-004",
    type: "カメラ",
    status: "メンテナンス中",
    lastSeen: "2025-07-10 09:45",
  },
];

export function AdvancedSample() {
  return (
    <DataTable.Root>
      <DataTable.Thead>
        <DataTable.Tr>
          <DataTable.HeaderCell>デバイス名</DataTable.HeaderCell>
          <DataTable.HeaderCell>タイプ</DataTable.HeaderCell>
          <DataTable.HeaderCell>ステータス</DataTable.HeaderCell>
          <DataTable.HeaderCell>最終確認</DataTable.HeaderCell>
        </DataTable.Tr>
      </DataTable.Thead>
      <DataTable.Tbody>
        {devices.map((device) => (
          <DataTable.Tr key={device.id}>
            <DataTable.BodyCell>{device.name}</DataTable.BodyCell>
            <DataTable.BodyCell>{device.type}</DataTable.BodyCell>
            <DataTable.BodyCell>{device.status}</DataTable.BodyCell>
            <DataTable.BodyCell>{device.lastSeen}</DataTable.BodyCell>
          </DataTable.Tr>
        ))}
      </DataTable.Tbody>
    </DataTable.Root>
  );
}
