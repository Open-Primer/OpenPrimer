import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabase';

const EMAIL_CONTENT: Record<string, {
  subject: string;
  subtitle: string;
  welcome: string;
  body: string;
  button: string;
  fallbackText: string;
  footer: string;
}> = {
  FR: {
    subject: 'Activer votre compte OpenPrimer',
    subtitle: 'VOTRE UNIVERSITÉ ACADÉMIQUE DE POINTE',
    welcome: 'Bienvenue à bord !',
    body: 'Merci de vous être inscrit sur OpenPrimer. Pour commencer votre apprentissage personnalisé de niveau L1 à L3, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :',
    button: 'Activer mon compte',
    fallbackText: 'Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :',
    footer: '© 2026 OpenPrimer. Tous droits réservés.'
  },
  EN: {
    subject: 'Activate your OpenPrimer account',
    subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
    welcome: 'Welcome aboard !',
    body: 'Thank you for signing up on OpenPrimer. To begin your personalized learning journey from level L1 to L3, please confirm your email address by clicking the button below:',
    button: 'Activate my account',
    fallbackText: 'If the button above does not work, copy and paste the following link into your browser:',
    footer: '© 2026 OpenPrimer. All rights reserved.'
  },
  ES: {
    subject: 'Activa tu cuenta de OpenPrimer',
    subtitle: 'TU UNIVERSIDAD ACADÉMICA DE VANGUARDIA',
    welcome: '¡Bienvenido a bordo!',
    body: 'Gracias por registrarte en OpenPrimer. Para comenzar tu viaje de aprendizaje personalizado de nivel L1 a L3, confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:',
    button: 'Activar mi cuenta',
    fallbackText: 'Si el botón de arriba no funciona, copia y pega el siguiente enlace en tu navegador:',
    footer: '© 2026 OpenPrimer. Todos los derechos reservados.'
  },
  DE: {
    subject: 'Aktivieren Sie Ihr OpenPrimer-Konto',
    subtitle: 'IHRE FÜHRENDE AKADEMISCHE UNIVERSITÄT',
    welcome: 'Willkommen an Bord!',
    body: 'Vielen Dank für Ihre Anmeldung bei OpenPrimer. Um Ihre personalisierte Lernreise von Stufe L1 bis L3 zu beginnen, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:',
    button: 'Mein Konto aktivieren',
    fallbackText: 'Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie den folgenden Link und fügen Sie ihn in Ihren Browser ein:',
    footer: '© 2026 OpenPrimer. Alle Rechte vorbehalten.'
  },
  ZH: {
    subject: '激活您的 OpenPrimer 账户',
    subtitle: '您的顶尖学术大学',
    welcome: '欢迎加入！',
    body: '感谢您注册 OpenPrimer。要开始您从 L1 到 L3 级别的个性化学习之旅，请点击下方按钮确认您的电子邮件地址：',
    button: '激活我的账户',
    fallbackText: '如果下方的按钮无法点击，请复制并粘贴以下链接到浏览器中：',
    footer: '© 2026 OpenPrimer. 保留所有权利。'
  }
};

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, preferredLang, selectedCourses } = await request.json();

    // Server-side password complexity enforcement (12 chars min + complexity)
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!password || !PASSWORD_REGEX.test(password)) {
      const msgs: Record<string, string> = {
        FR: 'Le mot de passe doit contenir au moins 12 caract\u00e8res, incluant une lettre majuscule, une lettre minuscule, un nombre et un caract\u00e8re sp\u00e9cial.',
        ES: 'La contrase\u00f1a debe tener al menos 12 caracteres, incluyendo una letra may\u00fascula, una letra min\u00fascula, un n\u00famero y un car\u00e1cter especial.',
        DE: 'Das Passwort muss mindestens 12 Zeichen lang sein und einen Gro\u00dfbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.',
        ZH: '\u5bc6\u7801\u957f\u5ea6\u5fc5\u987b\u81f3\u5c11\u4e3a 12 \u4e2a\u5b57\u7b26\uff0c\u4e14\u5fc5\u987b\u5305\u542b\u5927\u5c0f\u5199\u5b57\u6bcd\u3001\u6570\u5b57\u53ca\u7279\u6b8a\u5b57\u7b26\u3002',
        EN: 'Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.'
      };
      const lang = (preferredLang || 'EN').toUpperCase();
      return NextResponse.json({ success: false, error: msgs[lang] || msgs.EN }, { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Generate unique verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // 2. Create the user profile in local/Supabase database (unverified)
    const fName = (firstName || '').trim();
    const lName = (lastName || '').trim();
    const fullName = fName || lName ? `${fName} ${lName}`.trim() : "";
    const newUserProfile = {
      id: `u_${Date.now()}`,
      name: fullName,
      email,
      role: 'student' as const,
      preferredLang,
      selectedCourses,
      // Internal tracking
      isEmailVerified: false,
      verificationToken
    };

    // Save user profile using dbService
    await dbService.createUser({
      id: newUserProfile.id,
      name: newUserProfile.name,
      email: newUserProfile.email,
      role: newUserProfile.role,
      preferredLang: newUserProfile.preferredLang,
      password
    });

    // Save token in memory/DB for state tracking
    if (typeof global !== 'undefined') {
      const g = global as any;
      if (!g.verificationStore) g.verificationStore = new Map();
      g.verificationStore.set(email, { token: verificationToken, profile: newUserProfile });
    }

    // Save token in Supabase auth_verification table if available
    try {
      const { error: dbVerError } = await supabase.from('auth_verification').upsert({
        email: email,
        token: verificationToken,
        profile: newUserProfile,
        created_at: new Date().toISOString()
      });
      if (dbVerError) {
        console.warn('[SIGNUP WARNING] Failed to persist verification token to Supabase auth_verification:', dbVerError);
      } else {
        console.log(`[SIGNUP SUCCESS] Persisted verification token for ${email} in Supabase storage.`);
      }
    } catch (dbErr) {
      console.warn('[SIGNUP WARNING] Supabase connection error in persisting verification token:', dbErr);
    }

    const verificationUrl = `${proto}://${host}/signup?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const userLang = (preferredLang || 'EN').toUpperCase();
    const contentText = EMAIL_CONTENT[userLang] || EMAIL_CONTENT.EN;
    const emailWelcome = fName ? `${contentText.welcome.replace(' !', '').replace('!', '')}, ${fName} !` : contentText.welcome;

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -0.02em; margin: 0; color: #1e3a8a;">
            Open<span style="color: #2563eb;">Primer</span>
          </h1>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-top: 5px;">
            ${contentText.subtitle}
          </p>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
          ${emailWelcome}
        </h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
          ${contentText.body}
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; font-size: 13px; font-weight: 700; color: #ffffff; background-color: #2563eb; border-radius: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: background-color 0.2s;">
            ${contentText.button}
          </a>
        </div>
        
        <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
          ${contentText.fallbackText}<br/>
          <a href="${verificationUrl}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${verificationUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 10px; color: #94a3b8; text-align: center; margin: 0;">
          ${contentText.footer}
        </p>
      </div>
    `;

    // 3. Dispatch validation email using Resend
    if (resendApiKey) {
      console.log(`[RESEND] Dispatching signup verification mail to ${email}...`);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer <onboarding@openprimer.app>',
          to: email,
          subject: contentText.subject,
          html: emailHtml
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[RESEND SIGNUP ERROR]`, errorText);
      } else {
        console.log(`[RESEND SIGNUP SUCCESS] Verification email sent to ${email}.`);
      }
    } else {
      console.warn('[RESEND WARNING] RESEND_API_KEY not configured. Falling back to console verification token delivery.');
    }

    return NextResponse.json({ 
      success: true, 
      isRealSent: !!resendApiKey,
      verificationToken,
      verificationUrl
    });
  } catch (err: any) {
    console.error(`[SIGNUP API ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
