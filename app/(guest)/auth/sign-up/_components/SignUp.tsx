'use client';

import { createUser } from '@/services/api/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
  firstName: z.string().min(3).max(10),
  lastName: z.string().min(3).max(10).optional(),
});

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const email = watch('email');
  const password = watch('password');

  const { addToast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: (data: FormData) =>
      createUser({
        email: data.email,
        name: data.firstName + (data.lastName ? ' ' : '') + data.lastName,
        password: data.password,
      }),
    onSuccess: () => {
      signIn('credentials', {
        email,
        password,
      });
    },
    onError: () => {
      addToast('Something wrong happened', 'error');
    },
  });

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
    createUserMutation.mutate(data);
  }

  return (
    <>
      <form
        id="credentials"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <div className="flex flex-col items-center space-y-4 mb-2 ">
          <div className="flex-col sm:flex-row space-y-2 sm:space-y-0 flex sm:space-x-2 sm:w-80 w-full items-center justify-center">
            <label className="input validator">
              <input
                placeholder="First Name"
                required
                {...register('firstName')}
              />
            </label>

            <label className="input validator">
              <input
                placeholder="Last Name (Optional)"
                required
                {...register('lastName')}
              />
            </label>
          </div>

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
          </div>
        </div>
        <button className="btn btn-primary btn-soft w-full mb-2">
          Sign Up
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
        already have an account?{' '}
        <Link href="/auth/sign-in" className="link">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
