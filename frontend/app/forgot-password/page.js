'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForgotPasswordMutation } from '@/hooks/mutations/useAuthMutations';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setResetLink('');
    forgotPassword.mutate(email.trim(), {
      onSuccess: (res) => {
        console.log('res onSubmit frontend ========> ', res);
        setResetLink(res.resetLink || '');
      },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-page-grid">
        <div className="auth-page-brand">
          <div className="auth-brand-badge">BlogBook</div>
          <h1>Reset your password</h1>
          <p>
            Enter your account email and we&apos;ll generate a secure link to set a new
            password.
          </p>
          <ul className="auth-brand-features">
            <li><i className="pi pi-check-circle" /> One-time reset link</li>
            <li><i className="pi pi-check-circle" /> Link expires after one hour</li>
            <li><i className="pi pi-check-circle" /> Keep your account protected</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="auth-form-card">
          <div className="auth-form-header">
            <h2>Forgot password</h2>
            <p>We&apos;ll help you get back into your account.</p>
          </div>

          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full"
            required
          />

          <Button
            type="submit"
            label="Send reset link"
            icon="pi pi-send"
            loading={forgotPassword.isPending}
            className="w-full !bg-[#1877f2] !border-[#1877f2] !font-bold !py-3"
          />

          {forgotPassword.isSuccess && (
            <div className="rounded-lg border border-[#c7e8ca] bg-[#f0fff4] p-3 text-sm text-[#1f6f2a]">
              {resetLink ? (
                <>
                  Reset link generated:{' '}
                  <Link href={resetLink} className="font-semibold text-[#1877f2] hover:underline">
                    Open reset page
                  </Link>
                </>
              ) : (
                'No reset link generated.'
              )}
            </div>
          )}

          <p className="auth-form-footer">
            Remember your password?{' '}
            <Link href="/login" className="text-[#1877f2] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
