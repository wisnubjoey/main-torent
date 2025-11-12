import { useCallback, useMemo, useState } from 'react';

/**
 * Generic, reusable client-side pagination hook.
 * - Fixed default page size of 5 (can be overridden if needed).
 * - Clamps current page when the items array changes (e.g., add/delete).
 * - Provides basic navigation helpers and derived paginated slice.
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = 5,
  initialPage: number = 1,
) {
  // Keep a requested page in state; clamp it lazily to derive the effective current page.
  const [requestedPage, setRequestedPage] = useState<number>(Math.max(1, Math.floor(initialPage)));

  const totalItems = items?.length ?? 0;
  const pageCount = useMemo(() => {
    if (pageSize <= 0) return 0;
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // Derive a clamped current page based on requestedPage and pageCount.
  const currentPage = useMemo(() => {
    if (pageCount === 0) return 1;
    const p = Math.floor(requestedPage);
    if (Number.isNaN(p)) return 1;
    if (p < 1) return 1;
    if (p > pageCount) return pageCount;
    return p;
  }, [requestedPage, pageCount]);

  const setPage = useCallback((page: number) => {
    setRequestedPage(Math.floor(page));
  }, []);

  const nextPage = useCallback(() => {
    if (pageCount === 0) return;
    setRequestedPage((p) => Math.floor(p) + 1);
  }, [pageCount]);

  const prevPage = useCallback(() => {
    if (pageCount === 0) return;
    setRequestedPage((p) => Math.max(1, Math.floor(p) - 1));
  }, [pageCount]);

  const canNextPage = currentPage < pageCount && pageCount > 0;
  const canPrevPage = currentPage > 1 && pageCount > 0;

  const startIndex = useMemo(() => {
    if (pageCount === 0) return 0;
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize, pageCount]);

  const endIndex = useMemo(() => startIndex + pageSize, [startIndex, pageSize]);

  const paginatedItems = useMemo(() => {
    if (!items || items.length === 0) return [] as T[];
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  return {
    // state
    currentPage,
    pageSize,
    pageCount,
    totalItems,
    // derived
    items: paginatedItems,
    range: {
      start: totalItems === 0 ? 0 : startIndex + 1, // 1-based for display
      end: Math.min(totalItems, endIndex),
    },
    // controls
    setPage,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  } as const;
}