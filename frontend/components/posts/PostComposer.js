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
      {isLoggedIn && <div className="fb-card fb-card-hover p-3">
        <div className="flex gap-3 items-center">
          <UserAvatar name={user?.name} image={user?.profileImage} />
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="flex-1 rounded-full bg-[#f0f2f5] px-4 py-2.5 text-left text-[15px] font-medium text-[#65676b] transition-colors hover:bg-[#e4e6eb]"
          >
            What&apos;s on your mind, {user?.name?.split(' ')[0]}?
          </button>
        </div>
        <div className="mt-3 flex justify-around border-t border-[#e4e6eb] pt-2">
          <Button label="Live" icon="pi pi-video" text className="flex-1 !text-[#65676b] hover:!bg-[#f2f3f5]" disabled />
          <Button label="Photo" icon="pi pi-image" text className="flex-1 !text-[#65676b] hover:!bg-[#f2f3f5]" disabled />
          <Button label="Article" icon="pi pi-file-edit" text className="flex-1 !text-[#65676b] hover:!bg-[#f2f3f5]" onClick={() => setVisible(true)} />
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
          <div className="flex items-center gap-3 border-b border-[#e4e6eb] pb-3">
            <UserAvatar name={user?.name} image={user?.profileImage} />
            <div>
              <span className="font-semibold text-[#050505]">{user?.name}</span>
              <p className="text-xs text-[#65676b]">Posts follow your profile privacy setting.</p>
            </div>
          </div>
          <InputText value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full !border-0 !px-0 !text-lg !font-semibold focus:!shadow-none" />
          <InputTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'there'}?`}
            className="w-full !resize-none !border-0 !px-0 !text-lg focus:!shadow-none"
          />
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
