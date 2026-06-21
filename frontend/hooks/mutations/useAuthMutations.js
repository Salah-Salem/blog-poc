'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { mutationErrorDetail } from '@/lib/notify';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function useLoginMutation() {
  const { login } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: () => {
      toast.success('Welcome back', 'You are now logged in.');
    },
    onError: (err) => {
      toast.error('Login failed', mutationErrorDetail(err));
    },
  });
}

export function useRegisterMutation() {
  const { register } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload) => register(payload),
    onSuccess: () => {
      toast.success('Account created', 'Welcome! You are now logged in.');
    },
    onError: (err) => {
      toast.error('Registration failed', mutationErrorDetail(err));
    },
  });
}

export function useForgotPasswordMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: (email) =>
      api('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      }),
    onSuccess: (res) => {
      console.log('res onSuccess backend ========> ', res);
      toast.success('Reset link ready', 'Check the page for your password reset link.');
    },
    onError: (err) => {
      toast.error('Reset request failed', mutationErrorDetail(err));
    },
  });
}

export function useResetPasswordMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: ({ token, password }) =>
      api('/auth/reset-password', {
        method: 'POST',
        body: { token, password },
      }),
    onSuccess: () => {
      toast.success('Password updated', 'You can now log in with your new password.');
    },
    onError: (err) => {
      toast.error('Password reset failed', mutationErrorDetail(err));
    },
  });
}
