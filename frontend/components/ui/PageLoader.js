'use client';

import { ProgressSpinner } from 'primereact/progressspinner';

export default function PageLoader({ label = 'Loading...', className = '' }) {
  return (
    <div className={`page-loader ${className}`.trim()} role="status" aria-live="polite">
      <ProgressSpinner style={{ width: '48px', height: '48px' }} strokeWidth="3" />
      <span>{label}</span>
    </div>
  );
}
