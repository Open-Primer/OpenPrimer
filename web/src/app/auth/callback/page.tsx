"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { OpenPrimerIcon } from "@/components/OpenPrimerIcon";
import { useLanguage } from "@/context/LanguageContext";
import { STATIC_UI_STRINGS } from "@/lib/translations";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  const t = STATIC_UI_STRINGS[language as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        
        // Retrieve current authentication session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!session || !session.user) {
          throw new Error("No active authentication session found.");
        }

        const user = session.user;
        const email = user.email || "";
        const fullName = user.user_metadata?.name || user.user_metadata?.full_name || "Google Scholar";

        // Query the Supabase profiles database to see if this user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        let activeProfile = profile;

        if (profileError || !profile) {
          // Profile does not exist yet (first-time Google OAuth Sign Up)
          // Insert a pristine profile record into the public profiles table
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              name: fullName,
              email: email,
              role: "student",
              level: 1,
              kp: 0,
              is_email_verified: true,
              favorites: [],
              tutor_choice: "socratic"
            })
            .select()
            .single();

          if (insertError) {
            console.error("Failed to seed OAuth user profile, trying manual fallback...", insertError);
            // Fallback: manually construct profile to allow entrance
            activeProfile = {
              id: user.id,
              name: fullName,
              email: email,
              role: "student",
              level: 1,
              kp: 0,
              isEmailVerified: true
            };
          } else {
            activeProfile = newProfile;
          }
        }

        // Save session locally to hydrate user experience instantly
        if (activeProfile && activeProfile.name) {
          const parts = activeProfile.name.split(' ');
          activeProfile.firstName = parts[0] || "";
          activeProfile.lastName = parts.slice(1).join(' ') || "";
        }
        localStorage.setItem("op_user_profile", JSON.stringify(activeProfile));
        localStorage.setItem("op_session", "true");
 
        // Clear any old local storage state and redirect to target path or catalog
        localStorage.removeItem("op_curriculum_enrolled");
        
        let targetPath = "/catalog";
        if (typeof window !== "undefined") {
          const sessionRedirect = sessionStorage.getItem("op_auth_redirect");
          if (sessionRedirect) {
            targetPath = sessionRedirect;
            sessionStorage.removeItem("op_auth_redirect");
            localStorage.removeItem("op_show_welcome_catalog_popup");
          }
        }
        router.push(targetPath);
      } catch (err: any) {
        console.error("OAuth Authentication callback error:", err);
        setStatus("error");
        setErrorMsg(err?.message || "Failed to authenticate with Google.");
        setTimeout(() => router.push("/login"), 5000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-[40px] p-10 backdrop-blur-3xl shadow-2xl text-center relative z-10"
      >
        <OpenPrimerIcon className="w-14 h-14 mx-auto mb-6" />

        {status === "processing" ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-xl shadow-blue-600/5">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2 text-white">
              {t.auth_authenticating || "AUTHENTICATING..."}
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black leading-relaxed">
              {t.auth_securing || "Securing Google credentials with Supabase network"}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-6 border border-red-500/20 shadow-xl shadow-red-600/5">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2 text-white">
              {t.auth_failure || "AUTH FAILURE"}
            </h1>
            <p className="text-red-400/80 text-[10px] uppercase tracking-widest font-black leading-relaxed mb-4">
              {errorMsg}
            </p>
            <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">
              {t.auth_redirecting || "Redirecting you to login page..."}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
