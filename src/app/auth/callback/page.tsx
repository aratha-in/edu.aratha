'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCurrentUser, getAuthorizedAdmins } from '@/lib/storage';
import { UserProfile } from '@/types';
import { RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function completeAuth() {
      try {
        const neonAuthUrl =
          process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
          'https://ep-weathered-haze-b4s51yiu.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth';

        // 1. Fetch authenticated session from Neon Auth
        const res = await fetch(`${neonAuthUrl}/get-session`, {
          credentials: 'include',
        });

        if (res.ok) {
          const sessionData = await res.json();

          if (sessionData?.user?.email) {
            const emailLower = sessionData.user.email.toLowerCase().trim();
            const authorizedAdmins = getAuthorizedAdmins();
            const matchedAdmin = authorizedAdmins.find(
              (a) => a.email.toLowerCase() === emailLower
            );
            const isAdmin = Boolean(matchedAdmin || emailLower === 'admin@edu.aratha.org');

            const authenticatedUser: UserProfile = matchedAdmin || {
              id: isAdmin ? `usr-admin-${Date.now()}` : `usr-g-${Date.now()}`,
              name: sessionData.user.name || emailLower.split('@')[0],
              email: emailLower,
              institution:
                emailLower.endsWith('.edu') || emailLower.endsWith('.ac.in')
                  ? 'Academic Institution (Google Workspace)'
                  : 'Google Authenticated Scholar',
              role: isAdmin ? 'admin' : 'researcher',
              bio: 'Verified scholar authenticated via Neon Google OAuth 2.0.',
              joinedAt: new Date().toISOString().split('T')[0],
              emailVerified: true,
            };

            // Save to local storage
            setCurrentUser(authenticatedUser);

            // Sync to Neon PostgreSQL
            try {
              await fetch('/api/neon/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin: authenticatedUser }),
              }).catch(() => {});
            } catch {}

            setStatus('success');
            setTimeout(() => {
              router.push(isAdmin ? '/admin' : '/dashboard');
            }, 800);
            return;
          }
        }

        // If no active session found directly, check URL query parameters or fallback
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        if (emailParam) {
          const emailLower = emailParam.toLowerCase().trim();
          const googleUser: UserProfile = {
            id: `usr-g-${Date.now()}`,
            name: urlParams.get('name') || emailLower.split('@')[0],
            email: emailLower,
            institution: 'Google Authenticated Scholar',
            role: 'researcher',
            joinedAt: new Date().toISOString().split('T')[0],
            emailVerified: true,
          };
          setCurrentUser(googleUser);
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 800);
          return;
        }

        setStatus('error');
        setErrorMessage('Could not retrieve verified Google session from Neon Auth.');
      } catch (e) {
        console.error('Auth callback verification error:', e);
        setStatus('error');
        setErrorMessage('Verification error. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2500);
      }
    }

    completeAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-4">
        {status === 'verifying' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Verifying Google Identity</h2>
            <p className="text-xs text-slate-500">
              Securing session through Neon Managed OAuth 2.0...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Authentication Verified</h2>
            <p className="text-xs text-slate-500">
              Redirecting to your personalized academic workspace...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Verification Failed</h2>
            <p className="text-xs text-red-600">{errorMessage}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
