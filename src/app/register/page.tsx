'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  setCurrentUser,
  createNewAdmin,
  setPendingVerification,
  generateVerificationOtp,
  ADMIN_PASSCODE
} from '@/lib/storage';
import { UserProfile } from '@/types';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [academicRole, setAcademicRole] = useState<'student' | 'researcher' | 'faculty'>('researcher');
  const [password, setPassword] = useState('');
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isAdminSignup) {
      if (adminKey.trim() !== ADMIN_PASSCODE && adminKey.trim() !== 'aratha-admin-2026') {
        setErrorMessage('Invalid administrator clearance key. Please check with platform leadership.');
        return;
      }

      const pendingAdmin: UserProfile = {
        id: `usr-admin-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        institution: institution.trim() || 'Edu.aratha Academic Repository Board',
        role: 'admin',
        bio: 'Platform administrator registered with security key clearance.',
        joinedAt: new Date().toISOString().split('T')[0],
        emailVerified: false
      };

      const otp = generateVerificationOtp();
      setPendingVerification(pendingAdmin, otp);
      router.push(`/verify-email?email=${encodeURIComponent(pendingAdmin.email)}`);
      return;
    }

    const pendingUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Independent Scholar',
      email: email.trim(),
      institution: institution.trim() || 'Independent Researcher',
      role: academicRole === 'student' ? 'user' : 'researcher',
      joinedAt: new Date().toISOString().split('T')[0],
      emailVerified: false
    };

    // User verification needed before giving access of platform
    const otp = generateVerificationOtp();
    setPendingVerification(pendingUser, otp);
    router.push(`/verify-email?email=${encodeURIComponent(pendingUser.email)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Free Account</h1>
          <p className="text-xs text-slate-500">Join researchers and students discovering open knowledge.</p>
        </div>

        {/* Primary Google Sign-Up Option */}
        <div className="space-y-4">
          <GoogleSignInButton
            label="Sign Up with Google"
            redirectTo="/dashboard"
            isSignUp={true}
          />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
              Or Register with Email
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Ramesh Kumar"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">University / Organization</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. IIT Bombay / University of Delhi"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Academic Role</label>
            <select
              value={academicRole}
              onChange={(e) => setAcademicRole(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
            >
              <option value="researcher">PhD Scholar / Researcher</option>
              <option value="student">Undergraduate / Graduate Student</option>
              <option value="faculty">Professor / Academic Faculty</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>

          {/* Optional Admin Registration Clearance */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={isAdminSignup}
                onChange={(e) => setIsAdminSignup(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span className="font-semibold text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Register as Platform Administrator
              </span>
            </label>

            {isAdminSignup && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2 animate-in fade-in duration-150">
                <label className="text-[11px] font-bold text-amber-900 block">
                  Administrator Security Clearance Key *
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter administrator security passkey..."
                  required={isAdminSignup}
                  className="w-full py-2 px-3 rounded-lg border border-amber-300 bg-white text-slate-900 text-xs focus:outline-amber-600"
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isAdminSignup ? 'Create Administrator Account' : 'Create Free Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
