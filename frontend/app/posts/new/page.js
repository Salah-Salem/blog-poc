'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import AppShell from '@/components/layout/AppShell';
import AuthGuard from '@/components/auth/AuthGuard';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { useCreatePostMutation } from '@/hooks/mutations/usePostMutations';

export default function NewPostPage() {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();
  const createPost = useCreatePostMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');

  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    createPost.mutate(
      { title: title.trim(), content: content.trim(), visibility },
      { onSuccess: () => router.push('/') }
    );
  };

  if (loading || !isLoggedIn || !user) {
    return <AuthGuard><AppShell><div className="py-20" /></AppShell></AuthGuard>;
  }

  return (
    <AuthGuard>
      <AppShell>
        <form onSubmit={onSubmit} className="fb-card p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#dddfe2] pb-4">
            <UserAvatar name={user.name} image={user.profileImage} />
            <div>
              <h1 className="text-xl font-bold">Create post</h1>
              <p className="text-sm text-[#65676b]">Sharing as {user.name}</p>
            </div>
          </div>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full" required />
          <InputTextarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="What's on your mind?" className="w-full" required />
          <div>
            <label className="text-sm font-semibold text-[#65676b] block mb-2">Who can see this?</label>
            <SelectButton
              value={visibility}
              options={visibilityOptions}
              onChange={(e) => e.value && setVisibility(e.value)}
              optionLabel="label"
            />
          </div>
          <Button type="submit" label="Publish" loading={createPost.isPending} className="!bg-[#1877f2] !border-[#1877f2]" />
        </form>
      </AppShell>
    </AuthGuard>
  );
}
