'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import FormField from '@/components/profile/FormField';
import { useRegisterMutation } from '@/hooks/mutations/useAuthMutations';
import { parseDateOfBirth } from '@/lib/profileUtils';

export default function RegisterPage() {
  const register = useRegisterMutation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    register.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        dateOfBirth: parseDateOfBirth(dateOfBirth) || undefined,
      },
      { onSuccess: () => router.push('/login') }
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-page-grid">
        <div className="auth-page-brand">
          <div className="auth-brand-badge">BlogBook</div>
          <h1>Join the community</h1>
          <p>
            Create your account, personalize your profile, and start sharing stories
            with readers around the world.
          </p>
          <ul className="auth-brand-features">
            <li><i className="pi pi-check-circle" /> Personalized profile with photo</li>
            <li><i className="pi pi-check-circle" /> Public or private posts</li>
            <li><i className="pi pi-check-circle" /> Comment and connect with authors</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="auth-form-card register-form-card">
          <div className="auth-form-header">
            <h2>Create account</h2>
            <p>It&apos;s quick and easy. Fields marked optional can be added later.</p>
          </div>

          <section className="register-section">
            <h3><span className="register-step">1</span> Account</h3>
            <div className="register-grid">
              <FormField label="Full name" icon="pi-user">
                <InputText value={name} onChange={(e) => setName(e.target.value)} className="w-full" placeholder="John Doe" required />
              </FormField>
              <FormField label="Email" icon="pi-envelope">
                <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" placeholder="you@example.com" required />
              </FormField>
            </div>
            <FormField label="Password" icon="pi-lock" hint="Minimum 6 characters">
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full"
                inputClassName="w-full"
                toggleMask
                required
              />
            </FormField>
          </section>

          <Divider />

          <section className="register-section">
            <h3><span className="register-step">2</span> Profile details <span className="text-[#65676b] font-normal text-sm">(optional)</span></h3>
            <div className="register-grid">
              <FormField label="Phone" icon="pi-phone">
                <InputText value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full" placeholder="+1 555 000 0000" />
              </FormField>
              <FormField label="Date of birth" icon="pi-calendar">
                <Calendar
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  maxDate={new Date()}
                  className="w-full"
                  inputClassName="w-full"
                  placeholder="Select date"
                />
              </FormField>
            </div>
            <FormField label="Address" icon="pi-map-marker">
              <InputTextarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full"
                placeholder="City, country"
              />
            </FormField>
          </section>

          <Button
            type="submit"
            label="Sign up"
            icon="pi pi-user-plus"
            loading={register.isPending}
            className="w-full !bg-[#42b72a] !border-[#42b72a] !font-bold !py-3"
          />

          <p className="auth-form-footer">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1877f2] font-semibold hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
