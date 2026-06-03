import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  lang: string;
  isFocused?: boolean;
}

export function PasswordRequirements({ password, lang, isFocused = true }: PasswordRequirementsProps) {
  // Hide if the input is not focused and password is empty
  if (!password && !isFocused) return null;

  const requirements = [
    {
      id: 'length',
      test: (pwd: string) => pwd.length >= 12,
      labels: {
        EN: 'At least 12 characters',
        FR: 'Au moins 12 caractères',
        ES: 'Al menos 12 caracteres',
        DE: 'Mindestens 12 Zeichen',
        ZH: '至少 12 个字符'
      }
    },
    {
      id: 'uppercase',
      test: (pwd: string) => /[A-Z]/.test(pwd),
      labels: {
        EN: 'At least 1 uppercase letter',
        FR: 'Au moins 1 lettre majuscule',
        ES: 'Al menos 1 letra mayúscula',
        DE: 'Mindestens 1 Großbuchstabe',
        ZH: '至少 1 个大写字母'
      }
    },
    {
      id: 'lowercase',
      test: (pwd: string) => /[a-z]/.test(pwd),
      labels: {
        EN: 'At least 1 lowercase letter',
        FR: 'Au moins 1 lettre minuscule',
        ES: 'Al menos 1 letra minúscula',
        DE: 'Mindestens 1 Kleinbuchstabe',
        ZH: '至少 1 个小写字母'
      }
    },
    {
      id: 'number',
      test: (pwd: string) => /\d/.test(pwd),
      labels: {
        EN: 'At least 1 number',
        FR: 'Au moins 1 chiffre',
        ES: 'Al menos 1 número',
        DE: 'Mindestens 1 Zahl',
        ZH: '至少 1 个数字'
      }
    },
    {
      id: 'special',
      test: (pwd: string) => /[@$!%*?&#^+=._\-\[\]{}()]/.test(pwd),
      labels: {
        EN: 'At least 1 special character',
        FR: 'Au moins 1 caractère spécial',
        ES: 'Al menos 1 carácter especial',
        DE: 'Mindestens 1 Sonderzeichen',
        ZH: '至少 1 个特殊字符'
      }
    }
  ];

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 mt-2 space-y-1.5 backdrop-blur-sm transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {requirements.map((req) => {
          const isValid = req.test(password);
          const label = req.labels[lang as keyof typeof req.labels] || req.labels.EN;
          return (
            <div key={req.id} className="flex items-center gap-2 text-[10px] font-semibold transition-colors duration-200">
              <span className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all ${
                isValid 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {isValid ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                )}
              </span>
              <span className={isValid ? 'text-emerald-400/90' : 'text-slate-400'}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
