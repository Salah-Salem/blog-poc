'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useResetPasswordMutation } from '@/hooks/mutations/useAuthMutations';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPasswordMutation();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    resetPassword.mutate(
      { token, password },
      { onSuccess: () => router.push('/login') }
    );
  };

  return (
    <form onSubmit={onSubmit} className="auth-form-card">
      <div className="auth-form-header">
        <h2>Create new password</h2>
        <p>Use at least 6 characters for your new password.</p>
      </div>

      {!token && (
        <div className="rounded-lg border border-[#f5c2c7] bg-[#fff5f5] p-3 text-sm text-[#842029]">
          Reset token is missing. Please request a new password reset link.
        </div>
      )}

      <Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-full"
        inputClassName="w-full"
        feedback={false}
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

      {formError && (
        <div className="rounded-lg border border-[#f5c2c7] bg-[#fff5f5] p-3 text-sm text-[#842029]">
          {formError}
        </div>
      )}

      <Button
        type="submit"
        label="Reset password"
        icon="pi pi-lock"
        loading={resetPassword.isPending}
        disabled={!token}
        className="w-full !bg-[#1877f2] !border-[#1877f2] !font-bold !py-3"
      />

      <p className="auth-form-footer">
        Back to{' '}
        <Link href="/login" className="text-[#1877f2] font-semibold hover:underline">
          log in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-page-grid">
        <div className="auth-page-brand">
          <div className="auth-brand-badge">BlogBook</div>
          <h1>Choose a new password</h1>
          <p>
            Your reset link is valid for a limited time. After saving, use the new
            password to sign in.
          </p>
          <ul className="auth-brand-features">
            <li><i className="pi pi-check-circle" /> Secure token verification</li>
            <li><i className="pi pi-check-circle" /> Password is hashed before storage</li>
            <li><i className="pi pi-check-circle" /> Old reset links are invalidated</li>
          </ul>
        </div>

        <Suspense fallback={<div className="auth-form-card">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
