'use client';

import { useMutation } from '@tanstack/react-query';
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
