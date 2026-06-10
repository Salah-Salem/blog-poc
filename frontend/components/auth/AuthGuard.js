'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children, adminOnly = false }) {
  const { loading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) router.replace('/login');
    else if (adminOnly && !isAdmin) router.replace('/');
  }, [loading, isLoggedIn, isAdmin, adminOnly, router]);

  if (loading || !isLoggedIn || (adminOnly && !isAdmin)) {
    return (
      <div className="flex justify-center py-20">
        <ProgressSpinner />
      </div>
    );
  }

  return children;
}
