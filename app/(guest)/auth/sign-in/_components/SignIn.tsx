"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character",
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
  const searchParams = useSearchParams();
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      setOauthError("Please sign in with the original provider.");
    }
  }, [searchParams]);

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const [providersLoading, setProvidersLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const provs = await getProviders();
      setProviders(provs);
      setProvidersLoading(false);
    };

    fetchProviders();
  }, []);

  async function onSubmit(data: FormData) {
    setInvalidCredentials(false);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setInvalidCredentials(true);
      return;
    }

    addToast("Successfully signed in");
    router.push("/home");
  }

  return (
    <div className="md:px-4">
      <form
        id="credentials"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <div className="w-full max-w-md mx-auto space-y-6">
          <label className="input validator w-full">
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
              placeholder="Email address"
              required
              {...register("email")}
              className="w-full"
              onChange={() => {
                setInvalidCredentials(false);
              }}
            />
          </label>

          <label className="input validator w-full">
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
              type="password"
              placeholder="Password"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              {...register("password")}
              className="w-full"
              onChange={() => {
                setInvalidCredentials(false);
              }}
            />
          </label>

          <div
            id="errors"
            className="flex flex-col space-y-1 text-sm text-error mb-2"
          >
            {oauthError && <p className="animate-fade-in">{oauthError}</p>}
            {Object.keys(errors).map((item) => {
              const errorMessage = errors[item as keyof typeof errors]?.message;
              return errorMessage ? (
                <p key={item} className="animate-fade-in">
                  {errorMessage}
                </p>
              ) : null;
            })}
            {invalidCredentials && (
              <p className="animate-fade-in">Invalid credentials</p>
            )}
          </div>
        </div>
        <button className="btn btn-primary btn-soft w-full mb-2">
          Sign In
        </button>
      </form>

      <div className="w-full max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-base-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-base-100 text-base-content/60">
              or continue with
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {providersLoading ? (
            <div className="space-y-3">
              <div className="skeleton h-12 w-full rounded-lg"></div>
            </div>
          ) : (
            providers &&
            Object.values(providers).map((provider) => {
              if (provider.name.toLowerCase() === "credentials") return;
              return (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="btn w-full btn-soft btn-outline hover:btn-primary transition-all duration-200"
                >
                  Continue With {provider.name}
                </button>
              );
            })
          )}
        </div>

        <p className="mt-8 text-center text-sm text-base-content/60">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="link link-primary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
