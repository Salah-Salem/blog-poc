'use client';

import { Avatar } from 'primereact/avatar';
import { assetUrl } from '@/lib/api';

export default function UserAvatar({
  name = 'User',
  image,
  size = 'large',
  className = '',
}) {
  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  const src = assetUrl(image);

  if (src) {
    return (
      <Avatar
        image={src}
        size={size}
        shape="circle"
        className={className}
      />
    );
  }

  return (
    <Avatar
      label={initial}
      size={size}
      shape="circle"
      className={`bg-[#1877f2] text-white font-semibold ${className}`}
    />
  );
}
