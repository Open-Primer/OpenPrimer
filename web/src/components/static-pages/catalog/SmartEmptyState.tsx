"use client";

import React, { useState } from 'react';
import {
  Mail, CheckCircle2, X, Bell, Rocket,
  BrainCircuit, FlaskConical, Scale, Calculator, Atom, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_STRINGS } from '../../RefinedUI';
import { dbService } from '@/lib/db';
import { CourseKiosk } from '../../CourseKiosk';
import { validateEmail, detectPromptInjection, isSpam } from '@/lib/security';

export const SUBJECT_SUGGESTIONS = [
  { label: 'Mathematics', icon: Calculator, href: '/catalog?search=Mathematics', color: 'blue' },
  { label: 'Physics', icon: Atom, href: '/catalog?search=Physics', color: 'violet' },
  { label: 'Biology', icon: Leaf, href: '/catalog?search=Biology', color: 'emerald' },
  { label: 'Chemistry', icon: FlaskConical, href: '/catalog?search=Chemistry', color: 'amber' },
  { label: 'Law', icon: Scale, href: '/catalog?search=Law', color: 'pink' },
  { label: 'Computer Science', icon: BrainCircuit, href: '/catalog?search=Computer', color: 'cyan' },
];

export const EMPTY_STATE_STRINGS = {
  EN: {
    spam_detected: "Your request has been flagged as spam.",
    unauthorized_content: "Unauthorized content detected.",
    generic_error: "An error occurred. Please try again.",
    title: "No courses found",
    subtitle_a: "This search is being tracked by our",
    subtitle_b: "AI Generation Engine.",
    freq_label: "Frequently searched — not yet generated",
    explain: "When enough students search for this topic, our sovereign AI curriculum engine automatically drafts and publishes a new course. You can leave your details below to be notified the moment it goes live.",
    email_placeholder: "Your email address",
    email_required: "Please enter a valid email address.",
    cta_notify: "Notify me when this course is live",
    success_title: "You're on the list!",
    success_desc: "We'll send you a notification as soon as this course is auto-generated and published.",
    alt_title: "Explore available courses",
    alt_sub: "Or try one of these popular subjects:",
    clear: "Clear search",
    privacy_note: "Your email address is securely retained for up to 90 days and will be automatically purged if the course is not generated within this period.",
  },
  FR: {
    spam_detected: "Votre demande a été signalée comme spam.",
    unauthorized_content: "Contenu non autorisé détecté.",
    generic_error: "Une erreur est survenue. Veuillez réessayer.",
    title: "Aucun cours trouvé",
    subtitle_a: "Cette recherche est suivie par notre",
    subtitle_b: "Moteur de Génération IA.",
    freq_label: "Recherche fréquente — cours non encore généré",
    explain: "Lorsqu'un nombre suffisant d'étudiants recherchent ce sujet, notre moteur IA génère et publie automatiquement un nouveau cours. Laissez vos coordonnées ci-dessous pour être notifié dès sa mise en ligne.",
    email_placeholder: "Votre adresse e-mail",
    email_required: "Veuillez entrer une adresse e-mail valide.",
    cta_notify: "Me notifier à la mise en ligne du cours",
    success_title: "Vous êtes inscrit !",
    success_desc: "Nous vous enverrons une notification dès que ce cours sera généré et publié automatiquement.",
    alt_title: "Explorer les cours disponibles",
    alt_sub: "Ou essayez l'un de ces sujets populaires :",
    clear: "Effacer la recherche",
    privacy_note: "Votre adresse e-mail est conservée de manière sécurisée pendant 90 jours maximum et sera automatiquement supprimée si le cours n'est pas généré durant cette période.",
  },
  ES: {
    spam_detected: "Su solicitud ha sido marcada como spam.",
    unauthorized_content: "Contenido no autorizado detectado.",
    generic_error: "Ocurrió un error. Por favor, inténtelo de nuevo.",
    title: "No se encontraron cursos",
    subtitle_a: "Esta búsqueda es rastreada por nuestro",
    subtitle_b: "Motor de Generación IA.",
    freq_label: "Búsqueda frecuente — curso aún no generado",
    explain: "Cuando suficientes estudiantes buscan este tema, nuestro motor de IA genera y publica automáticamente un nuevo curso. Deja tus datos para recibir una notificación en cuanto esté disponible.",
    email_placeholder: "Tu dirección de correo",
    email_required: "Por favor, introduce un correo electrónico válido.",
    cta_notify: "Notificarme cuando el curso esté disponible",
    success_title: "¡Estás en la lista!",
    success_desc: "Te enviaremos una notificación en cuanto este curso sea generado y publicado.",
    alt_title: "Explorar cursos disponibles",
    alt_sub: "O prueba uno de estos temas populares:",
    clear: "Borrar búsqueda",
    privacy_note: "Su dirección de correo electrónico se conserva de forma segura durante un máximo de 90 días y se eliminará automáticamente si el curso no se genera durante este período.",
  },
  DE: {
    spam_detected: "Ihre Anfrage wurde als Spam markiert.",
    unauthorized_content: "Nicht autorisierter Inhalt erkannt.",
    generic_error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    title: "Keine Kurse gefunden",
    subtitle_a: "Diese Suche wird von unserem",
    subtitle_b: "KI-Generierungs-Engine verfolgt.",
    freq_label: "Häufig gesucht — Kurs noch nicht generiert",
    explain: "Wenn genug Studierende dieses Thema suchen, erstellt und veröffentlicht unsere KI automatisch einen neuen Kurs. Hinterlasse deine Daten, um benachrichtigt zu werden, sobald er verfügbar ist.",
    email_placeholder: "Deine E-Mail-Adresse",
    email_required: "Bitte gib eine gültige E-Mail-Adresse ein.",
    cta_notify: "Benachrichtige mich, wenn der Kurs verfügbar ist",
    success_title: "Du bist auf der Liste!",
    success_desc: "Wir senden dir eine Benachrichtigung, sobald dieser Kurs automatisch generiert und veröffentlicht wurde.",
    alt_title: "Verfügbare Kurse erkunden",
    alt_sub: "Oder probiere eines dieser beliebten Themen:",
    clear: "Suche löschen",
    privacy_note: "Ihre E-Mail-Adresse wird bis zu 90 Tage lang sicher aufbewahrt und automatisch gelöscht, wenn der Kurs in diesem Zeitraum nicht erstellt wird.",
  },
  ZH: {
    spam_detected: "您的请求已被标记为垃圾信息。",
    unauthorized_content: "检测到未授权内容。",
    generic_error: "发生错误，请重试。",
    title: "未找到课程",
    subtitle_a: "此搜索正由我们的",
    subtitle_b: "AI生成引擎追踪。",
    freq_label: "搜索频繁 — 课程尚未生成",
    explain: "当足够多的学生搜索此主题时，我们的 AI 主权课程引擎将自动起草并发布新课程。请在下方留下您的信息，以便在课程上线时第一时间收到通知。",
    email_placeholder: "您的电子邮件地址",
    email_required: "请输入有效的电子邮件地址。",
    cta_notify: "课程上线时通知我",
    success_title: "您已成功报名！",
    success_desc: "一旦此课程被自动生成并发布，我们将立即向您发送通知。",
    alt_title: "探索现有课程",
    alt_sub: "或者尝试这些热门主题：",
    clear: "清除搜索",
    privacy_note: "您的电子邮件地址将被安全保留最多90天，如果在此期间未生成课程，将被自动清除。",
  },
  PT: {
    spam_detected: "A sua solicitação foi sinalizada como spam.",
    unauthorized_content: "Conteúdo não autorizado detectado.",
    generic_error: "Ocorreu um erro. Por favor, tente novamente.",
    title: "Nenhum curso encontrado",
    subtitle_a: "Esta busca está sendo rastreada pelo nosso",
    subtitle_b: "Motor de Geração IA.",
    freq_label: "Busca frequente — curso ainda não gerado",
    explain: "Quando estudantes suficientes buscam por este tema, nosso motor de currículo de IA soberano rascunha e publica automaticamente um novo curso. Você pode deixar seus dados abaixo para ser notificado no momento em que for lançado.",
    email_placeholder: "Seu endereço de e-mail",
    email_required: "Por favor, insira um endereço de e-mail válido.",
    cta_notify: "Notifique-me quando este curso estiver disponível",
    success_title: "Você está na lista!",
    success_desc: "Enviaremos uma notificação a você assim que este curso for gerado e publicado automaticamente.",
    alt_title: "Explorar cursos disponíveis",
    alt_sub: "Ou tente um destes tópicos populares:",
    clear: "Limpar busca",
    privacy_note: "Seu endereço de e-mail é retido com segurança por até 90 dias e será excluído automaticamente se o curso não for gerado dentro deste período.",
  },
  AR: {
    spam_detected: "تم وضع علامة على طلبك كرسالة غير مرغوب فيها.",
    unauthorized_content: "تم اكتشاف محتوى غير مصرح به.",
    generic_error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    title: "لم يتم العثور على دورات",
    subtitle_a: "هذا البحث يتم تتبعه بواسطة",
    subtitle_b: "محرك التوليد المدعوم بالذكاء الاصطناعي الخاص بنا.",
    freq_label: "يبحث عنه بكثرة — لم يتم توليده بعد",
    explain: "عندما يبحث عدد كافٍ من الطلاب عن هذا الموضوع، يقوم محرك المناهج الدراسية السيادي المدعوم بالذكاء الاصطناعي لدينا بصياغة ونشر دورة جديدة تلقائيًا. يمكنك ترك بياناتك أدناه ليتم إخطارك في اللحظة التي يبدأ فيها البث المباشر.",
    email_placeholder: "عنوان بريدك الإلكتروني",
    email_required: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
    cta_notify: "أخبرني عندما تكون هذه الدورة متاحة",
    success_title: "لقد تم إضافتك إلى القائمة!",
    success_desc: "سنرسل إليك إشعارًا بمجرد إنشاء هذه الدورة ونشرها تلقائيًا.",
    alt_title: "استكشف الدورات المتاحة",
    alt_sub: "أو جرب أحد هذه المواضيع الشائعة:",
    clear: "مسح البحث",
    privacy_note: "يتم الاحتفاظ بعنوان بريدك الإلكتروني بشكل آمن لمدة تصل إلى 90 يومًا وسيتم حذفه تلقائيًا إذا لم يتم إنشاء الدورة التدريبية خلال هذه الفترة.",
  },
  HI: {
    spam_detected: "आपके अनुरोध को स्पैम के रूप में चिह्नित किया गया है।",
    unauthorized_content: "अनधिकृत सामग्री का पता चला।",
    generic_error: "एक त्रुटि उत्पन्न हुई। कृपया पुन: प्रयास करें।",
    title: "कोई कोर्स नहीं मिला",
    subtitle_a: "यह खोज हमारे द्वारा ट्रैक की जा रही है",
    subtitle_b: "एआई जनरेशन इंजन।",
    freq_label: "अक्सर खोजा गया — अभी तक उत्पन्न नहीं हुआ",
    explain: "जब पर्याप्त छात्र इस विषय की खोज करते हैं, तो हमारा संसंप्रभु एआई पाठ्यक्रम इंजन स्वचालित रूप से एक नया पाठ्यक्रम तैयार और प्रकाशित करता है। लाइव होने के क्षण ही अधिसूचित होने के लिए आप नीचे अपना विवरण छोड़ सकते हैं।",
    email_placeholder: "आपका ईमेल पता",
    email_required: "कृपया एक मान्य ईमेल पता दर्ज करें।",
    cta_notify: "इस कोर्स के लाइव होने पर मुझे सूचित करें",
    success_title: "आप सूची में हैं!",
    success_desc: "जैसे ही यह कोर्स स्वचालित रूप से उत्पन्न और प्रकाशित होगा, हम आपको एक अधिसूचना भेजेंगे।",
    alt_title: "उपलब्ध पाठ्यक्रमों का पता लगाएं",
    alt_sub: "या इनमें से किसी एक लोकप्रिय विषय को आज़माएं:",
    clear: "खोज साफ़ करें",
    privacy_note: "आपका ईमेल पता अधिकतम 90 दिनों के लिए सुरक्षित रूप से रखा जाता है और यदि इस अवधि के भीतर पाठ्यक्रम उत्पन्न नहीं होता है तो स्वचालित रूप से हटा दिया जाएगा।",
  },
  UR: {
    spam_detected: "آپ کی درخواست کو سپیم کے طور پر نشان زد کیا گیا ہے۔",
    unauthorized_content: "غیر مجاز مواد کا پتہ چلا۔",
    generic_error: "ایک خرابی پیش آگئی ہے۔ براہ کرم دوبارہ کوشش کریں۔",
    title: "کوئی کورس نہیں ملا",
    subtitle_a: "یہ تلاش ہماری طرف سے ٹریک کی جا رہی ہے",
    subtitle_b: "اے آئی جنریشن انجن۔",
    freq_label: "اکثر تلاش کیا گیا — ابھی تک تیار نہیں کیا گیا",
    explain: "جب کافی طلباء اس موضوع کو تلاش کریں گے، تو ہمارا خود مختار اے آئی نصاب انجن خود بخود ایک نیا کورس تیار اور شائع کرے گا۔ آپ لائیو ہونے کے فوراً بعد اطلاع حاصل کرنے کے لیے نیچے اپنی تفصیلات درج کر سکتے ہیں۔",
    email_placeholder: "آپ کا ای میل ایڈریس",
    email_required: "براہ کرم ایک درست ای میل ایڈریس درج کریں۔",
    cta_notify: "اس کورس کے لائیو ہونے پر مجھے مطلع کریں",
    success_title: "آپ فہرست میں شامل ہیں!",
    success_desc: "جیسے ہی یہ کورس خود بخود تیار اور شائع ہوگا، ہم آپ کو ایک اطلاع بھیجیں گے۔",
    alt_title: "دستیاب کورسز تلاش کریں",
    alt_sub: "یا ان میں سے کسی ایک مقبول موضوع کو آزمائیں:",
    clear: "تلاش صاف کریں",
    privacy_note: "آپ کا ای میل ایڈریس 90 دنوں تک محفوظ طریقے سے رکھا جاتا ہے اور اگر اس مدت کے دوران کورس تیار نہیں ہوتا ہے تو خود بخود صاف ہو جائے گا۔",
  },
};

export interface SmartEmptyStateProps {
  searchQuery: string;
  onClear: () => void;
  lang: string;
  onSelectSubject?: (subject: string) => void;
}

export const SmartEmptyState = ({ searchQuery, onClear, lang, onSelectSubject }: SmartEmptyStateProps) => {
  const es = EMPTY_STATE_STRINGS[lang as keyof typeof EMPTY_STATE_STRINGS] || EMPTY_STATE_STRINGS.EN;
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();

    const emailCheck = validateEmail(trimmedEmail);
    if (!emailCheck.isValid) {
      setError(emailCheck.reason || es.email_required);
      return;
    }

    if (isSpam(searchQuery) || isSpam(trimmedEmail)) {
      setError(es.spam_detected);
      return;
    }

    if (detectPromptInjection(searchQuery) || detectPromptInjection(trimmedEmail)) {
      setError(es.unauthorized_content);
      return;
    }

    try {
      await dbService.saveCourseNotification(searchQuery, trimmedEmail);
      setSubmitted(true);
    } catch (err) {
      setError(es.generic_error);
    }
  };

  return (
    <div className="col-span-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto py-12 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 flex items-center justify-center shadow-2xl shadow-violet-500/5">
            <Rocket className="w-9 h-9 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">{es.title}</h2>
            {searchQuery && (
              <p className="text-sm text-slate-400 leading-relaxed">
                {es.subtitle_a}{' '}
                <span className="text-violet-400 font-bold">{es.subtitle_b}</span>
              </p>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="p-6 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{es.explain}</p>
            </div>
          </div>
        )}

        {searchQuery && (
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-emerald-400">{es.success_title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{es.success_desc}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{es.cta_notify}</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={es.email_placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-11 pr-5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed text-center px-4 font-medium">
                  {es.privacy_note}
                </p>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {es.cta_notify}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-800/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{es.alt_sub}</span>
          <div className="flex-1 h-px bg-slate-800/60" />
        </div>

        <div className="w-full max-w-4xl mx-auto relative z-50">
          <CourseKiosk 
            lang={lang} 
            mode="disciplines"
            title={t.explore_elite_disciplines}
            subtitle={t.select_discipline_to_restart}
            onDisciplineClick={(subject) => onSelectSubject?.(subject)}
          />
        </div>

        {searchQuery && (
          <div className="text-center">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> {es.clear}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
