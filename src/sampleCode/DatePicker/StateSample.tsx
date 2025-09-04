import { DatePicker, parseDate } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function StateSample() {
  return (
    <Dl>
      <Dt>Enabled</Dt>
      <Dd>
        <DatePicker label="日付" placeholder="YYYY/MM/DD" />
      </Dd>
      <Dt>Filled</Dt>
      <Dd>
        <DatePicker
          label="日付"
          placeholder="YYYY/MM/DD"
          required
          value={[parseDate("2025-09-03")]}
        />
      </Dd>
      <Dt>Error</Dt>
      <Dd>
        <DatePicker
          label="日付"
          placeholder="YYYY/MM/DD"
          required
          invalid
          invalidMessage="正しい日付を入力してください"
          value={[parseDate("2025-09-03")]}
        />
      </Dd>
      <Dt>Disabled</Dt>
      <Dd>
        <DatePicker label="日付" placeholder="YYYY/MM/DD" disabled />
      </Dd>
    </Dl>
  );
}
