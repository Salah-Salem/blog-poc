'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import PageLoader from '@/components/ui/PageLoader';
import AppShell from '@/components/layout/AppShell';
import AuthGuard from '@/components/auth/AuthGuard';
import FormField from '@/components/profile/FormField';
import UserAvatar from '@/components/ui/UserAvatar';
import { useProfileQuery } from '@/hooks/queries/useProfileQuery';
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from '@/hooks/mutations/useProfileMutations';
import { mapUserProfile, parseDateOfBirth } from '@/lib/profileUtils';

export default function EditProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const uploadAvatar = useUploadAvatarMutation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!profile) return;
    const mapped = mapUserProfile(profile);
    setName(mapped.name);
    setPhone(mapped.phone);
    setAddress(mapped.address);
    setDateOfBirth(mapped.dateOfBirth ? new Date(mapped.dateOfBirth) : null);
  }, [profile]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onAvatarUpload = ({ files }) => {
    if (!files?.[0]) return;
    const formData = new FormData();
    formData.append('avatar', files[0]);
    uploadAvatar.mutate(formData);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(
      {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        dateOfBirth: parseDateOfBirth(dateOfBirth),
      },
      {
        onSuccess: () => {
          setTimeout(() => router.push('/profile'), 1200);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <AppShell>
          <PageLoader label="Loading profile..." />
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell hideSidebars>
        <div className="max-w-3xl mx-auto space-y-4">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-[#1877f2] font-semibold text-sm hover:underline"
          >
            <i className="pi pi-arrow-left" /> Back to profile
          </Link>

          <div className="edit-profile-card">
            <div className="edit-profile-header">
              <h1>Edit Profile</h1>
              <p>Update your personal information and how others see you on BlogBook.</p>
            </div>

            <form onSubmit={onSubmit} className="edit-profile-form">
              <section className="edit-profile-section">
                <h2><i className="pi pi-image" /> Profile Photo</h2>
                <div className="edit-avatar-row">
                  <UserAvatar
                    name={name || profile?.name}
                    image={profile?.profileImage}
                    size="xlarge"
                  />
                  <div className="edit-avatar-actions">
                    <p className="text-sm text-[#65676b] mb-2">
                      Upload a clear photo. JPG, PNG, GIF or WebP. Max 2 MB.
                    </p>
                    <FileUpload
                      mode="basic"
                      accept="image/*"
                      maxFileSize={2000000}
                      chooseLabel="Upload new photo"
                      customUpload
                      uploadHandler={onAvatarUpload}
                      auto
                      disabled={uploadAvatar.isPending}
                    />
                  </div>
                </div>
              </section>

              <section className="edit-profile-section">
                <h2><i className="pi pi-user" /> Basic Information</h2>
                <div className="edit-profile-grid">
                  <FormField label="Full name" icon="pi-user">
                    <InputText
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      placeholder="Your full name"
                      required
                    />
                  </FormField>
                  <FormField label="Email" icon="pi-envelope" hint="Email cannot be changed">
                    <InputText value={profile?.email || ''} className="w-full" disabled />
                  </FormField>
                  <FormField label="Phone number" icon="pi-phone">
                    <InputText
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full"
                      placeholder="+1 555 000 0000"
                    />
                  </FormField>
                  <FormField label="Date of birth" icon="pi-calendar">
                    <Calendar
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.value)}
                      dateFormat="yy-mm-dd"
                      showIcon
                      maxDate={new Date()}
                      className="w-full"
                      inputClassName="w-full"
                      placeholder="Select date"
                    />
                  </FormField>
                </div>
                <FormField label="Address" icon="pi-map-marker">
                  <InputTextarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full"
                    placeholder="Street, city, country"
                  />
                </FormField>
              </section>

              <div className="edit-profile-actions">
                <Link href="/profile">
                  <Button type="button" label="Cancel" outlined />
                </Link>
                <Button
                  type="submit"
                  label="Save changes"
                  icon="pi pi-check"
                  loading={updateProfile.isPending}
                  className="!bg-[#1877f2] !border-[#1877f2]"
                />
              </div>
            </form>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
