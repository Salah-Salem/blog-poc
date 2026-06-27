'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import InfiniteScrollLoader from '@/components/ui/InfiniteScrollLoader';
import PageLoader from '@/components/ui/PageLoader';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { TabView, TabPanel } from 'primereact/tabview';
import { Message } from 'primereact/message';
import AppShell from '@/components/layout/AppShell';
import AuthGuard from '@/components/auth/AuthGuard';
import ProfileHero from '@/components/profile/ProfileHero';
import PostCard from '@/components/posts/PostCard';
import VisibilityBadge from '@/components/posts/VisibilityBadge';
import { useAuth } from '@/context/AuthContext';
import { useProfileQuery } from '@/hooks/queries/useProfileQuery';
import { usePrivacyQuery } from '@/hooks/queries/usePrivacyQuery';
import { useInfiniteMyPostsQuery } from '@/hooks/queries/useInfiniteMyPostsQuery';
import {
  useChangePasswordMutation,
  useUpdatePrivacyMutation,
} from '@/hooks/mutations/useProfileMutations';
import { formatDateOfBirth } from '@/lib/profileUtils';

const postVisibilityOptions = [
  { label: 'Public', value: 'public', icon: 'pi pi-globe' },
  { label: 'Private', value: 'private', icon: 'pi pi-lock' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery();
  const { data: privacy, isLoading: privacyLoading } = usePrivacyQuery();
  const {
    posts,
    isLoading: postsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteMyPostsQuery({ limit: 5 });
  const changePassword = useChangePasswordMutation();
  const updatePrivacy = useUpdatePrivacyMutation();

  const displayUser = profile || user;
  const postVisibility = privacy?.postVisibility || 'public';
  const postCount = posts.length;
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
        <div className="profile-page space-y-4">
          <ProfileHero user={displayUser} />

          <div className="profile-content-grid">
            <aside className="profile-sidebar" id="about">
              <div className="fb-card profile-intro-card">
                <div className="profile-card-header">
                  <h2>Intro</h2>
                  <Link href="/profile/edit">Edit details</Link>
                </div>
                <div className="profile-intro-list">
                  <p><i className="pi pi-envelope" /> {displayUser?.email}</p>
                  <p><i className="pi pi-phone" /> {displayUser?.phone || 'Phone not set'}</p>
                  <p><i className="pi pi-calendar" /> {formatDateOfBirth(displayUser?.dateOfBirth)}</p>
                  <p><i className="pi pi-map-marker" /> {displayUser?.address || 'Address not set'}</p>
                  <p><i className="pi pi-shield" /> {displayUser?.role || 'user'}</p>
                </div>
              </div>

              <div className="fb-card profile-stats-card">
                <div>
                  <strong>{postCount}</strong>
                  <span>Posts loaded</span>
                </div>
                <div>
                  <strong>{postVisibility === 'private' ? 'Private' : 'Public'}</strong>
                  <span>Post privacy</span>
                </div>
              </div>

              <div className="fb-card profile-photos-card">
                <div className="profile-card-header">
                  <h2>Highlights</h2>
                </div>
                <div className="profile-highlight-grid">
                  <div><i className="pi pi-book" /><span>Stories</span></div>
                  <div><i className="pi pi-comments" /><span>Comments</span></div>
                  <div><i className="pi pi-thumbs-up" /><span>Reactions</span></div>
                  <div><i className="pi pi-lock" /><span>Privacy</span></div>
                </div>
              </div>
            </aside>

            <section className="profile-main-panel">
              <div className="fb-card profile-tabs-card">
            <TabView>
              <TabPanel header="My Posts">
                <div id="posts" className="profile-section-title">
                  <div>
                    <h2>Posts</h2>
                    <p>Manage everything you have shared on BlogBook.</p>
                  </div>
                  <Link href="/posts/new">
                    <Button label="Create post" icon="pi pi-plus" size="small" className="!border-[#1877f2] !bg-[#1877f2]" />
                  </Link>
                </div>
                {postsLoading ? (
                  <PageLoader label="Loading your posts..." />
                ) : posts.length === 0 ? (
                  <div className="profile-empty-state">
                    <i className="pi pi-file-edit" />
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

              <TabPanel header="Post Privacy">
                {privacyLoading ? (
                  <PageLoader label="Loading privacy..." />
                ) : (
                  <div id="privacy" className="profile-privacy-panel">
                    <div className="profile-privacy-copy">
                      <span className="profile-panel-icon"><i className="pi pi-lock" /></span>
                      <h3 className="mb-1 text-lg font-bold text-[#050505]">Who can see your posts?</h3>
                      <p className="text-sm text-[#65676b]">
                        This setting applies to all posts on your profile. New and existing posts follow this value.
                      </p>
                    </div>
                    <div className="profile-current-privacy">
                      <span className="text-sm font-semibold text-[#65676b]">Current:</span>
                      <VisibilityBadge visibility={postVisibility} />
                    </div>
                    <SelectButton
                      value={postVisibility}
                      options={postVisibilityOptions}
                      onChange={(e) => {
                        if (e.value && e.value !== postVisibility) {
                          updatePrivacy.mutate({ postVisibility: e.value });
                        }
                      }}
                      optionLabel="label"
                      disabled={updatePrivacy.isPending}
                    />
                  </div>
                )}
              </TabPanel>

              <TabPanel header="Security">
                <form id="security" onSubmit={resetPassword} className="profile-security-form">
                  <span className="profile-panel-icon"><i className="pi pi-shield" /></span>
                  <h3 className="text-lg font-bold text-[#050505]">Reset password</h3>
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
            </section>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
