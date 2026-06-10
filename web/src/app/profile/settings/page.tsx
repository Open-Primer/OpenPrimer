"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile/curriculum?settings=true');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-xs font-black uppercase tracking-widest animate-pulse">Redirection...</span>
    </div>
  );
}
