'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BuiltInProviderType } from 'next-auth/providers/index';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must not exceed 20 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[@$!%*?&#]/,
      'Password must contain at least one special character'
    ),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const { addToast } = useToast();

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const provs = await getProviders();
      setProviders(provs);
    };

    fetchProviders();
  }, []);

  async function onSubmit(data: FormData) {
    setInvalidCredentials(false);
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setInvalidCredentials(true);
      return;
    }

    addToast('Successfully signed in');
    router.push('/home');
  }

  return (
    <>
      <form
        id="credentials"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <div className="flex flex-col items-center space-y-4 mb-2 ">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="mail@site.com"
              required
              {...register('email')}
              onChange={() => {
                setInvalidCredentials(false);
              }}
            />
          </label>
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              placeholder="Password"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              {...register('password')}
              onChange={() => {
                setInvalidCredentials(false);
              }}
            />
          </label>
          <div
            id="errors"
            className="flex flex-col space-y-2 text-sm text-accent"
          >
            {Object.keys(errors).map((item) => {
              const errorMessage = errors[item as keyof typeof errors]?.message;

              return <p key={item}>{errorMessage}</p>;
            })}
            {invalidCredentials && <p>Invalid credentials</p>}
          </div>
        </div>
        <button className="btn btn-primary btn-soft w-full mb-2">
          Sign In
        </button>
      </form>

      <p className="text-center text-base-content pb-4">or</p>

      {providers &&
        Object.values(providers).map((provider) => {
          if (provider.name.toLowerCase() === 'credentials') return;
          return (
            <div key={provider.id} className="mb-4">
              <button
                onClick={() => signIn(provider.id)}
                className="btn w-full btn-soft btn-primary"
              >
                Continue With {provider.name}
              </button>
            </div>
          );
        })}

      <p className="mt-6 text-center text-sm text-base-content">
        Don&apos;t have an account?{' '}
        <Link href="/auth/sign-up" className="link">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default SignIn;
