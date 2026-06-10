'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import InfiniteScrollLoader from '@/components/ui/InfiniteScrollLoader';
import PageLoader from '@/components/ui/PageLoader';
import { Password } from 'primereact/password';
import { TabView, TabPanel } from 'primereact/tabview';
import { Message } from 'primereact/message';
import AppShell from '@/components/layout/AppShell';
import AuthGuard from '@/components/auth/AuthGuard';
import ProfileHero from '@/components/profile/ProfileHero';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/context/AuthContext';
import { useProfileQuery } from '@/hooks/queries/useProfileQuery';
import { useInfiniteMyPostsQuery } from '@/hooks/queries/useInfiniteMyPostsQuery';
import { useChangePasswordMutation } from '@/hooks/mutations/useProfileMutations';
import { formatDateOfBirth } from '@/lib/profileUtils';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery();
  const {
    posts,
    isLoading: postsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteMyPostsQuery({ limit: 5 });
  const changePassword = useChangePasswordMutation();

  const displayUser = profile || user;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  const resetPassword = (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ severity: 'error', text: 'New passwords do not match' });
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-4">
          <ProfileHero user={displayUser} />

          <div className="profile-info-grid">
            <div className="profile-info-card">
              <i className="pi pi-phone profile-info-icon" />
              <div>
                <p className="profile-info-label">Phone</p>
                <p className="profile-info-value">{displayUser?.phone || 'Not set'}</p>
              </div>
            </div>
            <div className="profile-info-card">
              <i className="pi pi-calendar profile-info-icon" />
              <div>
                <p className="profile-info-label">Date of birth</p>
                <p className="profile-info-value">{formatDateOfBirth(displayUser?.dateOfBirth)}</p>
              </div>
            </div>
            <div className="profile-info-card profile-info-card-wide">
              <i className="pi pi-map-marker profile-info-icon" />
              <div>
                <p className="profile-info-label">Address</p>
                <p className="profile-info-value">{displayUser?.address || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="fb-card p-4">
            <TabView>
              <TabPanel header="My Posts">
                {postsLoading ? (
                  <PageLoader label="Loading your posts..." />
                ) : posts.length === 0 ? (
                  <div className="text-center py-10 text-[#65676b]">
                    <p className="mb-3">You haven&apos;t posted anything yet.</p>
                    <Link href="/posts/new">
                      <Button label="Create your first post" className="!bg-[#1877f2] !border-[#1877f2]" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} profileMode />
                    ))}
                    <InfiniteScrollLoader
                      hasMore={!!hasNextPage}
                      isLoadingMore={isFetchingNextPage}
                      onLoadMore={fetchNextPage}
                      showEndMessage={posts.length > 0}
                    />
                  </div>
                )}
              </TabPanel>

              <TabPanel header="Security">
                <form onSubmit={resetPassword} className="max-w-md space-y-4">
                  <h3 className="font-semibold text-[#050505]">Reset password</h3>
                  {passwordMsg && (
                    <Message severity={passwordMsg.severity} text={passwordMsg.text} className="w-full" />
                  )}
                  <Password
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full"
                    inputClassName="w-full"
                    feedback={false}
                    toggleMask
                    required
                  />
                  <Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full"
                    inputClassName="w-full"
                    toggleMask
                    required
                  />
                  <Password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full"
                    inputClassName="w-full"
                    feedback={false}
                    toggleMask
                    required
                  />
                  <Button
                    type="submit"
                    label="Update password"
                    loading={changePassword.isPending}
                    className="!bg-[#1877f2] !border-[#1877f2]"
                  />
                </form>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
