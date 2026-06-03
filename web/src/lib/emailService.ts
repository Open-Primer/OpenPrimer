import { supabase } from './supabase';

const DEFAULT_EN_TEMPLATES: Record<string, {
  subject: string;
  subtitle: string;
  welcome: string;
  body: string;
  button: string;
  fallback_text: string;
  footer: string;
}> = {
  verify_email: {
    subject: 'Activate your OpenPrimer account',
    subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
    welcome: 'Welcome aboard !',
    body: 'Thank you for signing up on OpenPrimer. To begin your personalized learning journey from primary school to level L3, please confirm your email address by clicking the button below:',
    button: 'Activate my account',
    fallback_text: 'If the button above does not work, copy and paste the following link into your browser:',
    footer: '© 2026 OpenPrimer. All rights reserved.'
  },
  lost_password: {
    subject: 'Reset your OpenPrimer password',
    subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
    welcome: 'Hello {{firstName}} !',
    body: 'We received a request to reset the password for your OpenPrimer account. If you did not make this request, you can safely ignore this email. To reset your password, please click the button below:',
    button: 'Reset password',
    fallback_text: 'If the button above does not work, copy and paste the following link into your browser:',
    footer: '© 2026 OpenPrimer. All rights reserved.'
  },
  feedback: {
    subject: 'We received your message - OpenPrimer',
    subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
    welcome: 'Thank you for your message {{firstName}} !',
    body: 'Thank you for contacting OpenPrimer. We have successfully received your feedback or inquiry, and our team will get back to you as soon as possible. Here is a copy of your message:',
    button: 'Visit OpenPrimer',
    fallback_text: 'If you have any urgent updates, you can reply directly to this email.',
    footer: '© 2026 OpenPrimer. All rights reserved.'
  }
};

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text) return '';
  const placeholderMap: Record<string, string> = {
    '{{firstName}}': '_FN_',
    '{{lastName}}': '_LN_',
    '{{fullName}}': '_FULL_'
  };
  let processed = text;
  for (const [key, val] of Object.entries(placeholderMap)) {
    processed = processed.replace(new RegExp(key, 'g'), val);
  }

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang.toLowerCase()}&dt=t&q=${encodeURIComponent(processed)}`);
    if (!res.ok) throw new Error(`Google Translate responded with ${res.status}`);
    const data = await res.json();
    let translated = data[0].map((x: any) => x[0]).join('');
    
    for (const [key, val] of Object.entries(placeholderMap)) {
      translated = translated.replace(new RegExp(val, 'g'), key);
    }
    return translated;
  } catch (err) {
    console.warn(`[TRANSLATE EMAIL HELPER] Failed to translate "${text}" to ${targetLang}:`, err);
    return text;
  }
}

export async function getOrTranslateTemplate(templateType: string, lang: string) {
  const langUpper = (lang || 'EN').toUpperCase();
  
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_type', templateType)
      .eq('lang', langUpper)
      .single();
      
    if (data) {
      return data;
    }
  } catch (err) {
    console.warn(`[EMAIL TEMPLATE FETCH] Error querying database:`, err);
  }

  const baseTemplate = DEFAULT_EN_TEMPLATES[templateType] || DEFAULT_EN_TEMPLATES.verify_email;
  const translated = { ...baseTemplate };
  
  if (langUpper !== 'EN') {
    try {
      console.log(`[EMAIL TEMPLATE TRANSLATE] Translating ${templateType} to ${langUpper}...`);
      translated.subject = await translateText(baseTemplate.subject, langUpper);
      translated.subtitle = await translateText(baseTemplate.subtitle, langUpper);
      translated.welcome = await translateText(baseTemplate.welcome, langUpper);
      translated.body = await translateText(baseTemplate.body, langUpper);
      translated.button = await translateText(baseTemplate.button, langUpper);
      translated.fallback_text = await translateText(baseTemplate.fallback_text, langUpper);
      translated.footer = await translateText(baseTemplate.footer, langUpper);
    } catch (err) {
      console.error(`Auto-translation of template failed:`, err);
    }
  }

  const newId = `${templateType}_${langUpper}`;
  try {
    const { error: insertError } = await supabase
      .from('email_templates')
      .upsert({
        id: newId,
        template_type: templateType,
        lang: langUpper,
        subject: translated.subject,
        subtitle: translated.subtitle,
        welcome: translated.welcome,
        body: translated.body,
        button: translated.button,
        fallback_text: translated.fallback_text,
        footer: translated.footer,
        updated_at: new Date().toISOString()
      });
    if (insertError) {
      console.warn(`[EMAIL TEMPLATE STORE] Failed to persist new template:`, insertError);
    } else {
      console.log(`[EMAIL TEMPLATE STORE] Successfully saved translated ${templateType} for ${langUpper}.`);
    }
  } catch (err) {
    console.warn(`[EMAIL TEMPLATE STORE] Database connection issue:`, err);
  }

  return {
    template_type: templateType,
    lang: langUpper,
    ...translated
  };
}

export function personalizeAndRenderTemplate(
  template: any,
  personalization: { firstName?: string; lastName?: string; actionUrl?: string; [key: string]: any }
) {
  const fName = (personalization.firstName || '').trim();
  const lName = (personalization.lastName || '').trim();
  const fullName = fName || lName ? `${fName} ${lName}`.trim() : '';

  let welcome = template.welcome || '';
  let body = template.body || '';

  if (fullName) {
    welcome = welcome.replace(/\{\{firstName\}\}/g, fName || fullName);
    welcome = welcome.replace(/\{\{lastName\}\}/g, lName);
    welcome = welcome.replace(/\{\{fullName\}\}/g, fullName);
    
    body = body.replace(/\{\{firstName\}\}/g, fName || fullName);
    body = body.replace(/\{\{lastName\}\}/g, lName);
    body = body.replace(/\{\{fullName\}\}/g, fullName);
  } else {
    welcome = welcome.replace(/\{\{firstName\}\}/g, '').replace(/\{\{lastName\}\}/g, '').replace(/\{\{fullName\}\}/g, '');
    welcome = welcome.replace(/\s+/g, ' ').replace(/\s+(!|\?)/g, '$1').trim();
    
    body = body.replace(/\{\{firstName\}\}/g, '').replace(/\{\{lastName\}\}/g, '').replace(/\{\{fullName\}\}/g, '');
    body = body.replace(/\s+/g, ' ').trim();
  }

  for (const [key, val] of Object.entries(personalization)) {
    if (key !== 'firstName' && key !== 'lastName' && key !== 'actionUrl') {
      const reg = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      welcome = welcome.replace(reg, String(val));
      body = body.replace(reg, String(val));
    }
  }

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -0.02em; margin: 0; color: #1e3a8a;">
          Open<span style="color: #2563eb;">Primer</span>
        </h1>
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-top: 5px;">
          ${template.subtitle || 'YOUR LEADING ACADEMIC UNIVERSITY'}
        </p>
      </div>
      
      <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
        ${welcome}
      </h2>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; white-space: pre-wrap;">
        ${body}
      </p>
      
      ${personalization.actionUrl ? `
      <div style="text-align: center; margin: 35px 0;">
        <a href="${personalization.actionUrl}" style="display: inline-block; padding: 14px 32px; font-size: 13px; font-weight: 700; color: #ffffff; background-color: #2563eb; border-radius: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: background-color 0.2s;">
          ${template.button || 'Confirm'}
        </a>
      </div>
      
      <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
        ${template.fallback_text || 'Link:'}<br/>
        <a href="${personalization.actionUrl}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${personalization.actionUrl}</a>
      </p>
      ` : ''}
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 10px; color: #94a3b8; text-align: center; margin: 0;">
        ${template.footer || '© 2026 OpenPrimer. All rights reserved.'}
      </p>
    </div>
  `;

  return {
    subject: template.subject,
    html: emailHtml
  };
}
