'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import UserAvatar from '@/components/ui/UserAvatar';
import { formatDateOfBirth } from '@/lib/profileUtils';

export default function ProfileHero({ user, showEdit = true }) {
  if (!user) return null;

  return (
    <div className="profile-hero">
      <div className="profile-hero-cover" />
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
        {showEdit && (
          <Link href="/profile/edit" className="profile-hero-action">
            <Button label="Edit Profile" icon="pi pi-pencil" className="!bg-[#1877f2] !border-[#1877f2]" />
          </Link>
        )}
      </div>
    </div>
  );
}
