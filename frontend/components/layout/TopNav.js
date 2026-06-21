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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#dddfe2]">
      <div className="mx-auto px-12 h-20 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-xl font-bold">
            b
          </span>
          <span className="hidden sm:block text-[#1877f2] font-bold text-2xl tracking-tight">
            BlogBook
          </span>
        </Link>

        <form onSubmit={onSearch} className="flex-1 max-w-xl hidden md:flex">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search ml-3 text-[#65676b]" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts"
              className="w-full !rounded-full !bg-[#f0f2f5] !border-none !pl-10 !py-2.5"
            />
          </span>
        </form>

        <nav className="flex items-center gap-1 ml-auto">
          <Link href="/">
            <Button icon="pi pi-home" rounded text className="!text-[#1877f2]" aria-label="Home" />
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/profile">
                <Button icon="pi pi-user" rounded text aria-label="Profile" />
              </Link>
              <Link href="/posts/new">
                <Button icon="pi pi-plus-circle" rounded text aria-label="New post" />
              </Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin">
              <Button icon="pi pi-shield" rounded text severity="warning" aria-label="Admin" />
            </Link>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/profile">
                <UserAvatar name={user.name} image={user.profileImage} size="normal" />
              </Link>
              <span className="hidden lg:inline text-sm font-semibold text-[#050505]">
                {user.name}
              </span>
              <Button
                label="Logout"
                size="small"
                text
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button label="Log in" size="small" className="!bg-[#1877f2] !border-[#1877f2]" />
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
