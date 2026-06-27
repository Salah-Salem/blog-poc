'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/ui/UserAvatar';

const links = [
  { href: '/', icon: 'pi pi-home', label: 'News Feed' },
  { href: '/profile', icon: 'pi pi-user', label: 'My Profile', auth: true },
  { href: '/profile', icon: 'pi pi-lock', label: 'Post Privacy', auth: true },
  { href: '/profile/edit', icon: 'pi pi-pencil', label: 'Edit Profile', auth: true },
  { href: '/posts/new', icon: 'pi pi-pencil', label: 'Create Post', auth: true },
  { href: '/search', icon: 'pi pi-search', label: 'Search' },
  { href: '/admin', icon: 'pi pi-shield', label: 'Admin Panel', admin: true },
];

export default function LeftSidebar() {
  const { user, isLoggedIn, isAdmin } = useAuth();

  return (
    <aside className="sticky top-16 hidden w-[280px] shrink-0 self-start lg:block">
      {isLoggedIn && (
        <div className="mb-2 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#e4e6eb]">
          <UserAvatar name={user.name} image={user.profileImage} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#050505]">{user.name}</p>
            <p className="truncate text-xs text-[#65676b]">{user.email}</p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {links
          .filter((l) => (!l.auth || isLoggedIn) && (!l.admin || isAdmin))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#e4e6eb]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2] transition-colors group-hover:bg-white">
                <i className={`${link.icon} text-lg`} />
              </span>
              <span className="font-semibold text-[#050505]">{link.label}</span>
            </Link>
          ))}
      </div>
    </aside>
  );
}
