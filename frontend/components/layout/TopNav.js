'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/ui/UserAvatar';

export default function TopNav() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dddfe2] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      <div className="flex h-14 w-full items-center gap-2 px-3 sm:px-4 lg:px-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-xl font-black text-white shadow-sm">
            b
          </span>
          <span className="hidden text-2xl font-black tracking-tight text-[#1877f2] sm:block">
            BlogBook
          </span>
        </Link>

        <form onSubmit={onSearch} className="hidden max-w-[320px] flex-1 md:flex">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search ml-3 text-[#65676b]" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search BlogBook"
              className="w-full !rounded-full !border-none !bg-[#f0f2f5] !py-2 !pl-10"
            />
          </span>
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <Link href="/" className="fb-icon-button !bg-transparent text-[#1877f2]" aria-label="Home">
            <i className="pi pi-home text-xl" />
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/profile" className="fb-icon-button !bg-transparent" aria-label="Profile">
                <i className="pi pi-user text-xl" />
              </Link>
              <Link href="/posts/new" className="fb-icon-button !bg-transparent" aria-label="New post">
                <i className="pi pi-plus-circle text-xl" />
              </Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" className="fb-icon-button !bg-transparent text-[#b06f00]" aria-label="Admin">
              <i className="pi pi-shield text-xl" />
            </Link>
          )}
          {isLoggedIn ? (
            <div className="ml-1 flex items-center gap-2">
              <Link href="/profile" className="rounded-full ring-offset-2 transition hover:ring-2 hover:ring-[#1877f2]">
                <UserAvatar name={user.name} image={user.profileImage} size="normal" />
              </Link>
              <span className="hidden max-w-[140px] truncate text-sm font-semibold text-[#050505] lg:inline">
                {user.name}
              </span>
              <Button
                icon="pi pi-sign-out"
                size="small"
                rounded
                text
                aria-label="Logout"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button label="Log in" size="small" className="!border-[#1877f2] !bg-[#1877f2]" />
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button label="Sign up" size="small" outlined />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
