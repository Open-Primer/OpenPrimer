'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

function OpenPrimerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="url(#grad)" />
      <path d="M14 16h20M14 24h14M14 32h9" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: 'At least 12 characters', ok: password.length >= 12 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special character', ok: /[@$!%*?&#^+=._\-\[\]{}()]/.test(password) },
  ];
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1 pl-1">
      {checks.map((c) => (
        <li key={c.label} className={`flex items-center gap-2 text-[10px] font-semibold transition-colors ${c.ok ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.ok ? 'bg-emerald-400' : 'bg-slate-700'}`} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    const e = searchParams.get('email');
    if (!t || !e) {
      setIsInvalidLink(true);
    } else {
      setToken(t);
      setEmail(e);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('Password does not meet the requirements below.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your password has been successfully reset. You can now log in with your new password.');
      } else {
        setErrorMsg(data.error || 'Failed to reset password. This link may have expired.');
      }
    } catch (err) {
      setErrorMsg('Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, email, password, confirmPassword]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-[48px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <OpenPrimerIcon className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Reset Password</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">
              Create a new secure password
            </p>
          </div>

          {isInvalidLink ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                <p className="font-semibold">Invalid or missing reset link.</p>
                <p className="text-xs mt-1 text-red-400/70">Please request a new password reset from the login page.</p>
              </div>
              <button
                onClick={() => router.push('/?auth=login')}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          ) : successMsg ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Password reset successfully!</p>
                <p className="text-xs mt-2 text-emerald-400/80">{successMsg}</p>
              </div>
              <button
                onClick={() => router.push('/?auth=login')}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Log In Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* New password */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value.slice(0, 60)); setErrorMsg(''); }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    maxLength={60}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {isPasswordFocused && <PasswordRequirements password={password} />}
              </div>

              {/* Confirm password */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-3">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value.slice(0, 60)); setErrorMsg(''); }}
                    maxLength={60}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Resetting...</span>
                ) : (
                  <>Set New Password <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>

              <p className="text-center text-xs text-slate-600 mt-4">
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/?auth=login')}
                  className="text-blue-500 font-bold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
