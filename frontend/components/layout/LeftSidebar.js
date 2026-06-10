'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/ui/UserAvatar';

const links = [
  { href: '/', icon: 'pi pi-home', label: 'News Feed' },
  { href: '/profile', icon: 'pi pi-user', label: 'My Profile', auth: true },
  { href: '/profile/edit', icon: 'pi pi-pencil', label: 'Edit Profile', auth: true },
  { href: '/posts/new', icon: 'pi pi-pencil', label: 'Create Post', auth: true },
  { href: '/search', icon: 'pi pi-search', label: 'Search' },
  { href: '/admin', icon: 'pi pi-shield', label: 'Admin Panel', admin: true },
];

export default function LeftSidebar() {
  const { user, isLoggedIn, isAdmin } = useAuth();

  return (
    <aside className="hidden lg:block w-[280px] shrink-0 space-y-2 sticky top-20 self-start">
      {isLoggedIn && (
        <div className="fb-card flex items-center gap-3 p-3">
          <UserAvatar name={user.name} image={user.profileImage} />
          <div>
            <p className="font-semibold text-[#050505]">{user.name}</p>
            <p className="text-xs text-[#65676b]">{user.email}</p>
          </div>
        </div>
      )}

      <div className="fb-card p-2">
        {links
          .filter((l) => (!l.auth || isLoggedIn) && (!l.admin || isAdmin))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0f2f5] transition-colors"
            >
              <i className={`${link.icon} text-[#1877f2] text-lg`} />
              <span className="font-semibold text-[#050505]">{link.label}</span>
            </Link>
          ))}
      </div>
    </aside>
  );
}
