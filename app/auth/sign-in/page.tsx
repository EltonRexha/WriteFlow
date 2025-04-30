'use client';

import { BuiltInProviderType } from 'next-auth/providers/index';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SignInPage() {
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

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center sm:justify-stretch px-4 bg-base-200">
        <h1 className="mt-36 text-primary text-3xl font-bold hidden sm:block">
          Happy to see you back!! 🎉
        </h1>
        <div className="w-full max-w-md rounded-lg bg-base-100 p-8 shadow-md flex flex-col space-y-2 sm:mt-16">
          <h2 className="font-bold text-2xl text-center pb-4 text-base-content">
            Sign in to your account
          </h2>

          <div id="credentials">
            <div className="flex flex-col items-center space-y-4 mb-2">
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
                <input type="email" placeholder="mail@site.com" required />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
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
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />
                At least one number <br />
                At least one lowercase letter <br />
                At least one uppercase letter
              </p>
            </div>
            <button className="btn btn-primary btn-soft w-full mb-2">
              Sign in
            </button>
          </div>

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
                    Sign in with {provider.name}
                  </button>
                </div>
              );
            })}

          <p className="mt-6 text-center text-sm text-base-content">
            Don’t have an account?{' '}
            <Link href="/sign-up" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
