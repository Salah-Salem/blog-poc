'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import UserAvatar from '@/components/ui/UserAvatar';
import { formatDateOfBirth } from '@/lib/profileUtils';

export default function ProfileHero({ user, showEdit = true }) {
  if (!user) return null;

  return (
    <div className="profile-hero">
      <div className="profile-hero-cover">
        <div className="profile-hero-cover-shade" />
      </div>
      <div className="profile-hero-body">
        <div className="profile-hero-avatar">
          <UserAvatar name={user.name} image={user.profileImage} size="xlarge" />
        </div>
        <div className="profile-hero-info">
          <h1 className="profile-hero-name">{user.name}</h1>
          <p className="profile-hero-email">{user.email}</p>
          <div className="profile-hero-meta">
            {user.phone && (
              <span><i className="pi pi-phone" /> {user.phone}</span>
            )}
            {user.dateOfBirth && (
              <span><i className="pi pi-calendar" /> {formatDateOfBirth(user.dateOfBirth)}</span>
            )}
            <span className="capitalize"><i className="pi pi-shield" /> {user.role}</span>
          </div>
          {user.address && (
            <p className="profile-hero-address"><i className="pi pi-map-marker" /> {user.address}</p>
          )}
        </div>
        <div className="profile-hero-actions">
          <Link href="/posts/new">
            <Button label="Add post" icon="pi pi-plus" className="!border-[#1877f2] !bg-[#1877f2]" />
          </Link>
          {showEdit && (
            <Link href="/profile/edit" className="profile-hero-action">
              <Button label="Edit profile" icon="pi pi-pencil" className="!border-[#e4e6eb] !bg-[#e4e6eb] !text-[#050505]" />
            </Link>
          )}
        </div>
      </div>
      <div className="profile-hero-tabs">
        <a href="#posts" className="profile-hero-tab profile-hero-tab-active">Posts</a>
        <a href="#about" className="profile-hero-tab">About</a>
        <a href="#privacy" className="profile-hero-tab">Privacy</a>
        <a href="#security" className="profile-hero-tab">Security</a>
      </div>
    </div>
  );
}
