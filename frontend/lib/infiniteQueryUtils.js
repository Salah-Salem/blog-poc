export function getPostsNextPageParam(lastPage) {
  const pagination = lastPage?.pagination;
  if (!pagination) return undefined;
  if (pagination.page < pagination.totalPages) return pagination.page + 1;
  return undefined;
}

export function flattenPostPages(data) {
  if (!data?.pages?.length) return [];
  return data.pages.flatMap((page) => page.posts ?? []);
}

export function getLastPagination(data) {
  const pages = data?.pages;
  if (!pages?.length) return null;
  return pages[pages.length - 1]?.pagination ?? null;
}
