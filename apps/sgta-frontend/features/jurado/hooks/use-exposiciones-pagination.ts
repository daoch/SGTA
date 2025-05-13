import { useMemo, useState } from "react";

export function useClientPagination<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);

  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = (n: number) => {
    const p = Math.max(1, Math.min(n, totalPages));
    setPage(p);
  };

  return { page, pageSize, total, totalPages, currentItems, goToPage };
}
