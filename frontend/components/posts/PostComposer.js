'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { useCreatePostMutation } from '@/hooks/mutations/usePostMutations';

export default function PostComposer() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const createPost = useCreatePostMutation();

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // if (!isLoggedIn) {
  //   return (
  //     <div className="fb-card p-4 text-center">
  //       <p className="text-[#65676b] mb-3">Log in to share what&apos;s on your mind.</p>
  //       <Button label="Log in" onClick={() => router.push('/login')} className="!bg-[#1877f2] !border-[#1877f2]" />
  //     </div>
  //   );
  // }

  const submit = () => {
    createPost.mutate(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setVisible(false);
        },
      }
    );
  };

  return (
    <>
      {isLoggedIn && <div className="fb-card p-4">
        <div className="flex gap-3 items-center">
          <UserAvatar name={user?.name} image={user?.profileImage} />
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="flex-1 text-left bg-[#f0f2f5] hover:bg-[#e4e6eb] rounded-full px-4 py-3 text-[#65676b] font-medium transition-colors"
          >
            What&apos;s on your mind, {user?.name?.split(' ')[0]}?
          </button>
        </div>
        <div className="border-t border-[#dddfe2] mt-3 pt-2 flex justify-around">
          <Button label="Photo" icon="pi pi-image" text className="!text-[#65676b]" disabled />
          <Button label="Article" icon="pi pi-file-edit" text className="!text-[#65676b]" onClick={() => setVisible(true)} />
        </div>
      </div>}

      <Dialog
        header="Create post"
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-full max-w-lg"
        modal
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={user?.name} image={user?.profileImage} />
            <span className="font-semibold">{user?.name}</span>
          </div>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full" />
          <InputTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Share an update..."
            className="w-full"
          />
          <p className="text-sm text-[#65676b]">
            Posts follow your profile post privacy setting.
          </p>
          <Button
            label="Post"
            loading={createPost.isPending}
            onClick={submit}
            className="w-full !bg-[#1877f2] !border-[#1877f2]"
          />
        </div>
      </Dialog>
    </>
  );
}
