'use client';

import { Suspense } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <ProgressSpinner />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
