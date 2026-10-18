'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { setCurrentUser, isEmailAuthorizedAdmin, getAuthorizedAdmins, ADMIN_PASSCODE } from '@/lib/storage';
import { UserProfile } from '@/types';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authorizedAdmins = getAuthorizedAdmins();
    const matchedAdmin = authorizedAdmins.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    const hasAdminPass = password === ADMIN_PASSCODE || password === 'aratha-admin-2026';
    const isAdmin = Boolean(matchedAdmin || (email.toLowerCase().includes('admin') && hasAdminPass));

    const loggedInUser: UserProfile = matchedAdmin || {
      id: isAdmin ? `usr-admin-${Date.now()}` : `usr-${Date.now()}`,
      name: isAdmin ? 'Platform Administrator' : (email.split('@')[0] || 'Scholar'),
      email: email.trim() || (isAdmin ? 'admin@edu.aratha.org' : 'scholar@edu.aratha.org'),
      institution: isAdmin ? 'Edu.aratha Governance & Verification Board' : 'Academic Researcher',
      role: isAdmin ? 'admin' : 'researcher',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(loggedInUser);
    router.push(isAdmin ? '/admin' : '/dashboard');
  };

  const handleInstantDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr-demo-01',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@iitd.ac.in',
      institution: 'IIT Delhi / Independent Scholar',
      role: 'researcher',
      bio: 'Doctoral researcher in computational sustainability and open access scholarship.',
      joinedAt: '2026-08-15'
    };
    setCurrentUser(demoUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Edu.aratha</h1>
          <p className="text-xs text-slate-500">Access your saved courses, reading lists, and research notes.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.ac.in"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <a href="#" className="text-blue-600 hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 focus:outline-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">Or Continue With</span>
        </div>

        {/* Google Sign-In */}
        <GoogleSignInButton label="Sign In with Google" redirectTo="/dashboard" />

        {/* Demo Scholar Login */}
        <button
          onClick={handleInstantDemo}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4 text-blue-600" />
          Instant Demo Scholar Sign-In (Ananya Sharma • IIT Delhi)
        </button>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
}
