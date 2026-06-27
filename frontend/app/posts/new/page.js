'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
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

  const onSubmit = (e) => {
    e.preventDefault();
    createPost.mutate(
      { title: title.trim(), content: content.trim() },
      { onSuccess: () => router.push('/') }
    );
  };

  if (loading || !isLoggedIn || !user) {
    return <AuthGuard><AppShell><div className="py-20" /></AppShell></AuthGuard>;
  }

  return (
    <AuthGuard>
      <AppShell>
        <form onSubmit={onSubmit} className="fb-card fb-card-hover space-y-4 p-4">
          <div className="flex items-center gap-3 border-b border-[#e4e6eb] pb-4">
            <UserAvatar name={user.name} image={user.profileImage} />
            <div>
              <h1 className="text-xl font-bold text-[#050505]">Create post</h1>
              <p className="text-sm text-[#65676b]">Sharing as {user.name}</p>
            </div>
          </div>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full !text-lg !font-semibold" required />
          <InputTextarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="What's on your mind?" className="w-full !resize-none" required />
          <p className="text-sm text-[#65676b]">
            Posts follow your profile post privacy setting.
          </p>
          <Button type="submit" label="Publish" loading={createPost.isPending} className="w-full !border-[#1877f2] !bg-[#1877f2]" />
        </form>
      </AppShell>
    </AuthGuard>
  );
}
