export function formatDateOfBirth(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function parseDateOfBirth(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

export function mapUserProfile(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    profileImage: profile.profileImage,
    phone: profile.phone || '',
    address: profile.address || '',
    dateOfBirth: profile.dateOfBirth || null,
  };
}
