import { Pagination } from "@serendie/ui";
import { useState } from "react";

export function BasicSample() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      count={10}
      page={page}
      onPageChange={({ page }) => setPage(page)}
    />
  );
}
