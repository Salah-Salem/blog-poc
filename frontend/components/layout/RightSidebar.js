'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RightSidebar() {
  const { isLoggedIn } = useAuth();

  return (
    <aside className="sticky top-16 hidden w-[300px] shrink-0 self-start space-y-4 xl:block">
      <div className="border-b border-[#ced0d4] pb-4">
        <h3 className="mb-3 text-base font-bold text-[#65676b]">Community</h3>
        <p className="text-sm text-[#050505] leading-relaxed">
          Share updates, discover posts, and join conversations — a social feed
          experience powered by your blog API.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="fb-card fb-card-hover p-4">
          <h3 className="mb-2 font-bold text-[#050505]">Join BlogBook</h3>
          <p className="mb-3 text-sm text-[#65676b]">
            Sign in to publish posts, comment, and connect with other readers.
          </p>
          <Link
            href="/register"
            className="inline-block w-full rounded-md bg-[#1877f2] py-2 text-center font-bold text-white transition-colors hover:bg-[#166fe5]"
          >
            Create account
          </Link>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-base font-bold text-[#65676b]">Shortcuts</h3>
        <ul className="space-y-1 text-sm text-[#050505]">
          <li className="rounded-lg px-2 py-2 font-semibold hover:bg-[#e4e6eb]">
            <i className="pi pi-comments mr-2 text-[#1877f2]" /> Trending discussions
          </li>
          <li className="rounded-lg px-2 py-2 font-semibold hover:bg-[#e4e6eb]">
            <i className="pi pi-clock mr-2 text-[#1877f2]" /> Latest from authors
          </li>
          <li className="rounded-lg px-2 py-2 font-semibold hover:bg-[#e4e6eb]">
            <i className="pi pi-search mr-2 text-[#1877f2]" /> Your saved searches
          </li>
        </ul>
      </div>
    </aside>
  );
}
