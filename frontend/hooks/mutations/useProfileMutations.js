'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { mutationErrorDetail } from '@/lib/notify';
import { useApiToken } from '@/hooks/useApiToken';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function useUpdateProfileMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: (body) => api('/users/profile', { method: 'PUT', token, body }),
    onSuccess: (res) => {
      const profile = res.data;
      updateUser(profile);
      queryClient.setQueryData(queryKeys.auth.profile, profile);
      toast.success('Profile updated', 'Your profile changes were saved.');
    },
    onError: (err) => {
      toast.error('Failed to update profile', mutationErrorDetail(err));
    },
  });
}

export function useChangePasswordMutation() {
  const token = useApiToken();
  const toast = useToast();

  return useMutation({
    mutationFn: (body) => api('/users/password', { method: 'PUT', token, body }),
    onSuccess: () => {
      toast.success('Password updated', 'Your password was changed successfully.');
    },
    onError: (err) => {
      toast.error('Failed to update password', mutationErrorDetail(err));
    },
  });
}

export function useUpdatePrivacyMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (body) => api('/users/privacy', { method: 'PUT', token, body }),
    onSuccess: (res) => {
      const privacy = res.data;
      queryClient.setQueryData(queryKeys.auth.privacy, privacy);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Privacy updated', 'Your post privacy setting was saved.');
    },
    onError: (err) => {
      toast.error('Failed to update privacy', mutationErrorDetail(err));
    },
  });
}

export function useUploadAvatarMutation() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: (formData) => apiUpload('/users/profile/avatar', { token, formData }),
    onSuccess: (res) => {
      const profile = res.data;
      updateUser(profile);
      queryClient.setQueryData(queryKeys.auth.profile, profile);
      toast.success('Photo updated', 'Your profile picture was uploaded.');
    },
    onError: (err) => {
      toast.error('Failed to upload photo', mutationErrorDetail(err));
    },
  });
}
