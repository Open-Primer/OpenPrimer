"use client";

import React, { useState } from 'react';
import { Download, ChevronDown, FileText, Code, Box, Printer, Brain, Link as LinkIcon, X } from 'lucide-react';

interface ExportLessonButtonProps {
  title: string;
  subject: string;
  level: string;
  content: string;
  lang: string;
  courseSlug?: string;
  version?: string;
}

const MODAL_TRANSLATIONS = {
  EN: {
    export: "Export",
    title: "Course Export Systems",
    close: "Close",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (Recommended - SaaS Mode)',
    ltiWhat: "A .imscc (XML) file containing only the course structure and secure launch pointers.",
    ltiAdvantage: "The full AI experience (interactive tutor, dynamic MDX rendering) and the security of your source code/prompts remain 100% hosted by OpenPrimer. All course modifications are updated in real-time on the LMS without file re-imports.",
    ltiBtn: "Export LTI (.imscc)",

    staticTitle: "Static / Offline Exports (SCORM, HTML, PDF)",
    staticWhat: "A self-hosted, standalone package to be loaded directly onto your client's LMS.",
    staticLimit: "Mandatory loss of interactivity. Conversational AI tutors cannot run locally or in isolation on the LMS, and interactive exercises are downgraded to read-only.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "Printable HTML",
    staticBtnRevision: "Revision Sheet (.md)",

    rawTitle: "Raw Structured Data Export (JSON + MDX)",
    rawWhat: "A compressed archive to backup or migrate courses between OpenPrimer instances, ideal for versioning or direct developer editing.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "What: ",
    advantage: "Advantage: ",
    limitation: "Limitation: "
  },
  FR: {
    export: "Exporter",
    title: "Systèmes d'Exportation de Cours",
    close: "Fermer",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (Recommandé - Mode SaaS)',
    ltiWhat: "Un fichier .imscc (XML) contenant uniquement la structure du cours et des pointeurs sécurisés.",
    ltiAdvantage: "L'expérience IA (tuteur interactif, rendu MDX dynamique) et la sécurité de votre code source/prompts restent à 100% chez OpenPrimer. Toutes vos modifications de cours sont appliquées en temps réel sur les LMS sans avoir besoin de ré-importer de fichier.",
    ltiBtn: "Exporter LTI (.imscc)",

    staticTitle: "Exports Statiques / Offline (SCORM, HTML, PDF)",
    staticWhat: "Un package autonome auto-hébergé sur le LMS de vos clients.",
    staticLimit: "Une perte obligatoire d'interactivité. Les tuteurs IA conversationnels ne peuvent pas s'exécuter localement sur le LMS de manière isolée, et les exercices interactifs se transforment en lecture seule.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "HTML Imprimable",
    staticBtnRevision: "Fiche Révision (.md)",

    rawTitle: "Export de Données Structurées Brutes (JSON + MDX)",
    rawWhat: "Une archive compressée pour sauvegarder ou migrer des cours d'une instance OpenPrimer à une autre, idéale pour le versionnage ou l'édition directe par des développeurs.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "Quoi : ",
    advantage: "Avantage : ",
    limitation: "Limite : "
  },
  ES: {
    export: "Exportar",
    title: "Sistemas de Exportación de Cursos",
    close: "Cerrar",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (Recomendado - Modo SaaS)',
    ltiWhat: "Un archivo .imscc (XML) que contiene únicamente la estructura del curso y punteros de inicio seguros.",
    ltiAdvantage: "La experiencia completa de IA (tutor interactivo, renderizado dinámico de MDX) e la seguridad de sus prompts y código fuente permanecen 100% alojados por OpenPrimer. Todas las modificaciones se actualizan en tiempo real en el LMS sin volver a importar archivos.",
    ltiBtn: "Exportar LTI (.imscc)",

    staticTitle: "Exportaciones Estáticas / Fuera de Línea (SCORM, HTML, PDF)",
    staticWhat: "Un paquete independiente autoalojado que se carga directamente en el LMS de su cliente.",
    staticLimit: "Pérdida obligatoria de interactividad. Los tutores de IA conversacionales no pueden ejecutarse localmente o de forma aislada en el LMS, y los ejercicios interactivos se convierten en solo lectura.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "HTML Imprimible",
    staticBtnRevision: "Ficha de Revisión (.md)",

    rawTitle: "Exportación de Datos Estructurados Brutos (JSON + MDX)",
    rawWhat: "Un archivo comprimido para respaldar o migrar cursos entre instancias de OpenPrimer, ideal para control de versiones o edición directa por desarrolladores.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "Qué: ",
    advantage: "Ventaja: ",
    limitation: "Limitación: "
  },
  DE: {
    export: "Exportieren",
    title: "Kurs-Exportsysteme",
    close: "Schließen",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (Empfohlen - SaaS-Modus)',
    ltiWhat: "Eine .imscc (XML)-Datei, die nur die Kursstruktur und sichere Start-Pointer enthält.",
    ltiAdvantage: "Das volle KI-Erlebnis (interaktiver Tutor, dynamisches MDX-Rendering) und die Sicherheit Ihres Quellcodes/Prompts bleiben zu 100 % bei OpenPrimer gehostet. Alle Kursänderungen werden in Echtzeit auf dem LMS aktualisiert, ohne dass Dateien neu importiert werden müssen.",
    ltiBtn: "LTI Exportieren (.imscc)",

    staticTitle: "Statische / Offline-Exporte (SCORM, HTML, PDF)",
    staticWhat: "Ein selbstgehostetes, eigenständiges Paket, das direkt in das LMS Ihres Kunden geladen wird.",
    staticLimit: "Zwingender Verlust der Interaktivität. Konversationelle KI-Tutoren können nicht lokal oder isoliert auf dem LMS ausgeführt werden, und interaktive Übungen werden auf schreibgeschützt herabgestuft.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "Druckbares HTML",
    staticBtnRevision: "Wiederholungsblatt (.md)",

    rawTitle: "Export strukturierter Rohdaten (JSON + MDX)",
    rawWhat: "Ein komprimiertes Archiv zum Sichern oder Migrieren von Kursen zwischen OpenPrimer-Instanzen, ideal für die Versionsverwaltung oder die direkte Bearbeitung durch Entwickler.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "Was: ",
    advantage: "Vorteil: ",
    limitation: "Einschränkung: "
  },
  ZH: {
    export: "导出",
    title: "课程导出系统",
    close: "关闭",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (推荐 - SaaS 模式)',
    ltiWhat: "一个仅包含课程结构和安全启动指针的 .imscc (XML) 文件。",
    ltiAdvantage: "完整的 AI 体验（交互式导师、动态 MDX 渲染）以及您的源代码/提示词的安全性 100% 由 OpenPrimer 托管。所有课程修改都会实时更新到 LMS，无需重新导入文件。",
    ltiBtn: "导出 LTI (.imscc)",

    staticTitle: "静态 / 离线导出 (SCORM, HTML, PDF)",
    staticWhat: "一个直接加载到您客户 LMS 上的自托管、独立数据包。",
    staticLimit: "不可避免的交互性损失。对话式 AI 导师无法在 LMS 上本地或隔离运行，交互式练习将降级为只读。",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "可打印 HTML",
    staticBtnRevision: "复习单 (.md)",

    rawTitle: "原始结构化数据导出 (JSON + MDX)",
    rawWhat: "用于在 OpenPrimer 实例之间备份或迁移课程的压缩归档文件，非常适合版本控制或开发人员直接编辑。",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "内容: ",
    advantage: "优势: ",
    limitation: "局限性: "
  },
  PT: {
    export: "Exportar",
    title: "Sistemas de Exportação de Cursos",
    close: "Fechar",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (Recomendado - Modo SaaS)',
    ltiWhat: "Um arquivo .imscc (XML) contendo apenas a estrutura do curso e ponteiros de inicialização seguros.",
    ltiAdvantage: "A experiência completa de IA (tutor interativo, renderização dinâmica de MDX) e a segurança de seus prompts e código-fonte permanecem 100% hospedados pela OpenPrimer. Todas as alterações são atualizadas em tempo real no LMS, sem a necessidade de reimportar arquivos.",
    ltiBtn: "Exportar LTI (.imscc)",

    staticTitle: "Exportações Estáticas / Offline (SCORM, HTML, PDF)",
    staticWhat: "Um pacote independente auto-hospedado carregado diretamente no LMS do seu cliente.",
    staticLimit: "Perda obrigatória de interatividade. Os tutores de IA conversacionais não podem ser executados localmente ou de forma isolada no LMS, e os exercícios interativos são rebaixados para apenas leitura.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "HTML Imprimível",
    staticBtnRevision: "Ficha de Revisão (.md)",

    rawTitle: "Exportação de Dados Estruturados Brutos (JSON + MDX)",
    rawWhat: "Um arquivo compactado para backup ou migração de cursos entre instâncias da OpenPrimer, ideal para controle de versão ou edição direta por desenvolvedores.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "O que: ",
    advantage: "Vantagem: ",
    limitation: "Limitação: "
  },
  AR: {
    export: "تصدير",
    title: "أنظمة تصدير المقررات",
    close: "إغلاق",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (موصى به - وضع SaaS)',
    ltiWhat: "ملف .imscc (XML) يحتوي فقط على هيكل المقرر ومؤشرات تشغيل آمنة.",
    ltiAdvantage: "تظل تجربة الذكاء الاصطناعي الكاملة (المعلم التفاعلي، وعرض MDX الديناميكي) وأمان الكود المصدري/التوجيهات مستضافة بنسبة 100% بواسطة OpenPrimer. يتم تحديث جميع تعديلات المقرر في الوقت الفعلي على نظام إدارة التعلم (LMS) دون الحاجة لإعادة استيراد الملفات.",
    ltiBtn: "تصدير LTI (.imscc)",

    staticTitle: "تصدير ستاتيكي / دون اتصال بالإنترنت (SCORM, HTML, PDF)",
    staticWhat: "حزمة مستقلة ذاتية الاستضافة يتم تحميلها مباشرة على نظام إدارة التعلم الخاص بزبونك.",
    staticLimit: "فقدان إلزامي للتفاعل. لا يمكن لمعلمي الذكاء الاصطناعي الحواريين العمل محلياً أو بشكل معزول على نظام إدارة التعلم، ويتم تحويل التمارين التفاعلية إلى وضع القراءة فقط.",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "HTML قابل للطباعة",
    staticBtnRevision: "ورقة مراجعة (.md)",

    rawTitle: "تصدير البيانات الهيكلية الخام (JSON + MDX)",
    rawWhat: "أرشيف مضغوط لنسخ المقررات احتياطياً أو نقلها بين مثيلات OpenPrimer، وهو مثالي لإصدار النسخ أو التعديل المباشر من قبل المطورين.",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "ماذا: ",
    advantage: "الميزة: ",
    limitation: "القيود: "
  },
  HI: {
    export: "निर्यात",
    title: "पाठ्यक्रम निर्यात प्रणाली",
    close: "बंद करें",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (अनुशंसित - SaaS मोड)',
    ltiWhat: "एक .imscc (XML) फ़ाइल जिसमें केवल पाठ्यक्रम संरचना और सुरक्षित लॉन्च पॉइंटर शामिल हैं।",
    ltiAdvantage: "पूर्ण AI अनुभव (इंटरैक्टिव ट्यूटर, गतिशील MDX रेंडरिंग) और आपके स्रोत कोड/प्रॉम्प्ट की सुरक्षा पूरी तरह से OpenPrimer द्वारा होस्ट की जाती है। सभी पाठ्यक्रम संशोधन बिना किसी फ़ाइल पुन: आयात के LMS पर वास्तविक समय में अपडेट किए जाते हैं।",
    ltiBtn: "निर्यात LTI (.imscc)",

    staticTitle: "स्थिर / ऑफ़लाइन निर्यात (SCORM, HTML, PDF)",
    staticWhat: "एक स्टैंडअलोन पैकेज जो सीधे आपके क्लाइंट के LMS पर अपलोड किया जा सकता है।",
    staticLimit: "इंटरैक्टिविटी की अनिवार्य हानि। संवादात्मक AI ट्यूटर LMS पर स्थानीय रूप से या अलगाव में नहीं चल सकते हैं, और इंटरैक्टिव अभ्यास केवल-पढ़ने के लिए डाउनग्रेड हो जाते हैं।",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "प्रिंट करने योग्य HTML",
    staticBtnRevision: "पुनरीक्षण पत्र (.md)",

    rawTitle: "रॉ संरचित डेटा निर्यात (JSON + MDX)",
    rawWhat: "OpenPrimer उदाहरणों के बीच पाठ्यक्रमों को बैकअप या माइग्रेट करने के लिए एक संपीड़ित संग्रह, जो संस्करण नियंत्रण या डेवलपर्स द्वारा सीधे संपादन के लिए आदर्श है।",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "क्या: ",
    advantage: "लाभ: ",
    limitation: "सीमा: "
  },
  UR: {
    export: "ایکسپورٹ",
    title: "کورس ایکسپورٹ سسٹمز",
    close: "بند کریں",
    
    ltiTitle: 'LTI "Thin Common Cartridge" (تجویز کردہ - SaaS موڈ)',
    ltiWhat: "ایک .imscc (XML) فائل جس میں صرف کورس کا ڈھانچہ اور محفوظ لانچ پوائنٹرز ہوتے ہیں۔",
    ltiAdvantage: "مکمل AI تجربہ (انٹرایکٹو ٹیوٹر، متحرک MDX رینڈرنگ) اور آپ کے سورس کوڈ/پرامپٹس کی سیکیورٹی 100٪ OpenPrimer کے پاس ہوسٹ رہتی ہے۔ تمام کورس کی تبدیلیاں بغیر کسی فائل کو دوبارہ امپورٹ کیے LMS پر ریئل ٹائم میں اپ ڈیٹ ہو جاتی ہیں۔",
    ltiBtn: "ایکسپورٹ LTI (.imscc)",

    staticTitle: "اسٹیٹک / آف لائن ایکسپورٹس (SCORM، HTML، PDF)",
    staticWhat: "ایک اسٹینڈ اکیلا پیکیج جو براہ راست آپ کے کلائنٹ کے LMS پر لوڈ کیا جا سکتا ہے۔",
    staticLimit: "انٹرایکٹیویٹی کا لازمی نقصان۔ گفتگو والے AI ٹیوٹرز LMS پر مقامی طور پر یا تنہائی میں نہیں چل سکتے، اور انٹرایکٹو مشقوں کو صرف پڑھنے کے لیے ڈاؤن گریڈ کر دیا جاتا ہے۔",
    staticBtnScorm: "SCORM (.zip)",
    staticBtnHtml: "پرنٹ کے قابل HTML",
    staticBtnRevision: "دہرائی شیٹ (.md)",

    rawTitle: "خام ساختی ڈیٹا ایکسپورٹ (JSON + MDX)",
    rawWhat: "اوپن پرائمر کے مختلف حصوں کے درمیان کورسز کا بیک اپ لینے یا منتقل کرنے کے لیے ایک کمپریسڈ فائل، جو ورژن کنٹرول یا ڈویلپرز کے براہ راست ترمیم کے لیے بہترین ہے۔",
    rawBtnMd: "Markdown (.md)",
    rawBtnJson: "JSON (.json)",
    
    what: "کیا: ",
    advantage: "فائدہ: ",
    limitation: "حدود: "
  }
};

const REVISION_TRANSLATIONS = {
  EN: {
    revisionSheet: "Revision Sheet",
    subject: "Subject",
    level: "Level",
    generatedOn: "Generated on",
    mindMap: "MindMap (Concept Graph)",
    concepts: "Concepts",
    keyPoints: "Key Points",
    summary: "Summary & Key Points",
    glossary: "Key Concepts Glossary",
    noGlossary: "No glossary definitions found.",
    selfAssessment: "Self-Assessment Questions",
    exercises: "Exercises & Practice Tasks",
    exercise: "Exercise",
    printBtn: "Print / Export PDF",
    sheetHtmlPdf: "Sheet HTML/PDF",
    generatedBy: "Generated by OpenPrimer",
    tipsAndInsights: "Tips & Insights",
    tip: "Tip",
    idea: "Idea",
    keyPointTitle: "Key Point",
    taskTitle: "Exercise / Task"
  },
  FR: {
    revisionSheet: "Fiche de Révision",
    subject: "Discipline",
    level: "Niveau",
    generatedOn: "Généré le",
    mindMap: "Carte Mentale (MindMap)",
    concepts: "Notions",
    keyPoints: "Points Clés",
    summary: "Résumé & Points Clés",
    glossary: "Glossaire des Notions Clés",
    noGlossary: "Aucune notion glossaire définie.",
    selfAssessment: "Questions d'Auto-évaluation",
    exercises: "Exercices & Tâches d'Application",
    exercise: "Exercice",
    printBtn: "Imprimer / Exporter PDF",
    sheetHtmlPdf: "Fiche HTML/PDF",
    generatedBy: "Généré par OpenPrimer",
    tipsAndInsights: "Conseils & Perspectives",
    tip: "Conseil",
    idea: "Idée",
    keyPointTitle: "Point Clé",
    taskTitle: "Exercice / Tâche"
  },
  ES: {
    revisionSheet: "Ficha de Revisión",
    subject: "Asignatura",
    level: "Nivel",
    generatedOn: "Generado el",
    mindMap: "Mapa Mental (Grafo de Conceptos)",
    concepts: "Conceptos",
    keyPoints: "Puntos Clave",
    summary: "Resumen y Puntos Clave",
    glossary: "Glosario de Conceptos Clave",
    noGlossary: "No se encontraron definiciones en el glosario.",
    selfAssessment: "Preguntas de Autoevaluación",
    exercises: "Ejercicios y Tareas de Práctica",
    exercise: "Ejercicio",
    printBtn: "Imprimir / Exportar PDF",
    sheetHtmlPdf: "Ficha HTML/PDF",
    generatedBy: "Generado por OpenPrimer",
    tipsAndInsights: "Consejos y Perspectivas",
    tip: "Consejo",
    idea: "Idea",
    keyPointTitle: "Punto Clave",
    taskTitle: "Ejercicio / Tarea"
  },
  DE: {
    revisionSheet: "Wiederholungsblatt",
    subject: "Fach",
    level: "Niveau",
    generatedOn: "Generiert am",
    mindMap: "MindMap (Konzeptgrafik)",
    concepts: "Konzepte",
    keyPoints: "Wichtige Punkte",
    summary: "Zusammenfassung & wichtige Punkte",
    glossary: "Glossar der Schlüsselbegriffe",
    noGlossary: "Keine Glossardefinitionen gefunden.",
    selfAssessment: "Selbstbewertungsfragen",
    exercises: "Übungen & praktische Aufgaben",
    exercise: "Übung",
    printBtn: "Drucken / PDF exportieren",
    sheetHtmlPdf: "Blatt HTML/PDF",
    generatedBy: "Generiert von OpenPrimer",
    tipsAndInsights: "Tipps & Einblicke",
    tip: "Tipp",
    idea: "Idee",
    keyPointTitle: "Wichtiger Punkt",
    taskTitle: "Übung / Aufgabe"
  },
  ZH: {
    revisionSheet: "复习单",
    subject: "科目",
    level: "级别",
    generatedOn: "生成于",
    mindMap: "思维导图 (概念图)",
    concepts: "概念",
    keyPoints: "要点",
    summary: "摘要与要点",
    glossary: "核心概念词汇表",
    noGlossary: "未找到词汇表定义。",
    selfAssessment: "自我评估问题",
    exercises: "练习与实践任务",
    exercise: "练习",
    printBtn: "打印 / 导出 PDF",
    sheetHtmlPdf: "复习单 HTML/PDF",
    generatedBy: "由 OpenPrimer 生成",
    tipsAndInsights: "技巧与洞察",
    tip: "技巧",
    idea: "想法",
    keyPointTitle: "要点",
    taskTitle: "练习 / 任务"
  },
  PT: {
    revisionSheet: "Ficha de Revisão",
    subject: "Disciplina",
    level: "Nível",
    generatedOn: "Gerado em",
    mindMap: "Mapa Mental (Grafo de Conceitos)",
    concepts: "Conceitos",
    keyPoints: "Pontos-Chave",
    summary: "Resumo & Pontos-Chave",
    glossary: "Glossário de Conceitos-Chave",
    noGlossary: "Nenhuma definição de glossário encontrada.",
    selfAssessment: "Questões de Autoavaliação",
    exercises: "Exercícios & Tarefas Práticas",
    exercise: "Exercício",
    printBtn: "Imprimir / Exportar PDF",
    sheetHtmlPdf: "Ficha HTML/PDF",
    generatedBy: "Gerado por OpenPrimer",
    tipsAndInsights: "Dicas & Insights",
    tip: "Dica",
    idea: "Ideia",
    keyPointTitle: "Ponto-Chave",
    taskTitle: "Exercício / Tarefa"
  },
  AR: {
    revisionSheet: "ورقة مراجعة",
    subject: "المادة",
    level: "المستوى",
    generatedOn: "تم الإنشاء في",
    mindMap: "خريطة ذهنية",
    concepts: "المفاهيم",
    keyPoints: "النقاط الرئيسية",
    summary: "الملخص والنقاط الرئيسية",
    glossary: "قاموس المفاهيم الأساسية",
    noGlossary: "لم يتم العثور على تعريفات في القاموس.",
    selfAssessment: "أسئلة التقييم الذاتي",
    exercises: "تمارين ومهام تطبيقية",
    exercise: "تمرين",
    printBtn: "طباعة / تصدير PDF",
    sheetHtmlPdf: "ورقة مراجعة HTML/PDF",
    generatedBy: "تم الإنشاء بواسطة OpenPrimer",
    tipsAndInsights: "نصائح ورؤى",
    tip: "نصيحة",
    idea: "فكرة",
    keyPointTitle: "نقطة رئيسية",
    taskTitle: "تمرين / مهمة"
  },
  HI: {
    revisionSheet: "पुनरीक्षण पत्र (Revision Sheet)",
    subject: "विषय",
    level: "स्तर",
    generatedOn: "इस तिथि को जनरेट किया गया",
    mindMap: "माइंड मैप (अवधारणा ग्राफ)",
    concepts: "अवधारणाएं",
    keyPoints: "मुख्य बिंदु",
    summary: "सारांश & मुख्य बिंदु",
    glossary: "मुख्य अवधारणा शब्दावली",
    noGlossary: "शब्दावली में कोई परिभाषा नहीं मिली।",
    selfAssessment: "स्व-मूल्यांकन प्रश्न",
    exercises: "अभ्यास और व्यावहारिक कार्य",
    exercise: "अभ्यास",
    printBtn: "प्रिंट करें / पीडीएफ निर्यात करें",
    sheetHtmlPdf: "शीट HTML/PDF",
    generatedBy: "OpenPrimer द्वारा जनरेट किया गया",
    tipsAndInsights: "सुझाव और अंतर्दृष्टि",
    tip: "सुझाव",
    idea: "विचार",
    keyPointTitle: "मुख्य बिंदु",
    taskTitle: "अभ्यास / कार्य"
  },
  UR: {
    revisionSheet: "دہرائی شیٹ",
    subject: "مضمون",
    level: "لیول",
    generatedOn: "تخلیق شدہ تاریخ",
    mindMap: "دہینی نقشہ (تصوراتی گراف)",
    concepts: "تصورات",
    keyPoints: "اہم نکات",
    summary: "خلاصہ اور اہم نکات",
    glossary: "اہم تصورات کی لغت",
    noGlossary: "لغت کی کوئی تعریف نہیں ملی۔",
    selfAssessment: "خود تشخیصی سوالات",
    exercises: "مشقیں اور عملی کام",
    exercise: "مشق",
    printBtn: "پرنٹ کریں / پی ڈی ایف ایکسپورٹ کریں",
    sheetHtmlPdf: "شیٹ HTML/PDF",
    generatedBy: "OpenPrimer کے ذریعہ تیار کیا گیا",
    tipsAndInsights: "تجاویز اور بصیرت",
    tip: "نصیحت",
    idea: "خیال",
    keyPointTitle: "اہم نقطہ",
    taskTitle: "مشق / کام"
  }
};

export const ExportLessonButton = ({ title, subject, level, content, lang, courseSlug, version }: ExportLessonButtonProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const upperLang = (lang || 'en').toUpperCase().split('-')[0];
  const mt = MODAL_TRANSLATIONS[upperLang as keyof typeof MODAL_TRANSLATIONS] || MODAL_TRANSLATIONS.EN;
  const rt = REVISION_TRANSLATIONS[upperLang as keyof typeof REVISION_TRANSLATIONS] || REVISION_TRANSLATIONS.EN;

  const getExportFilename = (suffix: string, ext: string) => {
    const cleanLevel = level.toUpperCase().replace(/[^A-Z0-9]+/g, '');
    const cleanSubject = subject.replace(/[^a-zA-Z0-9]+/g, '_');
    const cleanCourse = (courseSlug || '').replace(/[^a-zA-Z0-9]+/g, '_');
    const cleanChapter = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    let parts = [cleanLevel, cleanSubject];
    if (cleanCourse) parts.push(cleanCourse);
    parts.push(cleanChapter);
    
    if (version) {
      let cleanVer = version.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (cleanVer.startsWith('v')) {
        cleanVer = cleanVer.substring(1);
      }
      cleanVer = cleanVer.replace(/\./g, '_');
      if (cleanVer) {
        parts.push(`v${cleanVer}`);
      }
    }
    
    if (suffix) {
      parts.push(suffix);
    }
    
    return `${parts.filter(Boolean).join('_')}.${ext}`;
  };

  const t = {
    export: mt.export,
    markdown: mt.rawBtnMd,
    json: mt.rawBtnJson,
    scorm: mt.staticBtnScorm,
    lti: mt.ltiBtn,
    print: mt.staticBtnHtml,
    revision: mt.staticBtnRevision
  };

  // Shared premium CSS design to make exported HTML look premium and wow the user
  const getPremiumStyles = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
      
      :root {
        --primary: #4f46e5;
        --primary-glow: rgba(79, 70, 229, 0.15);
        --bg-main: #0b0f19;
        --bg-card: #151d30;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border: #1e293b;
        --code-color: #f472b6;
        --pre-bg: #070a12;
      }

      @media (prefers-color-scheme: light) {
        :root {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --code-color: #db2777;
          --pre-bg: #f1f5f9;
          --primary-glow: rgba(79, 70, 229, 0.08);
        }
      }
      
      body {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: var(--bg-main);
        color: var(--text-main);
        line-height: 1.8;
        max-width: 850px;
        margin: 0 auto;
        padding: 50px 24px;
        transition: background-color 0.3s, color 0.3s;
      }
      
      header {
        margin-bottom: 48px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 32px;
      }
      
      .badge {
        display: inline-block;
        padding: 6px 14px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        background-color: var(--primary-glow);
        color: #818cf8;
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 9999px;
        margin-bottom: 20px;
      }
      
      h1 {
        font-size: 2.75rem;
        font-weight: 800;
        line-height: 1.25;
        letter-spacing: -0.02em;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-top: 48px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 12px;
        letter-spacing: -0.01em;
      }
      
      h3 {
        font-size: 1.35rem;
        font-weight: 600;
        margin-top: 36px;
        margin-bottom: 18px;
      }
      
      p {
        margin-top: 0;
        margin-bottom: 24px;
      }
      
      ul, ol {
        margin-top: 0;
        margin-bottom: 24px;
        padding-left: 28px;
      }
      
      li {
        margin-bottom: 10px;
      }
      
      code {
        font-family: 'Fira Code', monospace;
        font-size: 0.88em;
        background-color: var(--primary-glow);
        padding: 3px 8px;
        border-radius: 8px;
        color: var(--code-color);
        font-weight: 500;
      }
      
      pre {
        background-color: var(--pre-bg);
        border: 1px solid var(--border);
        padding: 24px;
        border-radius: 16px;
        overflow-x: auto;
        margin-bottom: 28px;
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
      }
      
      pre code {
        background-color: transparent;
        padding: 0;
        border-radius: 0;
        color: inherit;
        font-size: 0.9em;
      }
      
      blockquote {
        border-left: 4px solid var(--primary);
        background-color: var(--primary-glow);
        padding: 20px 28px;
        margin: 28px 0;
        border-radius: 4px 16px 16px 4px;
        font-style: italic;
      }

      .callout {
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 28px;
        border: 1px solid var(--border);
        background-color: var(--bg-card);
        box-shadow: 0 4px 20px -5px rgba(0,0,0,0.15);
      }
      
      .callout-idea {
        border-left: 4px solid #f59e0b;
        background-color: rgba(245, 158, 11, 0.03);
      }
      
      .callout-tip {
        border-left: 4px solid #10b981;
        background-color: rgba(16, 185, 129, 0.03);
      }
      
      .callout-task {
        border-left: 4px solid #3b82f6;
        background-color: rgba(59, 130, 246, 0.03);
      }

      .callout-keypoint {
        border-left: 4px solid #8b5cf6;
        background-color: rgba(139, 92, 246, 0.03);
      }
      
      .glossary-term {
        border-bottom: 1px dashed var(--primary);
        cursor: help;
        color: #818cf8;
        position: relative;
        font-weight: 500;
        padding-bottom: 1px;
      }
      
      .glossary-term:hover {
        color: #a5b4fc;
      }
      
      .glossary-term::after {
        content: attr(title);
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #020617;
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.82rem;
        font-weight: 400;
        width: 260px;
        white-space: normal;
        box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--border);
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        z-index: 10;
        line-height: 1.45;
      }
      
      .glossary-term:hover::after {
        visibility: visible;
        opacity: 1;
      }
    `;
  };

  const getRevisionStyles = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
      
      :root {
        --primary: #4f46e5;
        --primary-glow: rgba(79, 70, 229, 0.1);
        --bg-main: #0b0f19;
        --bg-card: #151d30;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border: #1e293b;
      }

      @media (prefers-color-scheme: light) {
        :root {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #0f172a;
          --text-muted: #475569;
          --border: #e2e8f0;
          --primary-glow: rgba(79, 70, 229, 0.05);
        }
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: var(--bg-main);
        color: var(--text-main);
        line-height: 1.5;
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px;
        transition: background-color 0.3s, color 0.3s;
      }
      
      header {
        margin-bottom: 24px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 16px;
        position: relative;
      }
      
      .badge {
        display: inline-block;
        padding: 4px 10px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background-color: var(--primary-glow);
        color: #818cf8;
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 9999px;
        margin-bottom: 12px;
      }
      
      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 2.25rem;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 1.35rem;
        font-weight: 700;
        margin-top: 24px;
        margin-bottom: 12px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 6px;
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 16px;
        margin-bottom: 8px;
      }
      
      p {
        margin-top: 0;
        margin-bottom: 12px;
      }

      .revision-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 24px;
      }
      
      @media (max-width: 850px) {
        .revision-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
      
      .key-point {
        padding: 10px 14px;
        border-left: 3px solid #4f46e5;
        background: var(--bg-card);
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        margin-bottom: 10px;
        font-size: 0.9rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .glossary-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      .glossary-entry strong {
        color: #818cf8;
      }

      .quiz-q {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #10b981;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .task-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #f59e0b;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .tip-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #8b5cf6;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .print-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        background: #4f46e5;
        color: white;
        font-weight: 700;
        font-size: 0.8rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Outfit', sans-serif;
        letter-spacing: 0.04em;
        transition: background 0.2s;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      }
      .print-btn:hover {
        background: #4338ca;
      }
      
      .badge-ai {
        display: inline-block;
        padding: 2px 8px;
        font-size: 0.65rem;
        font-weight: 700;
        background: rgba(139,92,246,0.15);
        color: #a78bfa;
        border: 1px solid rgba(139,92,246,0.3);
        border-radius: 9999px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      @media print {
        body {
          background-color: #ffffff !important;
          color: #0f172a !important;
          padding: 0 !important;
          font-size: 9.5pt !important;
          line-height: 1.35 !important;
        }
        .revision-grid {
          grid-template-columns: 1.1fr 0.9fr !important;
          gap: 16pt !important;
        }
        .key-point, .glossary-entry, .quiz-q, .task-entry, .tip-entry {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
          page-break-inside: avoid !important;
          box-shadow: none !important;
        }
        .key-point strong, .glossary-entry strong {
          color: #0f172a !important;
        }
        h1 {
          font-size: 18pt !important;
        }
        h2 {
          font-size: 12pt !important;
          margin-top: 14pt !important;
          margin-bottom: 6pt !important;
          border-bottom-color: #cbd5e1 !important;
        }
        header {
          margin-bottom: 12pt !important;
          padding-bottom: 8pt !important;
          border-bottom-color: #cbd5e1 !important;
        }
        .no-print {
          display: none !important;
        }
        @page {
          size: landscape;
          margin: 10mm 12mm !important;
        }
      }
    `;
  };

  // Convert raw Markdown/MDX into high-fidelity formatted HTML
  const convertMdxToHtml = (mdx: string) => {
    // 1. Strip YAML frontmatter if it exists
    let body = mdx.replace(/^---[\s\S]*?---/, '');

    // 2. Parse Glossary tags
    body = body.replace(/<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"(?:\s*\/|\s*>.*?<\/Glossary|)>?/g, (_, term, definition) => {
      return `<span class="glossary-term" title="${definition.replace(/"/g, '&quot;')}">${term}</span>`;
    });

    // 3. Convert callout tags (Idea, Tip, Task, KeyPoint)
    const containers = [
      { tag: 'Idea', icon: '💡', title: rt.idea },
      { tag: 'Tip', icon: '💡', title: rt.tip },
      { tag: 'Task', icon: '🎯', title: rt.taskTitle },
      { tag: 'KeyPoint', icon: '🔑', title: rt.keyPointTitle }
    ];
    containers.forEach(({ tag, icon, title }) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
      body = body.replace(regex, (_, content) => {
        return `<div class="callout callout-${tag.toLowerCase()}">${icon} <strong>${title} :</strong> ${content.trim()}</div>`;
      });
    });

    // Strip other custom React tag wrappers
    body = body.replace(/<[A-Z][a-zA-Z0-9]*[^>]*>/g, '');
    body = body.replace(/<\/[A-Z][a-zA-Z0-9]*>/g, '');

    // 4. Save Code Blocks to avoid escaping
    const codeBlocks: string[] = [];
    body = body.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => {
      const idx = codeBlocks.length;
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      codeBlocks.push(`<pre><code class="language-${lang}">${escapedCode.trim()}</code></pre>`);
      return `__CODE_BLOCK_${idx}__`;
    });

    // 5. Escape general HTML but keep our generated HTML tags safe
    const htmlPlaceholders: string[] = [];
    const preserveRegex = /<\/?(span|div|strong|em|pre|code|blockquote|ul|ol|li)[^>]*>/gi;
    body = body.replace(preserveRegex, (match) => {
      const idx = htmlPlaceholders.length;
      htmlPlaceholders.push(match);
      return `__HTML_TAG_${idx}__`;
    });

    body = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    for (let i = 0; i < htmlPlaceholders.length; i++) {
      body = body.replace(`__HTML_TAG_${i}__`, htmlPlaceholders[i]);
    }

    // 6. Convert inline formatting
    body = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    body = body.replace(/__(.*?)__/g, '<strong>$1</strong>');
    body = body.replace(/\*(.*?)\*/g, '<em>$1</em>');
    body = body.replace(/_([^_]+)_/g, '<em>$1</em>');
    body = body.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 7. Headers
    body = body.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    body = body.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    body = body.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 8. Blockquotes
    body = body.replace(/^\s*>\s*(.*$)/gim, '<blockquote>$1</blockquote>');

    // 9. Lists
    body = body.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>');
    body = body.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    body = body.replace(/<\/ul>\s*<ul>/g, '\n');

    // 10. Paragraph splits
    const blocks = body.split(/\n\s*\n/);
    body = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || 
          trimmed.startsWith('<pre') || 
          trimmed.startsWith('<ul') || 
          trimmed.startsWith('<ol') || 
          trimmed.startsWith('<div') || 
          trimmed.startsWith('<block')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');

    // Restore Code Blocks
    for (let i = 0; i < codeBlocks.length; i++) {
      body = body.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
    }

    return body;
  };

  const handleExportRevisionSheet = () => {
    const filename = getExportFilename('revision', 'md');
    
    // Parse Glossary terms
    const glossaryTerms: { term: string; definition: string }[] = [];
    const termRegex = /<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"/g;
    let match: RegExpExecArray | null = null;
    while (true) {
      match = termRegex.exec(content);
      if (!match) break;
      const term = match[1];
      const definition = match[2];
      if (!glossaryTerms.some(item => item.term === term)) {
        glossaryTerms.push({ term, definition });
      }
    }

    // Extract Summary items (two formats: raw items=[...] or preprocessed itemsString="...")
    const summaryItems: string[] = [];
    // Format 1: items={["item1", "item2"]} (raw AI output)
    const summaryRegex = /<Summary\s+items={\[(.*?)\]}\s*\/>/gs;
    let summaryMatch: RegExpExecArray | null = null;
    while (true) {
      summaryMatch = summaryRegex.exec(content);
      if (!summaryMatch) break;
      const itemsStr = summaryMatch[1];
      const strRegex = /"([^"]+)"/g;
      let strMatch: RegExpExecArray | null = null;
      while (true) {
        strMatch = strRegex.exec(itemsStr);
        if (!strMatch) break;
        summaryItems.push(strMatch[1]);
      }
    }
    // Format 2: itemsString="item1|||item2" (after preprocessMdx)
    if (summaryItems.length === 0) {
      const summaryStrRegex = /<Summary\s+itemsString="([^"]+)"\s*\/>/g;
      let ssMatch: RegExpExecArray | null = null;
      while (true) {
        ssMatch = summaryStrRegex.exec(content);
        if (!ssMatch) break;
        ssMatch[1].split('|||').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) summaryItems.push(trimmed);
        });
      }
    }

    // Extract Quiz questions (for self-testing)
    const quizQuestions: string[] = [];
    const qRegex = /<Question\s+q="([^"]+)"/g;
    let qMatch: RegExpExecArray | null = null;
    while (true) {
      qMatch = qRegex.exec(content);
      if (!qMatch) break;
      quizQuestions.push(qMatch[1]);
    }

    // Extract Tasks/Exercises
    const tasks: string[] = [];
    const taskRegex = /<Task[^>]*>([\s\S]*?)<\/Task>/g;
    while (true) {
      match = taskRegex.exec(content);
      if (!match) break;
      tasks.push(match[1].replace(/<[^>]+>/g, '').trim());
    }

    // Extract Tips and Ideas
    const tipsAndIdeas: { type: string; content: string }[] = [];
    const tipRegex = /<(Tip|Idea)[^>]*>([\s\S]*?)<\/\1>/g;
    let tMatch: RegExpExecArray | null = null;
    while (true) {
      tMatch = tipRegex.exec(content);
      if (!tMatch) break;
      const type = tMatch[1];
      const text = tMatch[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        tipsAndIdeas.push({ type, content: text });
      }
    }

    // Build Mindmap Mermaid structure
    let mermaidMindmap = `mindmap\n  root((${title}))\n`;
    if (glossaryTerms.length > 0) {
      mermaidMindmap += `    ${rt.concepts}\n`;
      glossaryTerms.slice(0, 10).forEach(item => {
        const cleanTerm = item.term.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, '');
        mermaidMindmap += `      ${cleanTerm}\n`;
      });
    }
    if (summaryItems.length > 0) {
      mermaidMindmap += `    ${rt.keyPoints}\n`;
      summaryItems.slice(0, 4).forEach((item, i) => {
        const shortLabel = item.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, '').substring(0, 40);
        mermaidMindmap += `      ${shortLabel}\n`;
      });
    }

    let revisionContent = `# ${rt.revisionSheet} : ${title}\n`;
    revisionContent += `**${rt.subject} :** ${subject} • **${rt.level} :** ${level}\n`;
    revisionContent += `**${rt.generatedOn} :** ${new Date().toLocaleDateString()}\n\n`;

    revisionContent += `## 🗺️ ${rt.mindMap}\n`;
    revisionContent += `\`\`\`mermaid\n${mermaidMindmap}\`\`\`\n\n`;

    if (summaryItems.length > 0) {
      revisionContent += `## 📝 ${rt.summary}\n`;
      revisionContent += summaryItems.map(item => `- ${item}`).join('\n');
      revisionContent += '\n\n';
    }

    revisionContent += `## 📚 ${rt.glossary}\n`;
    revisionContent += glossaryTerms.length > 0
      ? glossaryTerms.map(item => `* **${item.term}** : ${item.definition}`).join('\n')
      : `*${rt.noGlossary}*`;
    revisionContent += '\n\n';

    if (tipsAndIdeas.length > 0) {
      revisionContent += `## 💡 ${rt.tipsAndInsights}\n`;
      revisionContent += tipsAndIdeas.map(item => `* **${item.type === 'Tip' ? rt.tip : rt.idea}** : ${item.content}`).join('\n');
      revisionContent += '\n\n';
    }

    if (quizQuestions.length > 0) {
      revisionContent += `## 🧠 ${rt.selfAssessment}\n`;
      revisionContent += quizQuestions.slice(0, 10).map((q, idx) => `${idx + 1}. ${q}`).join('\n');
      revisionContent += '\n\n';
    }

    if (tasks.length > 0) {
      revisionContent += `## 🎯 ${rt.exercises}\n`;
      revisionContent += tasks.map((t, idx) => `### ${rt.exercise} ${idx + 1}\n- ${t}`).join('\n\n');
      revisionContent += '\n';
    }

    revisionContent += `\n---\n*${rt.generatedBy}*`;

    const blob = new Blob([revisionContent], { type: 'text/markdown;charset=utf-8' });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url2);
    setDropdownOpen(false);
  };

  const handleExportRevisionHtml = () => {
    const filename = getExportFilename('revision', 'html');

    // Parse Glossary terms
    const glossaryTerms: { term: string; definition: string }[] = [];
    const termRegex = /<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"/g;
    let match: RegExpExecArray | null = null;
    while (true) {
      match = termRegex.exec(content);
      if (!match) break;
      if (!glossaryTerms.some(item => item.term === match![1]))
        glossaryTerms.push({ term: match[1], definition: match[2] });
    }

    // Extract Summary (two formats)
    const summaryItems: string[] = [];
    // Format 1: raw items={[...]}
    const summaryRegex = /<Summary\s+items={\[(.*?)\]}\s*\/>/gs;
    let sMatch: RegExpExecArray | null = null;
    while (true) {
      sMatch = summaryRegex.exec(content);
      if (!sMatch) break;
      const strRegex = /"([^"]+)"/g;
      let strMatch: RegExpExecArray | null = null;
      while (true) {
        strMatch = strRegex.exec(sMatch[1]);
        if (!strMatch) break;
        summaryItems.push(strMatch[1]);
      }
    }
    // Format 2: itemsString="..." (preprocessed)
    if (summaryItems.length === 0) {
      const summaryStrRegex = /<Summary\s+itemsString="([^"]+)"\s*\/>/g;
      let ssMatch: RegExpExecArray | null = null;
      while (true) {
        ssMatch = summaryStrRegex.exec(content);
        if (!ssMatch) break;
        ssMatch[1].split('|||').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) summaryItems.push(trimmed);
        });
      }
    }

    // Extract Quiz questions
    const quizQuestions: string[] = [];
    const qRegex = /<Question\s+q="([^"]+)"/g;
    let qMatch: RegExpExecArray | null = null;
    while (true) {
      qMatch = qRegex.exec(content);
      if (!qMatch) break;
      quizQuestions.push(qMatch[1]);
    }

    // Extract Tasks/Exercises
    const tasks: string[] = [];
    const taskRegex = /<Task[^>]*>([\s\S]*?)<\/Task>/g;
    while (true) {
      match = taskRegex.exec(content);
      if (!match) break;
      tasks.push(match[1].replace(/<[^>]+>/g, '').trim());
    }

    // Extract Tips and Ideas
    const tipsAndIdeas: { type: string; content: string }[] = [];
    const tipRegex = /<(Tip|Idea)[^>]*>([\s\S]*?)<\/\1>/g;
    let tMatch: RegExpExecArray | null = null;
    while (true) {
      tMatch = tipRegex.exec(content);
      if (!tMatch) break;
      const type = tMatch[1];
      const text = tMatch[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        tipsAndIdeas.push({ type, content: text });
      }
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${rt.revisionSheet} — ${title}</title>
  <style>
    ${getRevisionStyles()}
  </style>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${rt.revisionSheet}</h1>
    <p style="color: var(--text-muted); margin-top: 8px; font-size: 0.9rem;">${title}</p>
    <p style="color: var(--text-muted); font-size: 0.75rem;">
      ${rt.generatedOn} ${new Date().toLocaleDateString()}
      &nbsp;&bull;&nbsp; <span class="badge-ai">OpenPrimer AI</span>
    </p>
    <button class="print-btn no-print" onclick="window.print()">
      🖨️ ${rt.printBtn}
    </button>
  </header>

  <main class="revision-grid">
    <div class="col-left">
      <!-- Section 1: Summary & Key Points -->
      ${summaryItems.length > 0 ? `
      <h2>📝 ${rt.summary}</h2>
      ${summaryItems.map(item => `<div class="key-point">${item}</div>`).join('')}
      ` : ''}

      <!-- Section 2: Exercises & Practice Tasks -->
      ${tasks.length > 0 ? `
      <h2>🎯 ${rt.exercises}</h2>
      ${tasks.map((t, idx) => `
        <div class="task-entry">
          <div class="task-title">${rt.exercise} ${idx + 1}</div>
          <div style="margin-top: 4px; line-height: 1.4;">${t}</div>
        </div>
      `).join('')}
      ` : ''}
    </div>

    <div class="col-right">
      <!-- Section 3: Glossary -->
      <h2>📚 ${rt.glossary}</h2>
      ${glossaryTerms.length > 0
        ? glossaryTerms.map(item =>
            `<div class="glossary-entry"><strong>${item.term}</strong> : ${item.definition}</div>`
          ).join('')
        : `<div class="glossary-entry" style="font-style: italic; color: var(--text-muted); text-align: center;">${rt.noGlossary}</div>`
      }

      <!-- Section 4: Tips & Insights -->
      ${tipsAndIdeas.length > 0 ? `
      <h2>💡 ${rt.tipsAndInsights}</h2>
      ${tipsAndIdeas.map(item => `
        <div class="tip-entry">
          <strong>${item.type === 'Tip' ? rt.tip : rt.idea} :</strong> ${item.content}
        </div>
      `).join('')}
      ` : ''}

      <!-- Section 5: Self-Assessment Questions -->
      ${quizQuestions.length > 0 ? `
      <h2>🧠 ${rt.selfAssessment}</h2>
      ${quizQuestions.slice(0, 10).map((q, idx) =>
        `<div class="quiz-q"><strong>${idx + 1}.</strong> ${q}</div>`
      ).join('')}
      ` : ''}
    </div>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url2);
    setDropdownOpen(false);
  };

  const handleExportMarkdown = () => {
    const filename = getExportFilename('', 'md');
    const frontmatter = `---
title: "${title}"
subject: "${subject}"
level: "${level}"
lang: "${lang}"
---

${content}`;
    
    const blob = new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  const handleExportJson = () => {
    const filename = getExportFilename('', 'json');
    const data = {
      title,
      subject,
      level,
      lang,
      exportedAt: new Date().toISOString(),
      format: "OpenPrimer course export",
      content
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  const handleExportHtml = () => {
    const filename = getExportFilename('', 'html');
    const renderedBody = convertMdxToHtml(content);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${getPremiumStyles()}
  </style>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${title}</h1>
  </header>
  <main>
    ${renderedBody}
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  const handleExportScorm = () => {
    const filename = getExportFilename('scorm', 'zip');
    const renderedBody = convertMdxToHtml(content);

    const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OpenPrimer_SCORM_Course" version="1.1"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="openprimer_org">
    <organization identifier="openprimer_org">
      <title>${title}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;

    const indexHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${getPremiumStyles()}
  </style>
  <script>
    // SCORM API Communication Wrapper
    var api = null;
    function getAPI() {
      if (api) return api;
      var win = window;
      while (win) {
        if (win.API) {
          api = win.API;
          break;
        }
        if (win.parent && win.parent !== win) {
          win = win.parent;
        } else {
          break;
        }
      }
      return api;
    }

    window.onload = function() {
      var scormApi = getAPI();
      if (scormApi) {
        scormApi.LMSInitialize("");
        scormApi.LMSSetValue("cmi.core.lesson_status", "completed");
        scormApi.LMSCommit("");
      }
    };

    window.onunload = function() {
      var scormApi = getAPI();
      if (scormApi) {
        scormApi.LMSFinish("");
      }
    };
  </script>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${title}</h1>
  </header>
  <main>
    ${renderedBody}
  </main>
</body>
</html>`;

    // Package as ZIP client-side
    const files = [
      { name: "imsmanifest.xml", content: imsManifestXml },
      { name: "index.html", content: indexHtml }
    ];

    const zipBlob = generateSimpleZip(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  const handleExportLtiCartridge = () => {
    const filename = getExportFilename('lti', 'imscc');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://openprimer.ai';
    
    const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OpenPrimer_LTI_Course_Cartridge" 
          xmlns="http://www.imsglobal.org/xsd/imscc/imscp_v1p1" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscc/imscp_v1p1 
                              https://purl.imsglobal.org/spec/cc/v1p1/schema/xsd/imscp_v1p1.xsd">
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.2.0</schemaversion>
  </metadata>
  <organizations>
    <organization identifier="org_1" structure="rooted-hierarchy">
      <item identifier="item_1" identifierref="resource_lti_link">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_lti_link" type="imsbasiclti_xmlv1p0">
      <file href="ltilink.xml"/>
    </resource>
  </resources>
</manifest>`;

    const ltiLinkXml = `<?xml version="1.0" encoding="UTF-8"?>
<cartridge_basiclti_link 
    xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0"
    xmlns:blti="http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
    xmlns:lticm="http://www.imsglobal.org/xsd/imslticm_v1p0"
    xmlns:lticp="http://www.imsglobal.org/xsd/imslticp_v1p0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imslticc_v1p0 imslticc_v1p0p1.xsd 
                        http://www.imsglobal.org/xsd/imsbasiclti_v1p0 imsbasiclti_v1p0p1.xsd">
  <blti:title>${title}</blti:title>
  <blti:description>Course lesson: ${title} (${subject} - ${level})</blti:description>
  <blti:launch_url>${origin}/api/lti/launch</blti:launch_url>
  <blti:secure_launch_url>${origin}/api/lti/launch</blti:secure_launch_url>
  <blti:custom>
    <lticm:property name="course_slug">${courseSlug || ''}</lticm:property>
    <lticm:property name="subject">${subject}</lticm:property>
    <lticm:property name="level">${level}</lticm:property>
    <lticm:property name="lesson_title">${title}</lticm:property>
  </blti:custom>
  <blti:vendor>
    <lticp:code>openprimer.ai</lticp:code>
    <lticp:name>OpenPrimer</lticp:name>
  </blti:vendor>
</cartridge_basiclti_link>`;

    const files = [
      { name: "imsmanifest.xml", content: imsManifestXml },
      { name: "ltilink.xml", content: ltiLinkXml }
    ];

    const zipBlob = generateSimpleZip(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  // Minimal ZIP packaging utility (Standard DEFLATE-less ZIP)
  const generateSimpleZip = (files: { name: string; content: string }[]) => {
    const encoder = new TextEncoder();
    const fileDataList: any[] = [];
    let currentOffset = 0;
    const localHeaders: Uint8Array[] = [];

    for (const f of files) {
      const nameBytes = encoder.encode(f.name);
      const contentBytes = encoder.encode(f.content);
      
      const header = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(header.buffer);
      
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 10, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      
      let crc = 0xffffffff;
      for (let i = 0; i < contentBytes.length; i++) {
        crc ^= contentBytes[i];
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
      }
      crc ^= 0xffffffff;
      
      view.setUint32(14, crc, true);
      view.setUint32(18, contentBytes.length, true);
      view.setUint32(22, contentBytes.length, true);
      view.setUint16(26, nameBytes.length, true);
      view.setUint16(28, 0, true);
      
      header.set(nameBytes, 30);
      
      localHeaders.push(header);
      localHeaders.push(contentBytes);
      
      fileDataList.push({ nameBytes, contentBytes, offset: currentOffset });
      currentOffset += header.length + contentBytes.length;
    }

    const centralHeaders: Uint8Array[] = [];
    let centralDirectorySize = 0;
    for (const f of fileDataList) {
      const header = new Uint8Array(46 + f.nameBytes.length);
      const view = new DataView(header.buffer);
      
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 10, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint16(14, 0, true);
      
      let crc = 0xffffffff;
      for (let i = 0; i < f.contentBytes.length; i++) {
        crc ^= f.contentBytes[i];
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
      }
      crc ^= 0xffffffff;
      
      view.setUint32(16, crc, true);
      view.setUint32(20, f.contentBytes.length, true);
      view.setUint32(24, f.contentBytes.length, true);
      view.setUint16(28, f.nameBytes.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, f.offset, true);
      
      header.set(f.nameBytes, 46);
      centralHeaders.push(header);
      centralDirectorySize += header.length;
    }

    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true);
    eocdView.setUint16(4, 0, true);
    eocdView.setUint16(6, 0, true);
    eocdView.setUint16(8, fileDataList.length, true);
    eocdView.setUint16(10, fileDataList.length, true);
    eocdView.setUint32(12, centralDirectorySize, true);
    eocdView.setUint32(16, currentOffset, true);
    eocdView.setUint16(20, 0, true);

    const blobs = [...localHeaders, ...centralHeaders, eocd];
    return new Blob(blobs as any[], { type: 'application/zip' });
  };

  return (
    <div className="relative inline-block text-left distraction-free-hide font-sans">
      <div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-all cursor-pointer shadow-md select-none"
          id="export-menu-button"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.export}</span>
        </button>
      </div>

      {modalOpen && (
        <div 
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col cursor-default"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-200 m-0">
                  {mt.title}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer border-0 bg-transparent flex items-center justify-center"
                aria-label={mt.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Option 1: LTI SaaS */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors shrink-0">
                    <LinkIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.ltiTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.ltiWhat}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-emerald-400">{mt.advantage}</strong>
                      {mt.ltiAdvantage}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          handleExportLtiCartridge();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md select-none border-0"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{mt.ltiBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Static Offline */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-violet-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors shrink-0">
                    <Box className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.staticTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.staticWhat}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-rose-400">{mt.limitation}</strong>
                      {mt.staticLimit}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => {
                          handleExportScorm();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Box className="w-3.5 h-3.5 text-violet-400" />
                        <span>{mt.staticBtnScorm}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportHtml();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{mt.staticBtnHtml}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportRevisionSheet();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Brain className="w-3.5 h-3.5 text-pink-400" />
                        <span>{mt.staticBtnRevision}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportRevisionHtml();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-indigo-800/40 hover:bg-indigo-700/60 border border-indigo-600/40 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{rt.sheetHtmlPdf}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 3: Raw Structured Data */}
              <div className="bg-slate-950/20 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <Code className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {mt.rawTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed m-0">
                      <strong className="text-slate-400">{mt.what}</strong>
                      {mt.rawWhat}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => {
                          handleExportMarkdown();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>{mt.rawBtnMd}</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportJson();
                          setModalOpen(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-md select-none"
                      >
                        <Code className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{mt.rawBtnJson}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
