'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useLoginMutation } from '@/hooks/mutations/useAuthMutations';

export default function LoginPage() {
  const login = useLoginMutation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => router.push('/') }
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-page-grid">
        <div className="auth-page-brand">
          <div className="auth-brand-badge">BlogBook</div>
          <h1>Welcome back</h1>
          <p>
            Connect with readers and authors. Discover stories on your social blog feed.
          </p>
          <ul className="auth-brand-features">
            <li><i className="pi pi-check-circle" /> Personalized news feed</li>
            <li><i className="pi pi-check-circle" /> Manage your profile & posts</li>
            <li><i className="pi pi-check-circle" /> Join conversations</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="auth-form-card">
          <div className="auth-form-header">
            <h2>Log in</h2>
            <p>Enter your credentials to continue.</p>
          </div>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full"
            required
          />
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="!block w-full"
            inputClassName="w-full"
            feedback={false}
            toggleMask
            required
          />
          <Button
            type="submit"
            label="Log in"
            loading={login.isPending}
            className="w-full !bg-[#1877f2] !border-[#1877f2] !font-bold !py-3"
          />
          <p className="auth-form-footer">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#1877f2] font-semibold hover:underline">
              Create new account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
