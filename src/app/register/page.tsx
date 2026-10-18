'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { setCurrentUser } from '@/lib/storage';
import { UserProfile } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState<'user' | 'researcher' | 'admin'>('researcher');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Independent Scholar',
      email: email.trim(),
      institution: institution.trim() || 'Independent Researcher',
      role,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    router.push('/dashboard');
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
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
            >
              <option value="researcher">PhD Scholar / Researcher</option>
              <option value="user">Undergraduate / Graduate Student</option>
              <option value="admin">Professor / Academic Faculty</option>
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

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Create Free Workspace</span>
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
