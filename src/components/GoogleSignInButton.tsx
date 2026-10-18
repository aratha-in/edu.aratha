'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface GoogleSignInButtonProps {
  label?: string;
  redirectTo?: string;
  className?: string;
  isSignUp?: boolean;
}

export default function GoogleSignInButton({
  label = 'Continue with Google',
  redirectTo = '/dashboard',
  className = '',
  isSignUp = false
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleTriggerGoogle = async () => {
    setIsLoading(true);

    try {
      const neonAuthUrl =
        process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
        'https://ep-weathered-haze-b4s51yiu.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth';

      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      const callbackURL = `${origin}/auth/callback`;

      // 1. Initiate Real Google OAuth 2.0 through Neon Managed Auth (Better Auth)
      const res = await fetch(`${neonAuthUrl}/sign-in/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: origin,
        },
        body: JSON.stringify({
          provider: 'google',
          callbackURL,
          newUserCallbackURL: callbackURL,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          // Direct native redirect to https://accounts.google.com/o/oauth2/v2/auth
          window.location.href = data.url;
          return;
        }
      }

      // If Neon Auth returned an error, log and check alternative
      console.warn('Neon Auth /sign-in/social did not return redirect URL:', await res.text().catch(() => ''));
    } catch (err) {
      console.error('Failed to initiate Google OAuth 2.0:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTriggerGoogle}
      disabled={isLoading}
      className={`w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-3 group disabled:opacity-60 cursor-pointer ${className}`}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span className="group-hover:text-slate-900">
        {isLoading ? 'Connecting to Google OAuth 2.0...' : label}
      </span>
    </button>
  );
}
