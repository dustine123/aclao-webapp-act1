import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  KeyRound,
} from 'lucide-react';
import { User, UserRole } from '../types/index.ts';
import { validateAuthForm } from '../utils/vaultLogic.ts';
import { INITIAL_USERS } from '../utils/storage.ts';
import { auth, googleProvider, signInWithPopup } from '../utils/firebase.ts';

interface AuthScreenProps {
  onSignIn: (user: User) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn, onShowToast }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [companyName, setCompanyName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAuthForm(isSignUp, { name, email, password });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (isSignUp) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          companyName: companyName.trim() || (role === 'freelancer' ? 'Design Studio' : 'Client Organization'),
          createdAt: new Date().toISOString(),
        };
        onSignIn(newUser);
        onShowToast(`Welcome to EsmerengVault, ${newUser.name}!`, 'success');
      } else {
        // Sign In - match existing user or generate session
        const existing = INITIAL_USERS.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        const userToLogin: User = existing || {
          id: `user-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim().toLowerCase(),
          role: 'client',
          companyName: 'Client Workspace',
          createdAt: new Date().toISOString(),
        };

        onSignIn(userToLogin);
        onShowToast(`Welcome back, ${userToLogin.name}!`, 'success');
      }
    }, 400);
  };

  const handleQuickDemo = (demoUser: User) => {
    onSignIn(demoUser);
    onShowToast(`Signed in as ${demoUser.name} (${demoUser.companyName})`, 'success');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || '',
        role: 'client',
        companyName: 'Client Workspace',
        createdAt: new Date().toISOString(),
      };
      onSignIn(userObj);
      onShowToast(`Signed in with Google as ${userObj.name}`, 'success');
    } catch (error: any) {
      console.warn('Google sign in error', error);
      onShowToast(error?.message || 'Google sign-in popup cancelled or closed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 items-center justify-center text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-3">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">EsmerengVault</h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure client file portal for freelancers and designers
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8">
          {/* Mode Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrors({});
              }}
              className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors border-b-2 -mb-px ${
                !isSignUp
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrors({});
              }}
              className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors border-b-2 -mb-px ${
                isSignUp
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Create an Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={`block w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                          : 'border-slate-300 focus:ring-indigo-500 bg-white'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Role in the Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        role === 'client'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('freelancer')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        role === 'freelancer'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Designer / Freelancer</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-company" className="block text-xs font-medium text-slate-700 mb-1">
                    Company or Studio Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={role === 'freelancer' ? 'Rivera Design Studio' : 'Acme Corporation'}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`block w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create an Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-3.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2 text-[11px] text-slate-400">or authenticate via</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google (Firebase)</span>
            </button>
          </form>

          {/* Quick Demo Logins for effortless testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> One-Click Demo Logins
              </span>
              <span className="text-[10px] text-slate-400">Instant test accounts</span>
            </div>

            <div className="space-y-1.5">
              {INITIAL_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemo(user)}
                  className="w-full p-2 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left flex items-center justify-between transition-all group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.companyName} • {user.role === 'freelancer' ? 'Freelance Designer' : 'Client'}
                    </p>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Login →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Vault Encryption
          </span>
          <span>•</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};
