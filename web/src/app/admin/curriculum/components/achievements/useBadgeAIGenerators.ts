import { useEffect } from 'react';

interface UseBadgeAIGeneratorsProps {
  showAddAchievement: boolean;
  newAch: { name: string; description: string };
  setGeneratedBadges: (v: string[]) => void;
  setIsGeneratingBadges: (v: boolean) => void;
  selectedAchievement: any;
  editName: string;
  editDesc: string;
  setEditGeneratedBadges: (v: string[]) => void;
  setIsEditGeneratingBadges: (v: boolean) => void;
}

export function useBadgeAIGenerators({
  showAddAchievement,
  newAch,
  setGeneratedBadges,
  setIsGeneratingBadges,
  selectedAchievement,
  editName,
  editDesc,
  setEditGeneratedBadges,
  setIsEditGeneratingBadges
}: UseBadgeAIGeneratorsProps) {
  // Creation debounced AI badge generation
  useEffect(() => {
    if (!showAddAchievement) {
      setGeneratedBadges([]);
      return;
    }
    if (!newAch.name || !newAch.description) {
      setGeneratedBadges([]);
      return;
    }

    if (typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox_mode') === 'true') {
      const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      setGeneratedBadges([opt1, opt2, opt3]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeneratingBadges(true);
      try {
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.error("Failed to retrieve Supabase session token for AI badge generation:", err);
        }

        const res = await fetch('/api/admin/achievements/generate-badges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name: newAch.name, description: newAch.description })
        });
        const data = await res.json();
        if (data.success && data.badges && data.badges.length > 0) {
          setGeneratedBadges(data.badges);
        }
      } catch (err) {
        console.error("Error generating badges:", err);
      } finally {
        setIsGeneratingBadges(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [newAch.name, newAch.description, showAddAchievement]);

  // Edition debounced AI badge generation
  useEffect(() => {
    if (!selectedAchievement) {
      setEditGeneratedBadges([]);
      return;
    }
    if (!editName || !editDesc) {
      setEditGeneratedBadges([]);
      return;
    }

    if (typeof window !== 'undefined' && window.localStorage.getItem('op_allow_sandbox_mode') === 'true') {
      const opt1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      const opt2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      const opt3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjU5ZTBiIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAxNWwtMiA1TDEyIDE4bDIgMnoiLz48L3N2Zz4=';
      setEditGeneratedBadges([opt1, opt2, opt3]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsEditGeneratingBadges(true);
      try {
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.error("Failed to retrieve Supabase session token for AI badge generation:", err);
        }

        const res = await fetch('/api/admin/achievements/generate-badges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name: editName, description: editDesc })
        });
        const data = await res.json();
        if (data.success && data.badges && data.badges.length > 0) {
          setEditGeneratedBadges(data.badges);
        }
      } catch (err) {
        console.error("Error generating edit badges:", err);
      } finally {
        setIsEditGeneratingBadges(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [editName, editDesc, selectedAchievement]);
}
