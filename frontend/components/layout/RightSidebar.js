'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RightSidebar() {
  const { isLoggedIn } = useAuth();

  return (
    <aside className="hidden xl:block w-[400px] shrink-0 space-y-3 sticky top-20 self-start">
      <div className="fb-card p-4">
        <h3 className="font-semibold text-[#65676b] text-sm mb-3">Community</h3>
        <p className="text-sm text-[#050505] leading-relaxed">
          Share updates, discover posts, and join conversations — a social feed
          experience powered by your blog API.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="fb-card p-4">
          <h3 className="font-semibold text-[#050505] mb-2">Join BlogBook</h3>
          <p className="text-sm text-[#65676b] mb-3">
            Sign in to publish posts, comment, and connect with other readers.
          </p>
          <Link
            href="/register"
            className="inline-block w-full text-center bg-[#1877f2] text-white font-semibold py-2 rounded-lg hover:bg-[#166fe5]"
          >
            Create account
          </Link>
        </div>
      )}

      <div className="fb-card p-4">
        <h3 className="font-semibold text-[#65676b] text-sm mb-2">Shortcuts</h3>
        <ul className="text-sm text-[#65676b] space-y-1">
          <li>• Trending discussions</li>
          <li>• Latest from authors</li>
          <li>• Your saved searches</li>
        </ul>
      </div>
    </aside>
  );
}
