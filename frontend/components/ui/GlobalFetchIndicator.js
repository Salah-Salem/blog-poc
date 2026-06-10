'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export default function GlobalFetchIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = isFetching > 0 || isMutating > 0;

  if (!active) return null;

  return (
    <div className="global-fetch-indicator" role="progressbar" aria-busy="true" aria-label="Loading">
      <div className="global-fetch-indicator-bar" />
    </div>
  );
}
