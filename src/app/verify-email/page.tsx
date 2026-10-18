'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import {
  getPendingVerification,
  verifyUserEmailCode,
  setPendingVerification,
  generateVerificationOtp,
  getCurrentUser,
  setCurrentUser
} from '@/lib/storage';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const pending = getPendingVerification();
    const queryEmail = searchParams.get('email');
    const queryCode = searchParams.get('code');

    if (pending) {
      setEmail(pending.user.email);
      setSimulatedCode(pending.code);
    } else if (queryEmail) {
      setEmail(queryEmail);
    } else {
      const user = getCurrentUser();
      if (user && !user.emailVerified) {
        setEmail(user.email);
      }
    }

    if (queryCode) {
      setCode(queryCode);
    }
  }, [searchParams]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsVerifying(true);

    try {
      const cleanCode = code.trim();
      if (cleanCode.length < 6) {
        setErrorMessage('Please enter the complete 6-digit verification code.');
        setIsVerifying(false);
        return;
      }

      const result = verifyUserEmailCode(cleanCode);

      if (result.success && result.user) {
        setSuccessMessage('Email verified successfully! Preparing your academic workspace...');
        setTimeout(() => {
          if (result.user?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 1200);
      } else {
        setErrorMessage(result.message || 'Invalid verification code.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    const pending = getPendingVerification();
    const newOtp = generateVerificationOtp();

    if (pending) {
      setPendingVerification(pending.user, newOtp);
      setSimulatedCode(newOtp);
    }

    setResendCooldown(45);
    setCanResend(false);
    setErrorMessage('');
    setSuccessMessage('A fresh verification code has been dispatched to your email.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6 text-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Identity Verification</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verify Your Email Address
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed">
            To ensure open-access platform integrity, please enter the 6-digit confirmation code sent to:
          </p>

          <div className="font-mono text-xs font-bold text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg inline-block border border-slate-200">
            {email || 'your-academic-email@university.edu'}
          </div>
        </div>

        {/* Live Email Simulation Notice (Ensures Zero Blockers for User Testing) */}
        {simulatedCode && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-blue-900 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Verification Dispatch Simulation</span>
              </span>
              <span className="text-[10px] text-blue-600 font-mono bg-white px-2 py-0.5 rounded-full border border-blue-200">
                Live OTP
              </span>
            </div>
            <p className="text-[11px] text-blue-700">
              Your generated activation code is <strong className="font-mono text-blue-950 font-bold text-xs">{simulatedCode}</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setCode(simulatedCode);
                setErrorMessage('');
              }}
              className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors shadow-2xs"
            >
              Auto-Fill Code ({simulatedCode})
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2 text-center">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full text-center text-xl font-mono tracking-widest py-3 pl-10 pr-3 rounded-xl border border-slate-300 focus:outline-blue-600 focus:border-blue-600 font-bold text-slate-900 bg-white"
                autoFocus
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || code.trim().length !== 6}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Identity...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Email & Activate Workspace</span>
              </>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
          <div>
            Didn&apos;t receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 font-bold hover:underline"
              >
                Resend Code
              </button>
            ) : (
              <span className="text-slate-400 font-medium">
                Resend in {resendCooldown}s
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <Link href="/register" className="hover:text-slate-700 transition-colors">
              ← Change Email
            </Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
