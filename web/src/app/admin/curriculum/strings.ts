import { formatCourseLevel } from '@/lib/translations';
import { locale as en } from './locales/en';
import { locale as fr } from './locales/fr';
import { locale as es } from './locales/es';
import { locale as de } from './locales/de';
import { locale as zh } from './locales/zh';
import { locale as pt } from './locales/pt';
import { locale as ar } from './locales/ar';
import { locale as hi } from './locales/hi';
import { locale as ur } from './locales/ur';

export const CURRICULUM_STRINGS = {
  EN: {
    title: "Curriculum Control Center",
    subtitle: "Curriculum Lifecycle & Quality Assurance",
    tab_generation: "Generation Engine",
    tab_translation: "Translation Engine",
    tab_revision: "Revision Engine",
    tab_archiving: "Course Archiving",
    tab_queue: "Pipeline Queue",
    tab_achievements: "Achievements Grid",
    tab_personalities: "AI Tutor Personalities",
    auto_approve: "Auto-Approve Generation",
    failure_threshold: "Failure Seuil to Auto-Approve",
    active_proposals: "Active Academic Proposals",
    refused_backlog: "Refused Backlog",
    status_live: "Live",
    status_archived: "Archived",
    status_pending: "Pending",
    status_running: "Running",
    status_complete: "Complete",
    
    // personalities
    add_personality: "Add New Personality",
    personality_name: "Personality Name",
    system_prompt: "System Prompt",
    set_default: "Set as Default Personality",
    is_default: "Default",
    delete: "Delete",
    actions: "Actions",
    
    // achievements
    create_badge: "Create New Achievement Badge",
    edit_badge: "Edit Achievement Badge",
    badge_name: "Achievement Name",
    badge_desc: "Description",
    threshold_param: "Threshold Parameter",
    suggested_icons: "AI Suggested Icons",
    multilang_compilation: "Multi-Language Compilation Backlog",
    save: "Enregistrer",
    cancel: "Cancel",
    confirm_purge: "Force Purge",
    type_name_confirm: "Type name here...",
    strict_parameter_error: "Strict Parameter Error: All fields are required!",
    strict_validation_reject: "Strict Validation Reject: Threshold must be positive!",
    success: "Success",
    empty_trans: "No translation requests in queue.",
    refused_trans_backlog: "Refused Translation Backlog",
    unrefuse_reevaluate: "Remove & Force Re-Evaluate",
    empty_refused_trans: "No refused translations in backlog.",
    course_launch_queue: "Course Launch Dispatch Queue",
    course_launch_queue_desc: "Monitor course translations compiled and ready for dispatch to registered student domains.",
    pending: "Pending",
    registry_title: "Registered Languages Registry",
    registry_desc: "Configure target translation languages, control their access levels, or purge them.",
    register_new: "Register New Language",
    col_flag: "Flag",
    col_code: "Code",
    col_label: "Language Label",
    col_control: "Pedagogical Control Level",
    col_status: "Active Status",
    status_archived_invisible: "Archived & Hidden",
    status_active: "Active"
  },
  FR: {
    title: "Centre de Contrôle du Cursus",
    subtitle: "Cycle de Vie du Cursus & Assurance Qualité",
    tab_generation: "Génération",
    tab_translation: "Traduction",
    tab_revision: "Révision",
    tab_archiving: "Archivage",
    tab_queue: "File d'Attente",
    tab_achievements: "Grille de Badges",
    tab_personalities: "Personnalités",
    auto_approve: "Génération Auto-Approuvée",
    failure_threshold: "Seuil d'Approbation",
    active_proposals: "Propositions Académiques Actives",
    refused_backlog: "Backlog des Refusés",
    status_live: "Actif",
    status_archived: "Archivé",
    status_pending: "En Attente",
    status_running: "En Cours",
    status_complete: "Terminé",
    
    // personalities
    add_personality: "Créer une Personnalité",
    personality_name: "Nom de la Personnalité",
    system_prompt: "Prompt Système",
    set_default: "Définir par Défaut",
    is_default: "Par Défaut",
    delete: "Supprimer",
    actions: "Actions",
    
    // achievements
    create_badge: "Créer un Badge",
    edit_badge: "Modifier le Badge",
    badge_name: "Nom du Badge",
    badge_desc: "Description",
    threshold_param: "Seuil",
    suggested_icons: "Icônes Suggérées",
    multilang_compilation: "Backlog de Compilation Multi-Langues",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm_purge: "Purger",
    type_name_confirm: "Entrez le nom ici...",
    strict_parameter_error: "Erreur Paramètre Strict : Tous les champs sont requis !",
    strict_validation_reject: "Rejet de Validation Stricte : Le seuil doit être positif !",
    success: "Succès",
    empty_trans: "Aucune demande de traduction dans la file.",
    refused_trans_backlog: "Backlog des Traductions Refusées",
    unrefuse_reevaluate: "Retirer & Forcer la Ré-évaluation",
    empty_refused_trans: "Aucune traduction refusée dans le backlog.",
    course_launch_queue: "File d'attente de lancement des cours",
    course_launch_queue_desc: "Surveiller les traductions compilées prêtes à être envoyées aux étudiants.",
    pending: "En attente",
    registry_title: "Registre des langues enregistrées",
    registry_desc: "Configurez les langues cibles, gérez leur visibilité ou purgez-les.",
    register_new: "Enregistrer une langue",
    col_flag: "Drapeau",
    col_code: "Code",
    col_label: "Nom de la langue",
    col_control: "Niveau de contrôle pédagogique",
    col_status: "Statut actif",
    status_archived_invisible: "Archivée & Masquée",
    status_active: "Active"
  },
  ES: {
    title: "Gobernanza Académica",
    subtitle: "Ciclo de vida del plan de estudios y garantía de calidad",
    tab_generation: "Generador de Cursus",
    tab_translation: "Traductor de Cursus",
    tab_revision: "Revisor Pedagógico",
    tab_archiving: "Archivo de Cursus",
    tab_queue: "Cola de Tareas",
    tab_achievements: "Badges y Medallas",
    tab_personalities: "Personalidades Tutor",
    auto_approve: "Auto-aprobar generación",
    failure_threshold: "Umbral de fallos para auto-aprobar",
    active_proposals: "Propuestas académicas activas",
    refused_backlog: "Historial de rechazados",
    status_live: "Actif",
    status_archived: "Archivé",
    status_pending: "En Attente",
    status_running: "En Cours",
    status_complete: "Terminé",
    add_personality: "Crear Personalidad",
    personality_name: "Nombre de la Personalidad",
    system_prompt: "Prompt del Sistema",
    set_default: "Establecer por Defecto",
    is_default: "Por Defecto",
    delete: "Eliminar",
    actions: "Acciones",
    create_badge: "Crear Medalla",
    edit_badge: "Editar Medalla",
    badge_name: "Nombre de la Medalla",
    badge_desc: "Descripción",
    threshold_param: "Umbral",
    suggested_icons: "Iconos Sugeridos",
    multilang_compilation: "Compilación Multi-Lenguaje",
    save: "Guardar",
    cancel: "Cancelar",
    confirm_purge: "Purgar",
    type_name_confirm: "Escriba el nombre aquí...",
    strict_parameter_error: "Error de parámetro estricto: Todos los campos son obligatorios.",
    strict_validation_reject: "Rechazo de validación estricta: ¡El umbral debe ser positivo!",
    success: "Éxito",
    empty_trans: "No hay solicitudes de traducción en la cola.",
    refused_trans_backlog: "Historial de Traducciones Rechazadas",
    unrefuse_reevaluate: "Eliminar y Forzar Re-evaluación",
    empty_refused_trans: "No hay traducciones rechazadas en el historial.",
    course_launch_queue: "Cola de Envío de Cursos",
    course_launch_queue_desc: "Supervisar las traducciones compiladas y listas para enviar a los estudiantes.",
    pending: "Pendiente",
    registry_title: "Registro de Idiomas Registrados",
    registry_desc: "Configure los idiomas de destino, controle sus niveles de acceso o elimínelos.",
    register_new: "Registrar Nuevo Idioma",
    col_flag: "Bandera",
    col_code: "Código",
    col_label: "Idioma",
    col_control: "Nivel de Control Pedagógico",
    col_status: "Estado Activo",
    status_archived_invisible: "Archivado y Oculto",
    status_active: "Activo"
  },
  DE: {
    title: "Akademische Governance",
    subtitle: "Lehrplan-Lebenszyklus & Qualitätssicherung",
    tab_generation: "Gegenstand-Generierung",
    tab_translation: "Übersetzungs-Engine",
    tab_revision: "Überarbeitungs-Engine",
    tab_archiving: "Kursarchivierung",
    tab_queue: "Auftragswarteschlange",
    tab_achievements: "Errungenschaften",
    tab_personalities: "Tutor-Persönlichkeiten",
    auto_approve: "Generierung automatisch freigeben",
    failure_threshold: "Fehlerschwelle zur automatischen Freigabe",
    active_proposals: "Aktive akademische Vorschläge",
    refused_backlog: "Abgelehnte Vorschläge",
    status_live: "Aktiv",
    status_archived: "Archiviert",
    status_pending: "In Warteschlange",
    status_running: "Läuft",
    status_complete: "Abgeschlossen",
    add_personality: "Persönlichkeit Hinzufügen",
    personality_name: "Name der Persönlichkeit",
    system_prompt: "System-Prompt",
    set_default: "Als Standard Festlegen",
    is_default: "Standard",
    delete: "Löschen",
    actions: "Aktionen",
    create_badge: "Errungenschaft Erstellen",
    edit_badge: "Errungenschaft Bearbeiten",
    badge_name: "Name der Errungenschaft",
    badge_desc: "Beschreibung",
    threshold_param: "Schwellenwert",
    suggested_icons: "Vorgeschlagene Symbole",
    multilang_compilation: "Mehrsprachige Übersetzung",
    save: "Speichern",
    cancel: "Abbrechen",
    confirm_purge: "Bereinigen",
    type_name_confirm: "Geben Sie den Namen hier ein...",
    strict_parameter_error: "Strikter Parameterfehler: Alle Felder sind erforderlich!",
    strict_validation_reject: "Strikte Validierungsablehnung: Der Schwellenwert muss positiv sein!",
    success: "Erfolg",
    empty_trans: "Keine Übersetzungsanfragen in der Warteschlange.",
    refused_trans_backlog: "Abgelehnte Übersetzungen Backlog",
    unrefuse_reevaluate: "Entfernen & Re-Evaluierung erzwingen",
    empty_refused_trans: "Keine abgelehnten Übersetzungen im Backlog.",
    course_launch_queue: "Kursstart-Warteschlange",
    course_launch_queue_desc: "Überwachen Sie kompilierte Kursübersetzungen, die für den Versand bereit sind.",
    pending: "Ausstehend",
    registry_title: "Registrierte Sprachen",
    registry_desc: "Verwalten Sie Zielsprachen, deren Zugriffsebenen oder löschen Sie diese.",
    register_new: "Neue Sprache registrieren",
    col_flag: "Flagge",
    col_code: "Code",
    col_label: "Sprache",
    col_control: "Pädagogische Kontrollebene",
    col_status: "Aktiver Status",
    status_archived_invisible: "Archiviert & Versteckt",
    status_active: "Aktiv"
  },
  ZH: {
    title: "学术治理中心",
    subtitle: "课程生命周期与教学质量保障",
    tab_generation: "课程生成引擎",
    tab_translation: "多语言翻译引擎",
    tab_revision: "教学修订中心",
    tab_archiving: "课程归档控制",
    tab_queue: "管道队列监控",
    tab_achievements: "成就勋章管理",
    tab_personalities: "导师个性配置",
    auto_approve: "自动批准生成",
    failure_threshold: "自动批准失败阈值",
    active_proposals: "活跃学术提案",
    refused_backlog: "已拒绝积压",
    status_live: "发布中",
    status_archived: "已归档",
    status_pending: "排队中",
    status_running: "生成中",
    status_complete: "已完成",
    add_personality: "添加新个性",
    personality_name: "个性名称",
    system_prompt: "系统提示词",
    set_default: "设为默认",
    is_default: "默认",
    delete: "删除",
    actions: "操作",
    create_badge: "创建新勋章",
    edit_badge: "编辑勋章",
    badge_name: "勋章名称",
    badge_desc: "描述",
    threshold_param: "阈值参数",
    suggested_icons: "AI 推荐图标",
    multilang_compilation: "多语言翻译汇编",
    save: "保存",
    cancel: "取消",
    confirm_purge: "强制清除",
    type_name_confirm: "在此输入名称以确认...",
    strict_parameter_error: "严格参数错误：所有字段均为必填项！",
    strict_validation_reject: "严格验证拒绝：阈值必须为正值！",
    success: "成功",
    empty_trans: "队列中没有翻译请求。",
    refused_trans_backlog: "已拒绝的翻译积压",
    unrefuse_reevaluate: "删除并强制重新评估",
    empty_refused_trans: "积压中没有已拒绝的的翻译。",
    course_launch_queue: "课程发布分发队列",
    course_launch_queue_desc: "监控已编译并准备分发到 student 终端的课程翻译。",
    pending: "排队中",
    registry_title: "已注册语言注册表",
    registry_desc: "配置目标翻译语言，控制其访问权限级别，或进行清除。",
    register_new: "注册新语言",
    col_flag: "国旗/图标",
    col_code: "代码",
    col_label: "语言名称",
    col_control: "教学控制级别",
    col_status: "活跃状态",
    status_archived_invisible: "已归档且隐藏",
    status_active: "活跃"
  },
  PT: {
    title: "Centro de Controle do Currículo",
    subtitle: "Ciclo de Vida do Currículo & Garantia de Qualidade",
    tab_generation: "Motor de Geração",
    tab_translation: "Motor de Tradução",
    tab_revision: "Motor de Revisão",
    tab_archiving: "Arquivamento de Cursos",
    tab_queue: "Fila de Processamento",
    tab_achievements: "Grade de Conquistas",
    tab_personalities: "Personalidades do Tutor IA",
    auto_approve: "Auto-Aprovar Geração",
    failure_threshold: "Limite de Falhas para Auto-Aprovar",
    active_proposals: "Propostas Acadêmicas Ativas",
    refused_backlog: "Lista de Recusados",
    status_live: "Ativo",
    status_archived: "Arquivado",
    status_pending: "Pendente",
    status_running: "Executando",
    status_complete: "Concluído",
    add_personality: "Adicionar Nova Personalidade",
    personality_name: "Nome da Personalidade",
    system_prompt: "Prompt do Sistema",
    set_default: "Definir como Personalidade Padrão",
    is_default: "Padrão",
    delete: "Excluir",
    actions: "Ações",
    create_badge: "Criar Novo Emblema de Conquista",
    edit_badge: "Editar Emblema de Conquista",
    badge_name: "Nome da Conquista",
    badge_desc: "Descrição",
    threshold_param: "Parâmetro de Limite",
    suggested_icons: "Ícones Sugeridos por IA",
    multilang_compilation: "Fila de Compilação Multi-Idiomas",
    save: "Salvar",
    cancel: "Cancelar",
    confirm_purge: "Forçar Purga",
    type_name_confirm: "Digite o nome aqui...",
    strict_parameter_error: "Erro de Parâmetro Estrito: Todos os campos são obrigatórios!",
    strict_validation_reject: "Rejeição de Validação Estrita: O limite deve ser positivo!",
    success: "Sucesso",
    empty_trans: "Nenhuma solicitação de tradução na fila.",
    refused_trans_backlog: "Lista de Traduções Recusadas",
    unrefuse_reevaluate: "Remover & Forçar Reavaliação",
    empty_refused_trans: "Nenhuma tradução recusada na lista.",
    course_launch_queue: "Fila de Lançamento de Cursos",
    course_launch_queue_desc: "Monitore traduções de cursos compiladas e prontas para envio aos domínios de estudantes registrados.",
    pending: "Pendente",
    registry_title: "Registro de Idiomas Cadastrados",
    registry_desc: "Configure os idiomas de tradução de destino, controle seus níveis de acesso ou purgue-os.",
    register_new: "Registrar Novo Idioma",
    col_flag: "Bandeira",
    col_code: "Código",
    col_label: "Nome do Idioma",
    col_control: "Nível de Controle Pedagógico",
    col_status: "Status Ativo",
    status_archived_invisible: "Arquivado & Oculto",
    status_active: "Ativo"
  },
  AR: {
    title: "مركز التحكم في المناهج",
    subtitle: "دورة حياة المناهج وضمان الجودة",
    tab_generation: "محرك التوليد",
    tab_translation: "محرك الترجمة",
    tab_revision: "محرك المراجعة",
    tab_archiving: "أرشفة المقررات",
    tab_queue: "طابور المعالجة",
    tab_achievements: "شبكة الإنجازات",
    tab_personalities: "شخصيات معلم الذكاء الاصطناعي",
    auto_approve: "الموافقة التلقائية على التوليد",
    failure_threshold: "حد الفشل للموافقة التلقائية",
    active_proposals: "المقترحات الأكاديمية النشطة",
    refused_backlog: "المقترحات المرفوضة",
    status_live: "نشط",
    status_archived: "مؤرشف",
    status_pending: "معلق",
    status_running: "قيد التشغيل",
    status_complete: "مكتمل",
    add_personality: "إضافة شخصية جديدة",
    personality_name: "اسم الشخصية",
    system_prompt: "التوجيه الأساسي للنظام",
    set_default: "تعيين كشخصية افتراضية",
    is_default: "افتراضي",
    delete: "حذف",
    actions: "الإجراءات",
    create_badge: "إنشاء شارة إنجاز جديدة",
    edit_badge: "تعديل شارة الإنجاز",
    badge_name: "اسم الإنجاز",
    badge_desc: "الوصف",
    threshold_param: "معيار الحد الأدنى",
    suggested_icons: "الأيقونات المقترحة من الذكاء الاصطناعي",
    multilang_compilation: "تجميع الترجمات متعددة اللغات",
    save: "حفظ",
    cancel: "إلغاء",
    confirm_purge: "فرض التطهير",
    type_name_confirm: "اكتب الاسم هنا للتأكيد...",
    strict_parameter_error: "خطأ في المعايير الصارمة: جميع الحقول مطلوبة!",
    strict_validation_reject: "رفض التحقق الصارم: يجب أن يكون الحد الأدنى موجباً!",
    success: "نجاح",
    empty_trans: "لا توجد طلبات ترجمة في الطابور.",
    refused_trans_backlog: "الترجمات المرفوضة",
    unrefuse_reevaluate: "إزالة وفرض إعادة التقييم",
    empty_refused_trans: "لا توجد ترجمات مرفوضة.",
    course_launch_queue: "طابور إطلاق المقررات",
    course_launch_queue_desc: "مراقبة ترجمات المقررات المجمعة والجاهزة للإرسال إلى نطاقات الطلاب المسجلين.",
    pending: "معلق",
    registry_title: "سجل اللغات المسجلة",
    registry_desc: "تكوين لغات الترجمة المستهدفة، والتحكم في مستويات الوصول إليها، أو تطهيرها.",
    register_new: "تسجيل لغة جديدة",
    col_flag: "العلم",
    col_code: "الرمز",
    col_label: "اسم اللغة",
    col_control: "مستوى التحكم التربوي",
    col_status: "الحالة النشطة",
    status_archived_invisible: "مؤرشف ومخفي",
    status_active: "نشط"
  },
  HI: {
    title: "पाठ्यक्रम नियंत्रण केंद्र",
    subtitle: "पाठ्यक्रम जीवनचक्र और गुणवत्ता आश्वासन",
    tab_generation: "उत्पादन इंजन",
    tab_translation: "अनुवाद इंजन",
    tab_revision: "संशोधन इंजन",
    tab_archiving: "पाठ्यक्रम का संग्रहण",
    tab_queue: "पाइपलाइन कतार",
    tab_achievements: "उपलब्धि ग्रिड",
    tab_personalities: "एआई शिक्षक व्यक्तित्व",
    auto_approve: "उत्पादन स्वतः-स्वीकृत करें",
    failure_threshold: "स्वतः-स्वीकृत करने के लिए विफलता सीमा",
    active_proposals: "सक्रिय शैक्षणिक प्रस्ताव",
    refused_backlog: "अस्वीकृत बैकलाग",
    status_live: "सक्रिय",
    status_archived: "संग्रहीत",
    status_pending: "लंबित",
    status_running: "चल रहा है",
    status_complete: "पूर्ण",
    add_personality: "नया व्यक्तित्व जोड़ें",
    personality_name: "व्यक्तित्व का नाम",
    system_prompt: "सिस्टम प्रॉम्ट",
    set_default: "डिफ़ॉल्ट व्यक्तित्व के रूप में सेट करें",
    is_default: "डिफ़ॉल्ट",
    delete: "हटाएं",
    actions: "कार्रवाइयाँ",
    create_badge: "नया उपलब्धि बैज बनाएं",
    edit_badge: "उपलब्धि बैज संपादित करें",
    badge_name: "उपलब्धि का नाम",
    badge_desc: "विवरण",
    threshold_param: "सीमा पैरामीटर",
    suggested_icons: "एआई सुझावित आइकन",
    multilang_compilation: "बहु-भाषा संकलन बैकलाग",
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm_purge: "बलपूर्वक हटाएँ",
    type_name_confirm: "पुष्टि के लिए यहाँ नाम लिखें...",
    strict_parameter_error: "सख्त पैरामीटर त्रुटि: सभी फ़ील्ड आवश्यक हैं!",
    strict_validation_reject: "सख्त सत्यापन अस्वीकृति: सीमा सकारात्मक होनी चाहिए!",
    success: "सफलता",
    empty_trans: "कतार में कोई अनुवाद अनुरोध नहीं है।",
    refused_trans_backlog: "अस्वीकृत अनुवाद बैकलाग",
    unrefuse_reevaluate: "हटाएं और बलपूर्वक पुनर्मूल्यांकन करें",
    empty_refused_trans: "अस्वीकृत अनुवाद बैकलाग में कोई अनुरोध नहीं है।",
    course_launch_queue: "पाठ्यक्रम प्रेषण कतार",
    course_launch_queue_desc: "पंजीकृत छात्र डोमेन पर भेजने के लिए तैयार संकलित पाठ्यक्रमों की निगरानी करें।",
    pending: "लंबित",
    registry_title: "पंजीकृत भाषा रजिस्ट्री",
    registry_desc: "लक्षित अनुवाद भाषाओं को कॉन्फ़िगर करें, उनकी पहुंच स्तर नियंत्रित करें, या उन्हें हटाएं।",
    register_new: "नई भाषा पंजीकृत करें",
    col_flag: "ध्वज",
    col_code: "कोड",
    col_label: "भाषा का नाम",
    col_control: "शैक्षणिक नियंत्रण स्तर",
    col_status: "सक्रिय स्थिति",
    status_archived_invisible: "संग्रहीत और छिपा हुआ",
    status_active: "सक्रिय"
  },
  UR: {
    title: "نصاب کنٹرول سینٹر",
    subtitle: "نصاب کا لائف سائیکل اور معیار کی یقین دہانی",
    tab_generation: "تخلیقی انجن",
    tab_translation: "ترجمہ انجن",
    tab_revision: "نظر ثانی انجن",
    tab_archiving: "کورس آرکائیونگ",
    tab_queue: "پائپ لائن قطار",
    tab_achievements: "کامیابیوں کا گریڈ",
    tab_personalities: "اے آئی ٹیوٹر شخصیات",
    auto_approve: "خودکار منظوری تخلیق",
    failure_threshold: "خودکار منظوری کے لیے ناکامی کی حد",
    active_proposals: "سرگرم تعلیمی تجاویز",
    refused_backlog: "مسترد شدہ تجاویز",
    status_live: "فعال",
    status_archived: "آرکائیو شدہ",
    status_pending: "التوا میں",
    status_running: "جاری ہے",
    status_complete: "مکمل",
    add_personality: "نئی شخصیت شامل کریں",
    personality_name: "شخصیت کا نام",
    system_prompt: "سستم پرامپٹ",
    set_default: "بطور ڈیفالٹ شخصیت سیٹ کریں",
    is_default: "ڈیفالٹ",
    delete: "حذف کریں",
    actions: "اقدامات",
    create_badge: "نیا کامیابی کا بیج بنائیں",
    edit_badge: "کامیابی کا بیج ایڈٹ کریں",
    badge_name: "کامیابی کا نام",
    badge_desc: "تفصیل",
    threshold_param: "حد کا پیرامیٹر",
    suggested_icons: "اے آئی کے تجویز کردہ آئیکنز",
    multilang_compilation: "کثیر لسانی ترجمہ بیک لاگ",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    confirm_purge: "زبردستی خارج کریں",
    type_name_confirm: "تصدیق کے لیے یہاں نام لکھیں...",
    strict_parameter_error: "سخت پیرامیٹر خرابی: تمام فیلڈز لازمی ہیں!",
    strict_validation_reject: "سخت تصدیق مسترد: حد کا مثبت ہونا ضروری ہے!",
    success: "کامیابی",
    empty_trans: "قطار میں کوئی ترجمہ کی درخواست نہیں ہے۔",
    refused_trans_backlog: "مسترد شدہ ترجمہ بیک لاگ",
    unrefuse_reevaluate: "ہٹائیں اور زبردستی دوبارہ جائزہ لیں",
    empty_refused_trans: "مسترد شدہ ترجمہ بیک لاگ میں کوئی درخواست نہیں ہے۔",
    course_launch_queue: "کورس لانچ ڈسپیچ قطار",
    course_launch_queue_desc: "ترتیب دیے گئے کورسز کے ترجمے کی نگرانی کریں جو رجسٹرڈ طلبہ کے ڈومینز پر بھیجنے کے لیے تیار ہیں۔",
    pending: "التوا میں",
    registry_title: "رجسٹرڈ زبانوں کی رجسٹری",
    registry_desc: "ٹارگٹ ترجمہ زبانوں کو ترتیب دیں، ان کے رسائی کے لیولز کو کنٹرول کریں، یا انہیں خارج کریں۔",
    register_new: "نئی زبان رجسٹر کریں",
    col_flag: "پرچم",
    col_code: "کوڈ",
    col_label: "زبان کا نام",
    col_control: "تدریسی کنٹرول لیول",
    col_status: "فعال حیثیت",
    status_archived_invisible: "آرکائیو شدہ اور پوشیدہ",
    status_active: "فعال"
  }
};

export const normalizeForComparison = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
};

export const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const areTitlesTooSimilar = (title1: string, title2: string): boolean => {
  const n1 = normalizeForComparison(title1);
  const n2 = normalizeForComparison(title2);
  if (n1 === n2) return true;
  const distance = getLevenshteinDistance(n1, n2);
  const maxLength = Math.max(n1.length, n2.length);
  if (maxLength === 0) return true;
  return (distance / maxLength) <= 0.15;
};

export const COCKPIT_DICTIONARY = {
  EN: en,
  FR: fr,
  ES: es,
  DE: de,
  ZH: zh,
  PT: pt,
  AR: ar,
  HI: hi,
  UR: ur
};

export const LOCALIZED_POPUPS = {
  EN: {
    course_confirm: 'Are you sure you want to completely archive the course "{title}"? This will purge it from database.',
    tutor_confirm: 'Are you sure you want to permanently delete the tutor personality "{title}"? This action is irreversible.',
    task_cancel_confirm: 'Are you sure you want to cancel the task "{title}"?',
    translation_cancel_error: "New language creation cannot be cancelled due to site instability risk.",
    purge_badge_title: "Confirm Badge Delete",
    purge_badge_desc: 'Are you sure you want to delete/archive the badge "{title}"? This action is irreversible.',
    purge_badge_confirm_btn: "Confirm Delete",
    purge_badge_cancel_btn: "Cancel",
    purge_lang_title: "Confirm Language Delete",
    purge_lang_desc: 'Are you sure you want to delete/archive the language "{title}"? This action is irreversible.',
    cancel_task_title: "Confirm Task Cancellation",
    dependency_warning_1: "This course belongs to active curricula: \"{title}\". To set this course to archiving level {level}, the parent curricula must be archived to the same level first.",
    dependency_warning_2: "Would you like to archive the parent curricula to level {level} first, and then proceed with this course?",
    cascade_warning_1: "You are setting the curriculum \"{title}\" to archiving level {level}.",
    cascade_warning_2: "Would you also like to cascade this archiving level to all associated child courses? ({count} courses found).",
    manual_confirm_desc: "By confirming, this new academic content will be instantly pushed to the AI validation pipeline to be built in real-time.",
    alert_progression_exists: "The progression course \"{title}\" already exists in the catalog or in the queue with a similar title!",
    toast_title_empty: "Course/curriculum title cannot be empty!",
    toast_similar_exists: "The course or curriculum \"{title}\" already exists with a similar title at this level!",
    toast_manual_success: "Manual academic proposal added successfully!",
    toast_catalog_similar_exists: "The course \"{title}\" already exists in the catalog or in the queue with a similar title at this level!",
    toast_translation_in_queue: "Translation task for {lang} is already in the queue!",
    toast_already_translated: "This course is already translated into {lang}!",
    alert_revision_in_queue: "Revision task for {chapter} is already in the queue!",
    alert_revision_scheduled: "Revision task scheduled! Course version has been successfully incremented.",
    toast_lang_registered: "Language {lang} is already registered!"
  },
  FR: {
    course_confirm: 'Êtes-vous sûr de vouloir archiver totalement le cours "{title}" ? Cela va le purger de la base de données.',
    tutor_confirm: 'Êtes-vous sûr de vouloir supprimer définitivement la personnalité "{title}" ? Cette action est irréversible.',
    task_cancel_confirm: 'Êtes-vous sûr de vouloir annuler la tâche "{title}" ?',
    translation_cancel_error: "La création d'une nouvelle langue ne peut pas être annulée en raison d'un risque d'instabilité du site.",
    purge_badge_title: "Confirmer la suppression",
    purge_badge_desc: 'Êtes-vous sûr de vouloir supprimer/archiver le badge "{title}" ? Cette action est irréversible.',
    purge_badge_confirm_btn: "Confirmer la suppression",
    purge_badge_cancel_btn: "Annuler",
    purge_lang_title: "Confirmer la suppression de la langue",
    purge_lang_desc: 'Êtes-vous sûr de vouloir supprimer/archiver la langue "{title}" ? Cette action est irréversible.',
    cancel_task_title: "Confirmer l'annulation",
    dependency_warning_1: "Ce cours fait partie d'un curriculum actif : \"{title}\". Pour modifier son niveau d'archivage vers le niveau {level}, le curriculum parent doit être archivé au moins au même niveau d'abord.",
    dependency_warning_2: "Voulez-vous archiver le(s) curriculum(s) parent(s) au niveau {level} d'abord, puis archiver ce cours ?",
    cascade_warning_1: "Vous archivez le curriculum \"{title}\" au niveau d'archivage {level}.",
    cascade_warning_2: "Souhaitez-vous également appliquer ce niveau d'archivage aux cours associés de ce curriculum ? ({count} cours trouvés).",
    manual_confirm_desc: "En confirmant, ce nouveau contenu académique sera instantanément poussé dans le pipeline de validation de l'IA pour être assemblé en temps réel.",
    alert_progression_exists: "Le cours de progression \"{title}\" existe déjà dans le catalogue ou dans la file d'attente avec un titre similaire !",
    toast_title_empty: "Le titre du cours/curriculum ne peut pas être vide !",
    toast_similar_exists: "Le cours ou curriculum \"{title}\" existe déjà avec un titre similaire à ce niveau !",
    toast_manual_success: "Proposition académique manuelle ajoutée avec succès !",
    toast_catalog_similar_exists: "Le cours \"{title}\" existe déjà dans le catalogue ou dans la file d'attente avec un titre similaire à ce niveau !",
    toast_translation_in_queue: "La tâche de traduction pour {lang} est déjà dans la file d'attente !",
    toast_already_translated: "Ce cours est déjà traduit en {lang} !",
    alert_revision_in_queue: "La tâche de révision pour {chapter} est déjà dans la file d'attente !",
    alert_revision_scheduled: "Tâche de révision planifiée ! La version du cours a été incrémentée.",
    toast_lang_registered: "La langue {lang} est déjà enregistrée !"
  },
  ES: {
    course_confirm: '¿Está seguro de que desea archivar completamente el curso "{title}"? Esto lo purgará de la base de datos.',
    tutor_confirm: '¿Está seguro de que desea eliminar permanentemente la personalidad "{title}"? Esta acción es irreversible.',
    task_cancel_confirm: '¿Está seguro de que desea cancelar la tarea "{title}"?',
    translation_cancel_error: "La creación de un nuevo idioma no se puede cancelar debido al riesgo de inestabilidad del sitio.",
    purge_badge_title: "Confirmar eliminación",
    purge_badge_desc: '¿Está seguro de que desea eliminar/archivar la medalla "{title}"? Esta acción es irreversible.',
    purge_badge_confirm_btn: "Confirmar eliminación",
    purge_badge_cancel_btn: "Cancelar",
    purge_lang_title: "Confirmar eliminación de idioma",
    purge_lang_desc: '¿Está seguro de que desea eliminar/archivar el idioma "{title}"? Esta acción es irreversible.',
    cancel_task_title: "Confirmar cancelación",
    dependency_warning_1: "Este curso pertenece a planes de estudio activos: \"{title}\". Para establecer este curso en el nivel de archivo {level}, los planes de estudio principales deben archivarse primero en el mismo nivel.",
    dependency_warning_2: "¿Le gustaría archivar los planes de estudio principales al nivel {level} primero y luego proceder con este curso?",
    cascade_warning_1: "Está configurando el plan de estudios \"{title}\" en el nivel de archivo {level}.",
    cascade_warning_2: "¿También le gustaría aplicar este nivel de archivo a todos los cursos secundarios asociados? ({count} cursos encontrados).",
    manual_confirm_desc: "Al confirmar, este nuevo contenido académico se enviará instantáneamente al canal de validación de IA para compilarse en tiempo real.",
    alert_progression_exists: "¡El curso de progresión \"{title}\" ya existe en el catálogo o en la cola con un título similar!",
    toast_title_empty: "¡El título del curso/plan de estudios no puede estar vacío!",
    toast_similar_exists: "¡El curso o plan de estudios \"{title}\" ya existe con un título similar en este nivel!",
    toast_manual_success: "¡Propuesta académica manual agregada con éxito!",
    toast_catalog_similar_exists: "¡El curso \"{title}\" ya existe en el catálogo o en la cola con un título similar en este nivel!",
    toast_translation_in_queue: "¡La tarea de traducción para {lang} ya está en la cola!",
    toast_already_translated: "¡Este curso ya está traducido al {lang}!",
    alert_revision_in_queue: "¡La tarea de revisión para {chapter} ya está en la cola!",
    alert_revision_scheduled: "¡Tarea de revisión programada! La versión del curso se ha incrementado correctamente.",
    toast_lang_registered: "¡El idioma {lang} ya está registrado!"
  },
  DE: {
    course_confirm: 'Sind Sie sicher, dass Sie den Kurs "{title}" vollständig archivieren möchten? Dadurch wird er aus der Datenbank gelöscht.',
    tutor_confirm: 'Sind Sie sicher, dass Sie die Tutor-Persönlichkeit "{title}" dauerhaft löschen möchten? Diese Aktion ist unwiderruflich.',
    task_cancel_confirm: 'Sind Sie sicher, dass Sie die Aufgabe "{title}" abbrechen möchten?',
    translation_cancel_error: "Die Erstellung einer neuen Sprache kann wegen des Risikos von Instabilitäten nicht abgebrochen werden.",
    purge_badge_title: "Löschen Bestätigen",
    purge_badge_desc: 'Sind Sie sicher, dass Sie die Errungenschaft "{title}" löschen/archivieren möchten? Diese Aktion ist unwiderruflich.',
    purge_badge_confirm_btn: "Löschen Bestätigen",
    purge_badge_cancel_btn: "Abbrechen",
    purge_lang_title: "Sprache löschen bestätigen",
    purge_lang_desc: 'Sind Sie sicher, dass Sie die Sprache "{title}" löschen/archivieren möchten? Diese Aktion ist unwiderruflich.',
    cancel_task_title: "Abbruch bestätigen",
    dependency_warning_1: "Dieser Kurs gehört zu aktiven Lehrplänen: \"{title}\". Um diesen Kurs auf Archivierungsebene {level} zu setzen, müssen die übergeordneten Lehrpläne zuerst auf dieselbe Ebene archiviert werden.",
    dependency_warning_2: "Möchten Sie die übergeordneten Lehrpläne zuerst auf Stufe {level} archivieren und dann mit diesem Kurs fortfahren?",
    cascade_warning_1: "Sie setzen den Lehrplan \"{title}\" auf Archivierungsebene {level}.",
    cascade_warning_2: "Möchten Sie diese Archivierungsebene auch auf alle zugeordneten untergeordneten Kurse übertragen? ({count} Kurse gefunden).",
    manual_confirm_desc: "Durch die Bestätigung wird dieser neue akademische Inhalt sofort an die KI-Validierungspipeline gesendet, um in Echtzeit erstellt zu werden.",
    alert_progression_exists: "Der Progressionskurs \"{title}\" existiert bereits im Katalog oder in der Warteschlange mit einem ähnlichen Titel!",
    toast_title_empty: "Kurs-/Lehrplantitel darf nicht leer sein!",
    toast_similar_exists: "Der Kurs oder Lehrplan \"{title}\" existiert bereits mit einem ähnlichen titel auf dieser Stufe!",
    toast_manual_success: "Manuelle akademische Vorlage erfolgreich hinzugefügt!",
    toast_catalog_similar_exists: "Der Kurs \"{title}\" existiert bereits im Katalog oder in der Warteschlange mit einem ähnlichen Titel auf dieser Stufe!",
    toast_translation_in_queue: "Die Übersetzungsaufgabe für {lang} befindet sich bereits in der Warteschlange!",
    toast_already_translated: "Dieser Kurs ist bereits in {lang} übersetzt!",
    alert_revision_in_queue: "Die Überarbeitungsaufgabe für {chapter} befindet sich bereits in der Warteschlange!",
    alert_revision_scheduled: "Überarbeitungsaufgabe geplant! Die Kursversion wurde erfolgreich erhöht.",
    toast_lang_registered: "Die Sprache {lang} is bereits registriert!"
  },
  ZH: {
    course_confirm: "您确定要完全归档课程 \"{title}\" 吗？这将从数据库中清除它。",
    tutor_confirm: "您确定要永久删除导师配置 \"{title}\" 吗？此操作不可逆。",
    task_cancel_confirm: "您确定要取消任务 \"{title}\" 吗？",
    translation_cancel_error: "由于网站不稳定性风险，无法取消新语言的创建任务。",
    purge_badge_title: "确认删除勋章",
    purge_badge_desc: "您确定要删除/归档勋章 \"{title}\" 吗？此操作不可逆。",
    purge_badge_confirm_btn: "确认删除",
    purge_badge_cancel_btn: "取消",
    purge_lang_title: "确认删除语言",
    purge_lang_desc: "您确定要删除/归档语言 \"{title}\" 吗？此操作不可逆。",
    cancel_task_title: "确认取消任务",
    dependency_warning_1: "该课程属于活跃课程体系：\"{title}\"。要将此课程设置为归档级别 {level}，必须先将父级课程体系归档到同一级别。",
    dependency_warning_2: "您是否要先将父级课程体系归档到级别 {level}，然后再继续此课程？",
    cascade_warning_1: "您正在将课程体系 \"{title}\" 设置为归档级别 {level}。",
    cascade_warning_2: "您是否也希望将此归档级别应用于所有关联 of 子课程？（已找到 {count} 门课程）。",
    manual_confirm_desc: "确认后，这一新的学术内容将被立即推送到人工智能验证管道以进行实时构建。",
    alert_progression_exists: "具有相似标题的渐进式课程 \"{title}\" 已经在目录或队列中存在！",
    toast_title_empty: "课程/课程体系标题不能为空！",
    toast_similar_exists: "在此级别中已存在具有相似标题的课程或课程体系 \"{title}\"！",
    toast_manual_success: "手动学术提案添加成功！",
    toast_catalog_similar_exists: "在此级别中，目录或队列中已存在具有相似标题的课程 \"{title}\"！",
    toast_translation_in_queue: "{lang} 的翻译任务已经在队列中！",
    toast_already_translated: "此课程已翻译成 {lang}！",
    alert_revision_in_queue: "{chapter} 的修订任务已经在队列中！",
    alert_revision_scheduled: "已安排修订任务！课程版本已成功递增。",
    toast_lang_registered: "语言 {lang} 已注册！"
  },
  PT: {
    course_confirm: 'Tem certeza que deseja arquivar completamente o curso "{title}"? Isso o purgará do banco de dados.',
    tutor_confirm: 'Tem certeza que deseja excluir permanentemente a personalidade "{title}"? Esta ação é irreversível.',
    task_cancel_confirm: 'Tem certeza que deseja cancelar a tarefa "{title}"?',
    translation_cancel_error: "A criação de um novo idioma não pode ser cancelada devido ao risco de instabilidade do site.",
    purge_badge_title: "Confirmar Exclusão do Emblema",
    purge_badge_desc: 'Tem certeza que deseja excluir/arquivar o emblema "{title}"? Esta ação é irreversível.',
    purge_badge_confirm_btn: "Confirmar Exclusão",
    purge_badge_cancel_btn: "Cancelar",
    purge_lang_title: "Confirmar Exclusão do Idioma",
    purge_lang_desc: 'Tem certeza que deseja excluir/arquivar o idioma "{title}"? Esta ação é irreversível.',
    cancel_task_title: "Confirmar Cancelamento da Tarefa",
    dependency_warning_1: "Este curso pertence a currículos ativos: \"{title}\". Para definir este curso para o nível de arquivamento {level}, os currículos principais devem ser arquivados no mesmo nível primeiro.",
    dependency_warning_2: "Deseja arquivar os currículos principais no nível {level} primeiro e depois prosseguir com este curso?",
    cascade_warning_1: "Você está definindo o currículo \"{title}\" para o nível de arquivamento {level}.",
    cascade_warning_2: "Deseja também aplicar este nível de arquivamento a todos os cursos filhos associados? ({count} cursos encontrados).",
    manual_confirm_desc: "Ao confirmar, este novo conteúdo acadêmico será instantaneamente enviado ao pipeline de validação de IA para ser construído em tempo real.",
    alert_progression_exists: "O curso de progressão \"{title}\" já existe no catálogo ou na fila com um título semelhante!",
    toast_title_empty: "O título do curso/currículo não pode estar vazio!",
    toast_similar_exists: "O curso ou currículo \"{title}\" já existe com um título semelhante neste nível!",
    toast_manual_success: "Proposta acadêmica manual adicionada com sucesso!",
    toast_catalog_similar_exists: "O curso \"{title}\" já existe no catálogo ou na fila com um título semelhante neste nível!",
    toast_translation_in_queue: "A tarefa de tradução para {lang} já está na fila!",
    toast_already_translated: "Este curso já está traduzido para {lang}!",
    alert_revision_in_queue: "A tarefa de revisão para {chapter} já está na fila!",
    alert_revision_scheduled: "Tarefa de revisão agendada! A versão do curso foi incrementada com sucesso.",
    toast_lang_registered: "O idioma {lang} já está registrado!"
  },
  AR: {
    course_confirm: "هل أنت متأكد من رغبتك في أرشفة المقرر \"{title}\" بالكامل؟ سيتم حذفه من قاعدة البيانات.",
    tutor_confirm: "هل أنت متأكد من رغبتك في حذف شخصية المعلم \"{title}\" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.",
    task_cancel_confirm: "هل أنت متأكد من رغبتك في إلغاء المهمة \"{title}\"؟",
    translation_cancel_error: "لا يمكن إلغاء إنشاء لغة جديدة بسبب مخاطر عدم استقرار الموقع.",
    purge_badge_title: "تأكيد حذف الشارة",
    purge_badge_desc: "هل أنت متأكد من رغبتك في حذف/أرشفة الشارة \"{title}\"؟ هذا الإجراء لا يمكن التراجع عنه.",
    purge_badge_confirm_btn: "تأكيد الحذف",
    purge_badge_cancel_btn: "إلغاء",
    purge_lang_title: "تأكيد حذف اللغة",
    purge_lang_desc: "هل أنت متأكد من رغبتك في حذف/أرشفة اللغة \"{title}\"؟ هذا الإجراء لا يمكن التراجع عنه.",
    cancel_task_title: "تأكيد إلغاء المهمة",
    dependency_warning_1: "ينتمي هذا المقرر إلى مناهج نشطة: \"{title}\". لتعيين هذا المقرر إلى مستوى الأرشفة {level}، يجب أرشفة المناهج الأصلية إلى نفس المستوى أولاً.",
    dependency_warning_2: "هل تريد أرشفة المناهج الأصلية إلى المستوى {level} أولاً، ثم المتابعة مع هذا المقرر؟",
    cascade_warning_1: "أنت تقوم بتعيين المنهج \"{title}\" إلى مستوى الأرشفة {level}.",
    cascade_warning_2: "هل تريد أيضاً تطبيق مستوى الأرشفة هذا على جميع المقررات الفرعية المرتبطة؟ (تم العثور على {count} مقرر).",
    manual_confirm_desc: "بالتأكيد، سيتم فوراً دفع هذا المحتوى الأكاديمي الجديد إلى خط أنابيب التحقق من الذكاء الاصطناعي ليتم بناؤه في الوقت الفعلي.",
    alert_progression_exists: "مقرر التقدم \"{title}\" موجود بالفعل في الكتالوج أو في الطابور بعنوان مشابه!",
    toast_title_empty: "لا يمكن أن يكون عنوان المقرر/المنهج فارغاً!",
    toast_similar_exists: "المقرر أو المنهج \"{title}\" موجود بالفعل بعنوان مشابه في هذا المستوى!",
    toast_manual_success: "تمت إضافة المقترح الأكاديمي اليدوي بنجاح!",
    toast_catalog_similar_exists: "المقرر \"{title}\" موجود بالفعل في الكتالوج أو في الطابور بعنوان مشابه في هذا المستوى!",
    toast_translation_in_queue: "مهمة الترجمة لـ {lang} موجودة بالفعل في الطابور!",
    toast_already_translated: "هذا المقرر مترجم بالفعل إلى {lang}!",
    alert_revision_in_queue: "مهمة المراجعة لـ {chapter} موجودة بالفعل في الطابور!",
    alert_revision_scheduled: "تمت جدولة مهمة المراجعة! تم رفع إصدار المقرر بنجاح.",
    toast_lang_registered: "اللغة {lang} مسجلة بالفعل!"
  },
  HI: {
    course_confirm: 'क्या आप वाकई पाठ्यक्रम "{title}" को पूरी तरह से संग्रहीत करना चाहते हैं? इसे डेटाबेस से हटा दिया जाएगा।',
    tutor_confirm: 'क्या आप वाकई ट्यूटर व्यक्तित्व "{title}" को स्थायी रूप से हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।',
    task_cancel_confirm: 'क्या आप वाकई कार्य "{title}" रद्द करना चाहते हैं?',
    translation_cancel_error: "साइट अस्थिरता जोखिम के कारण नई भाषा निर्माण रद्द नहीं किया जा सकता।",
    purge_badge_title: "बैज हटाने की पुष्टि करें",
    purge_badge_desc: 'क्या आप वाकई बैज "{title}" को हटाना/संग्रहीत करना चाहते हैं? यह क्रिया अपरिवर्तनीय है।',
    purge_badge_confirm_btn: "हटाने की पुष्टि करें",
    purge_badge_cancel_btn: "रद्द करें",
    purge_lang_title: "भाषा हटाने की पुष्टि करें",
    purge_lang_desc: 'क्या आप वाकई भाषा "{title}" को हटाना/संग्रहीत करना चाहते हैं? यह क्रिया अपरिवर्तनीय है।',
    cancel_task_title: "कार्य रद्दीकरण की पुष्टि करें",
    dependency_warning_1: "यह पाठ्यक्रम सक्रिय पाठ्यक्रमों से संबंधित है: \"{title}\"। संग्रहण स्तर {level} के लिए, मूल पाठ्यक्रमों को पहले उसी स्तर पर संग्रहीत करना होगा।",
    dependency_warning_2: "क्या आप पहले मूल पाठ्यक्रमों को स्तर {level} पर संग्रहीत करना चाहते हैं?",
    cascade_warning_1: "आप पाठ्यक्रम \"{title}\" को संग्रहण स्तर {level} पर सेट कर रहे हैं।",
    cascade_warning_2: "क्या आप सभी संबद्ध उप-पाठ्यक्रमों पर भी यह संग्रहण स्तर लागू करना चाहते हैं? ({count} पाठ्यक्रम मिले)।",
    manual_confirm_desc: "पुष्टि करने पर, यह नई शैक्षणिक सामग्री तुरंत AI सत्यापन पाइपलाइन में भेजी जाएगी।",
    alert_progression_exists: "प्रगति पाठ्यक्रम \"{title}\" कैटलॉग या कतार में समान शीर्षक के साथ पहले से मौजूद है!",
    toast_title_empty: "पाठ्यक्रम शीर्षक खाली नहीं हो सकता!",
    toast_similar_exists: "पाठ्यक्रम \"{title}\" इस स्तर पर समान शीर्षक के साथ पहले से मौजूद है!",
    toast_manual_success: "मैनुअल शैक्षणिक प्रस्ताव सफलतापूर्वक जोड़ा गया!",
    toast_catalog_similar_exists: "पाठ्यक्रम \"{title}\" इस स्तर पर कैटलॉग या कतार में पहले से मौजूद है!",
    toast_translation_in_queue: "{lang} के लिए अनुवाद कार्य पहले से कतार में है!",
    toast_already_translated: "यह पाठ्यक्रम पहले से {lang} में अनुवादित है!",
    alert_revision_in_queue: "{chapter} के लिए संशोधन कार्य पहले से कतार में है!",
    alert_revision_scheduled: "संशोधन कार्य निर्धारित! पाठ्यक्रम संस्करण सफलतापूर्वक बढ़ाया गया।",
    toast_lang_registered: "भाषा {lang} पहले से पंजीकृत है!"
  },
  UR: {
    course_confirm: 'کیا آپ واقعی کورس "{title}" کو مکمل طور پر آرکائیو کرنا چاہتے ہیں؟ یہ اسے ڈیٹابیس سے ہٹا دے گا۔',
    tutor_confirm: 'کیا آپ واقعی ٹیوٹر شخصیت "{title}" کو مستقل طور پر حذف کرنا چاہتے ہیں؟ یہ عمل ناقابل واپسی ہے۔',
    task_cancel_confirm: 'کیا آپ واقعی کام "{title}" منسوخ کرنا چاہتے ہیں؟',
    translation_cancel_error: "سائٹ کی عدم استحکام کے خطرے کی وجہ سے نئی زبان کی تخلیق منسوخ نہیں کی جا سکتی۔",
    purge_badge_title: "بیج حذف کرنے کی تصدیق کریں",
    purge_badge_desc: 'کیا آپ واقعی بیج "{title}" کو حذف/آرکائیو کرنا چاہتے ہیں؟ یہ عمل ناقابل واپسی ہے۔',
    purge_badge_confirm_btn: "حذف کی تصدیق کریں",
    purge_badge_cancel_btn: "منسوخ کریں",
    purge_lang_title: "زبان حذف کرنے کی تصدیق کریں",
    purge_lang_desc: 'کیا آپ واقعی زبان "{title}" کو حذف/آرکائیو کرنا چاہتے ہیں؟ یہ عمل ناقابل واپسی ہے۔',
    cancel_task_title: "کام منسوخی کی تصدیق کریں",
    dependency_warning_1: "یہ کورس فعال نصاب سے تعلق رکھتا ہے: \"{title}\"۔ آرکائیونگ لیول {level} کے لیے، والدین کے نصاب کو پہلے اسی سطح پر آرکائیو کرنا ضروری ہے۔",
    dependency_warning_2: "کیا آپ پہلے والدین کے نصاب کو سطح {level} پر آرکائیو کرنا چاہتے ہیں؟",
    cascade_warning_1: "آپ نصاب \"{title}\" کو آرکائیونگ لیول {level} پر سیٹ کر رہے ہیں۔",
    cascade_warning_2: "کیا آپ اس آرکائیونگ لیول کو تمام منسلک چائلڈ کورسز پر بھی لاگو کرنا چاہتے ہیں؟ ({count} کورسز ملے)۔",
    manual_confirm_desc: "تصدیق کرنے پر، یہ نیا علمی مواد فوری طور پر AI تصدیق پائپ لائن میں بھیج دیا جائے گا۔",
    alert_progression_exists: "پیش رفت کورس \"{title}\" کیٹلاگ یا قطار میں ملتے جلتے عنوان کے ساتھ پہلے سے موجود ہے!",
    toast_title_empty: "کورس/نصاب کا عنوان خالی نہیں ہو سکتا!",
    toast_similar_exists: "کورس یا نصاب \"{title}\" اس سطح پر ملتے جلتے عنوان کے ساتھ پہلے سے موجود ہے!",
    toast_manual_success: "دستی علمی تجویز کامیابی سے شامل کر دی گئی!",
    toast_catalog_similar_exists: "کورس \"{title}\" اس سطح پر کیٹلاگ یا قطار میں پہلے سے موجود ہے!",
    toast_translation_in_queue: "{lang} کے لیے ترجمہ کام پہلے سے قطار میں ہے!",
    toast_already_translated: "یہ کورس پہلے سے {lang} میں ترجمہ شدہ ہے!",
    alert_revision_in_queue: "{chapter} کے لیے نظر ثانی کام پہلے سے قطار میں ہے!",
    alert_revision_scheduled: "نظر ثانی کام شیڈول ہو گیا! کورس ورژن کامیابی سے بڑھایا گیا۔",
    toast_lang_registered: "زبان {lang} پہلے سے رجسٹرڈ ہے!"
  }
};

export const EXTRA_TOOLTIP_STRINGS: Record<string, Record<string, string>> = {
  EN: {
    "Approve & Promote": "Approve & Promote",
    "Refuse & Backlog": "Refuse & Backlog",
    "Approve to Pipeline Queue": "Approve to Pipeline Queue",
    "Refuse / Archive": "Refuse / Archive",
    "Approve & Revise": "Approve & Revise",
    "Increase Priority": "Increase Priority",
    "Decrease Priority": "Decrease Priority",
    "Pipeline Queue Parameters": "Pipeline Queue Parameters",
    "Configure global parameters and retry policies for the task pipeline.": "Configure global parameters and retry policies for the task pipeline.",
    "Auto-Retry Failed Tasks": "Auto-Retry Failed Tasks",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "Enable to automatically retry tasks that have failed due to database or agent errors.",
    "Auto-Retry Interval": "Auto-Retry Interval",
    "Cooldown delay in hours before a failed task is retried.": "Cooldown delay in hours before a failed task is retried.",
    "Task Retention": "Task Retention",
    "Retention period in days before completed or failed tasks are permanently purged.": "Retention period in days before completed or failed tasks are permanently purged."
  },
  FR: {
    "Approve & Promote": "Approuver & Promouvoir",
    "Refuse & Backlog": "Refuse & Mettre en attente",
    "Approve to Pipeline Queue": "Approuver vers la file d'attente",
    "Refuse / Archive": "Refuser / Archiver",
    "Approve & Revise": "Approuver & Réviser",
    "Increase Priority": "Augmenter la priorité",
    "Decrease Priority": "Diminuer la priorité",
    "Pipeline Queue Parameters": "Paramètres de la File d'Attente",
    "Configure global parameters and retry policies for the task pipeline.": "Configurez les paramètres globaux et les politiques de relance du pipeline.",
    "Auto-Retry Failed Tasks": "Auto-Relance des Échecs",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "Activer pour relancer automatiquement les tâches ayant échoué en raison d'erreurs de base de données ou d'agents.",
    "Auto-Retry Interval": "Intervalle de Relance",
    "Cooldown delay in hours before a failed task is retried.": "Délai en heures avant qu'une tâche échouée ne soit automatiquement relancée.",
    "Task Retention": "Rétention des Tâches",
    "Retention period in days before completed or failed tasks are permanently purged.": "Période de conservation en jours avant que les tâches terminées ou échouées ne soient purgées."
  },
  ES: {
    "Approve & Promote": "Aprobar y Promover",
    "Refuse & Backlog": "Rechazar y Archivar en Backlog",
    "Approve to Pipeline Queue": "Aprobar para cola de pipeline",
    "Refuse / Archive": "Rechazar / Archivar",
    "Approve & Revise": "Aprobar y Revisar",
    "Increase Priority": "Aumentar prioridad",
    "Decrease Priority": "Disminuir prioridad",
    "Pipeline Queue Parameters": "Parámetros de la Cola de Tareas",
    "Configure global parameters and retry policies for the task pipeline.": "Configure los parámetros globales y las políticas de reintento para la cola de tareas.",
    "Auto-Retry Failed Tasks": "Reintento Automático de Fallos",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "Activar para reintentar automáticamente las tareas que han fallado debido a errores de base de datos o agentes.",
    "Auto-Retry Interval": "Intervalo de Reintento",
    "Cooldown delay in hours before a failed task is retried.": "Tiempo de espera en horas antes de que se vuelva a intentar una tarea fallida.",
    "Task Retention": "Retención de Tareas",
    "Retention period in days before completed or failed tasks are permanently purged.": "Período de retención en días antes de que las tareas completadas o fallidas se eliminen permanentemente."
  },
  DE: {
    "Approve & Promote": "Genehmigen & Fördern",
    "Refuse & Backlog": "Ablehnen & Backlog",
    "Approve to Pipeline Queue": "In die Pipeline-Warteschlange aufnehmen",
    "Refuse / Archive": "Ablehnen / Archivieren",
    "Approve & Revise": "Genehmigen & Überarbeiten",
    "Increase Priority": "Priorität erhöhen",
    "Decrease Priority": "Priorität verringern",
    "Pipeline Queue Parameters": "Warteschlangenparameter",
    "Configure global parameters and retry policies for the task pipeline.": "Konfigurieren Sie globale Parameter und Wiederholungsrichtlinien für die Warteschlange.",
    "Auto-Retry Failed Tasks": "Fehlgeschlagene Aufträge wiederholen",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "Aktivieren, um fehlgeschlagene Aufträge automatisch zu wiederholen.",
    "Auto-Retry Interval": "Wiederholungsintervall",
    "Cooldown delay in hours before a failed task is retried.": "Wertezeit in Stunden, bevor ein fehlgeschlagener Auftrag wiederholt wird.",
    "Task Retention": "Aufbewahrungszeitraum",
    "Retention period in days before completed or failed tasks are permanently purged.": "Aufbewahrungsdauer in Tagen, bevor abgeschlossene oder fehlgeschlagene Aufträge gelöscht werden."
  },
  ZH: {
    "Approve & Promote": "批准并晋升",
    "Refuse & Backlog": "拒绝并退回待办",
    "Approve to Pipeline Queue": "批准至流水线队列",
    "Refuse / Archive": "拒绝/归档",
    "Approve & Revise": "批准并修改",
    "Increase Priority": "提高优先级",
    "Decrease Priority": "降低优先级",
    "Pipeline Queue Parameters": "任务管道队列参数",
    "Configure global parameters and retry policies for the task pipeline.": "配置任务管道的全局参数 and 重试策略。",
    "Auto-Retry Failed Tasks": "自动重试失败任务",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "启用此选项可自动重试因数据库或代理错误而失败的任务。",
    "Auto-Retry Interval": "自动重试间隔",
    "Cooldown delay in hours before a failed task is retried.": "失败任务自动重试之前的冷却延迟时间（小时）。",
    "Task Retention": "任务保留时间",
    "Retention period in days before completed or failed tasks are permanently purged.": "已完成或失败的任务被永久清除之前的保留期（天）。"
  },
  PT: {
    "Approve & Promote": "Aprovar & Promover",
    "Refuse & Backlog": "Recusar & Colocar em Espera",
    "Approve to Pipeline Queue": "Aprovar para a Fila de Pipeline",
    "Refuse / Archive": "Recusar / Arquivar",
    "Approve & Revise": "Aprovar & Revisar",
    "Increase Priority": "Aumentar Prioridade",
    "Decrease Priority": "Diminuir Prioridade",
    "Pipeline Queue Parameters": "Parâmetros da Fila de Pipeline",
    "Configure global parameters and retry policies for the task pipeline.": "Configure parâmetros globais e políticas de nova tentativa para o pipeline de tarefas.",
    "Auto-Retry Failed Tasks": "Repetição Automática de Tarefas Falhas",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "Ative para repetir automaticamente tarefas que falharam devido a erros de banco de dados ou agentes.",
    "Auto-Retry Interval": "Intervalo de Repetição Automática",
    "Cooldown delay in hours before a failed task is retried.": "Atraso de espera em horas antes de uma tarefa falha ser repetida.",
    "Task Retention": "Retenção de Tarefas",
    "Retention period in days before completed or failed tasks are permanently purged.": "Período de retenção em dias antes que tarefas concluídas ou falhas sejam eliminadas permanentemente."
  },
  AR: {
    "Approve & Promote": "موافقة وترقية",
    "Refuse & Backlog": "رفض وإضافة للمتأخرات",
    "Approve to Pipeline Queue": "الموافقة على الإدراج في طابور المعالجة",
    "Refuse / Archive": "رفض / أرشفة",
    "Approve & Revise": "موافقة ومراجعة",
    "Increase Priority": "رفع الأولوية",
    "Decrease Priority": "خفض الأولوية",
    "Pipeline Queue Parameters": "معلمات طابور المعالجة",
    "Configure global parameters and retry policies for the task pipeline.": "تكوين المعلمات العامة وسياسات إعادة المحاولة لطابور المهام.",
    "Auto-Retry Failed Tasks": "إعادة المحاولة التلقائية للمهام الفاشلة",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "تفعيل لإعادة المحاولة تلقائياً للمهام التي فشلت بسبب أخطاء قاعدة البيانات أو الوكلاء.",
    "Auto-Retry Interval": "فترة إعادة المحاولة التلقائية",
    "Cooldown delay in hours before a failed task is retried.": "فترة الانتظار بالساعات قبل إعادة محاولة المهمة الفاشلة.",
    "Task Retention": "الاحتفاظ بالمهام",
    "Retention period in days before completed or failed tasks are permanently purged.": "فترة الاحتفاظ بالأيام قبل حذف المهام المكتملة أو الفاشلة نهائياً."
  },
  HI: {
    "Approve & Promote": "अनुमोदित करें & प्रचारित करें",
    "Refuse & Backlog": "अस्वीकार करें & बैकलाग में डालें",
    "Approve to Pipeline Queue": "पाइपलाइन कतार में अनुमोदित करें",
    "Refuse / Archive": "अस्वीकार / संग्रहीत करें",
    "Approve & Revise": "अनुमोदित करें & संशोधित करें",
    "Increase Priority": "प्राथमिकता बढ़ाएं",
    "Decrease Priority": "प्राथमिकता घटाएं",
    "Pipeline Queue Parameters": "पाइपलाइन कतार पैरामीटर",
    "Configure global parameters and retry policies for the task pipeline.": "कार्य पाइपलाइन के लिए वैश्विक पैरामीटर और पुनः प्रयास नीतियाँ कॉन्फ़िगर करें।",
    "Auto-Retry Failed Tasks": "विफल कार्यों का स्वतः पुनः प्रयास",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "डेटाबेस या एजेंट त्रुटियों के कारण विफल कार्यों को स्वतः पुनः प्रयास करने के लिए सक्षम करें।",
    "Auto-Retry Interval": "स्वतः पुनः प्रयास अंतराल",
    "Cooldown delay in hours before a failed task is retried.": "विफल कार्य का पुनः प्रयास करने से पहले घंटों में प्रतीक्षा समय।",
    "Task Retention": "कार्य प्रतिधारण",
    "Retention period in days before completed or failed tasks are permanently purged.": "पूर्ण या विफल कार्यों को स्थायी रूप से हटाए जाने से पहले दिनों में प्रतिधारण अवधि।"
  },
  UR: {
    "Approve & Promote": "منظور کریں & ترقی دیں",
    "Refuse & Backlog": "مسترد کریں & بیک لاگ میں ڈالیں",
    "Approve to Pipeline Queue": "پائپ لائن قطار میں منظور کریں",
    "Refuse / Archive": "مسترد / آرکائیو کریں",
    "Approve & Revise": "منظور کریں & نظر ثانی کریں",
    "Increase Priority": "ترجیح بڑھائیں",
    "Decrease Priority": "ترجیح کم کریں",
    "Pipeline Queue Parameters": "پائپ لائن قطار پیرامیٹرز",
    "Configure global parameters and retry policies for the task pipeline.": "کام کی پائپ لائن کے لیے عالمی پیرامیٹرز اور دوبارہ کوشش کی پالیسیاں ترتیب دیں۔",
    "Auto-Retry Failed Tasks": "ناکام کاموں کی خودکار دوبارہ کوشش",
    "Enable to automatically retry tasks that have failed due to database or agent errors.": "ڈیٹابیس یا ایجنٹ کی خرابیوں کی وجہ سے ناکام کاموں کو خودکار طور پر دوبارہ کوشش کرنے کے لیے فعال کریں۔",
    "Auto-Retry Interval": "خودکار دوبارہ کوشش کا وقفہ",
    "Cooldown delay in hours before a failed task is retried.": "ناکام کام کی دوبارہ کوشش سے پہلے گھنٹوں میں انتظار کا وقت۔",
    "Task Retention": "کام کی برقراری",
    "Retention period in days before completed or failed tasks are permanently purged.": "مکمل یا ناکام کاموں کو مستقل طور پر حذف کیے جانے سے پہلے دنوں میں برقراری کی مدت۔"
  }
};

// ── ACADEMIC LEVEL SYSTEM (10 levels: Foundation→L3) ─────────────────────────
export const ACADEMIC_LEVELS = [
  { value: 'foundation_1', EN: 'Foundation 1 (Ages 6–9)', FR: 'Fondamental 1 (CP–CE2)', ES: 'Fundacional 1 (6–9 años)', DE: 'Grundstufe 1 (6–9 J.)', ZH: '\u57fa\u7840\u4e00\u9636\uff086\u20139\u5c81\uff09' },
  { value: 'foundation_2', EN: 'Foundation 2 (Ages 9–11)', FR: 'Fondamental 2 (CM1–CM2)', ES: 'Fundacional 2 (9–11 años)', DE: 'Grundstufe 2 (9–11 J.)', ZH: '\u57fa\u7840\u4e8c\u9636\uff089\u201311\u5c81\uff09' },
  { value: 'secondary_1', EN: 'Secondary 1 (Ages 11–13)', FR: 'Secondaire 1 (6ème–5ème)', ES: 'Secundaria 1 (11–13 años)', DE: 'Sekundarstufe I-1 (11–13 J.)', ZH: '\u521d\u4e2d\u4e00\u9636\uff0811\u201313\u5c81\uff09' },
  { value: 'secondary_2', EN: 'Secondary 2 (Ages 13–15)', FR: 'Secondaire 2 (4ème–3ème)', ES: 'Secundaria 2 (13–15 años)', DE: 'Sekundarstufe I-2 (13–15 J.)', ZH: '\u521d\u4e2d\u4e8c\u9636\uff0813\u201315\u5c81\uff09' },
  { value: 'preuni_1',     EN: 'Pre-University 1 (Age 15–16)', FR: 'Lycée 1 — Seconde', ES: 'Bachillerato 1 (15–16 años)', DE: 'Gymnasium — Klasse 10', ZH: '\u9ad8\u4e2d\u4e00\u5e74\u7ea7\uff0815\u201316\u5c81\uff09' },
  { value: 'preuni_2',     EN: 'Pre-University 2 (Age 16–17)', FR: 'Lycée 2 — Première', ES: 'Bachillerato 2 (16–17 años)', DE: 'Gymnasium — Klasse 11', ZH: '\u9ad8\u4e2d\u4e8c\u5e74\u7ea7\uff0816\u201317\u5c81\uff09' },
  { value: 'preuni_3',     EN: 'Pre-University 3 — Final Year', FR: 'Lycée 3 — Terminale', ES: 'Bachillerato 3 — Selectividad', DE: 'Abitur — Abschlussklasse', ZH: '\u9ad8\u4e2d\u4e09\u5e74\u7ea7\uff08\u9ad8\u8003\uff09' },
  { value: 'L1',           EN: 'L1 — 1st Year (University)', FR: 'L1 — 1ère Année Universitaire', ES: 'L1 — Primer Año', DE: 'L1 — 1. Studienjahr', ZH: 'L1 — \u5927\u4e00' },
  { value: 'L2',           EN: 'L2 — 2nd Year (University)', FR: 'L2 — 2ème Année Universitaire', ES: 'L2 — Segundo Año', DE: 'L2 — 2. Studienjahr', ZH: 'L2 — \u5927\u4e8c' },
  { value: 'L3',           EN: "L3 — Bachelor's Year", FR: 'L3 — 3ème Année (Licence)', ES: 'L3 — Grado (3er Año)', DE: 'L3 — Bachelor (3. Jahr)', ZH: 'L3 — \u5927\u4e09\uff08\u5b68\u58eb\uff09' },
  { value: 'M1',           EN: 'M1 — 1st Year (Master)', FR: 'M1 — 1ère Année de Master', ES: 'M1 — Máster (1er Año)', DE: 'M1 — Master (1. Jahr)', ZH: 'M1 — \u7814\u4e00' },
  { value: 'M2',           EN: 'M2 — 2nd Year (Master)', FR: 'M2 — 2ème Année de Master', ES: 'M2 — Máster (2o Año)', DE: 'M2 — Master (2. Jahr)', ZH: 'M2 — \u7814\u4e8c' },
  { value: 'beginner',     EN: 'Beginner', FR: 'Débutant', ES: 'Principiante', DE: 'Anfänger', ZH: '初学者' },
  { value: 'intermediate', EN: 'Intermediate', FR: 'Intermédiaire', ES: 'Intermedio', DE: 'Mittelstufe', ZH: '中级' },
  { value: 'advanced',     EN: 'Advanced', FR: 'Avancé', ES: 'Avanzado', DE: 'Fortgeschritten', ZH: '高级' },
  { value: 'expert',       EN: 'Expert', FR: 'Expert', ES: 'Experto', DE: 'Experte', ZH: '专家' },
] as const;

export const DISCIPLINES = [
  { value: 'mathematics',        EN: 'Mathematics', FR: 'Mathématiques', ES: 'Matemáticas', DE: 'Mathematik', ZH: '\u6570\u5b66' },
  { value: 'statistics',         EN: 'Statistics & Probability', FR: 'Statistiques & Probabilités', ES: 'Estadística y Probabilidad', DE: 'Statistik & Wahrscheinlichkeit', ZH: '\u7edf\u8ba1\u4e0e\u6982\u7387\u8bba' },
  { value: 'physics',            EN: 'Physics', FR: 'Physique', ES: 'Física', DE: 'Physik', ZH: '\u7269\u7406\u5b66' },
  { value: 'chemistry',          EN: 'Chemistry', FR: 'Chimie', ES: 'Química', DE: 'Chemie', ZH: '\u5316\u5b66' },
  { value: 'biology',            EN: 'Biology', FR: 'Biologie', ES: 'Biología', DE: 'Biologie', ZH: '\u751f\u7269\u5b66' },
  { value: 'biochemistry',       EN: 'Biochemistry', FR: 'Biochimie', ES: 'Bioquímica', DE: 'Biochemie', ZH: '\u751f\u7269\u5316\u5b66' },
  { value: 'genetics',           EN: 'Genetics', FR: 'Génétique', ES: 'Genética', DE: 'Genetik', ZH: '\u9057\u4f20\u5b66' },
  { value: 'computer_science',   EN: 'Computer Science', FR: 'Informatique', ES: 'Informática', DE: 'Informatik', ZH: '\u8ba1\u7b97\u673a\u79d1\u5b66' },
  { value: 'data_science',       EN: 'Data Science & Analytics', FR: 'Science des Données', ES: 'Ciencia de Datos', DE: 'Datenwissenschaft', ZH: '\u6570\u636e\u79d1\u5b66' },
  { value: 'law',                EN: 'Law', FR: 'Droit', ES: 'Derecho', DE: 'Rechtswissenschaften', ZH: '\u6cd5\u5b66' },
  { value: 'criminology',        EN: 'Criminology', FR: 'Criminologie', ES: 'Criminología', DE: 'Kriminologie', ZH: '\u72af\u7f6a\u5b66' },
  { value: 'political_science',  EN: 'Political Science', FR: 'Science Politique', ES: 'Ciencia Política', DE: 'Politikwissenschaft', ZH: '\u653f\u6cbb\u5b66' },
  { value: 'economics',          EN: 'Economics', FR: 'Économie', ES: 'Economía', DE: 'Wirtschaftswissenschaften', ZH: '\u7ecf\u6d48\u5b66' },
  { value: 'sociology',          EN: 'Sociology', FR: 'Sociologie', ES: 'Sociología', DE: 'Soziologie', ZH: '\u793e\u4f1a\u5b66' },
  { value: 'psychology',         EN: 'Psychology', FR: 'Psychologie', ES: 'Psicología', DE: 'Psychologie', ZH: '\u5fc3\u7406\u5b66' },
  { value: 'social_psychology',  EN: 'Social Psychology', FR: 'Psychologie Sociale', ES: 'Psicología Social', DE: 'Sozialpsychologie', ZH: '\u793e\u4f1a\u5fc3\u7406\u5b66' },
  { value: 'cognitive_science',  EN: 'Cognitive Science', FR: 'Sciences Cognitives', ES: 'Ciencia Cognitiva', DE: 'Kognitionswissenschaft', ZH: '\u8ba1\u7b97\u673a\u79d1\u5b66' },
  { value: 'history',            EN: 'History', FR: 'Histoire', ES: 'Historia', DE: 'Geschichte', ZH: '\u5386\u53f2\u5b66' },
  { value: 'philosophy',         EN: 'Philosophy', FR: 'Philosophie', ES: 'Filosofía', DE: 'Philosophie', ZH: '\u54f2\u5b66' },
  { value: 'theology',           EN: 'Theology', FR: 'Théologie', ES: 'Teología', DE: 'Theologie', ZH: '\u795e\u5b66' },
  { value: 'anthropology',       EN: 'Anthropology', FR: 'Anthropologie', ES: 'Antropología', DE: 'Anthropologie', ZH: '\u4eba\u7c7b\u5b66' },
  { value: 'performing_arts',    EN: 'Performing Arts (Dance & Theater)', FR: 'Arts du Spectacle (Danse & Théâtre)', ES: 'Artes Escénicas (Danza y Teatro)', DE: 'Darstellende Kunst', ZH: '\u8868\u6f14\u827a\u672f\uff08\u821e\u8e45\u4e0e\u620f\u5267\uff09' },
  { value: 'fine_arts',          EN: 'Fine Arts & Design', FR: 'Beaux-Arts & Design', ES: 'Bellas Artes y Diseño', DE: 'Bildende Kunst & Design', ZH: '\u7f8e\u672f\u4e0e\u8bbe\u8ba1' },
  { value: 'musicology',         EN: 'Musicology', FR: 'Musicologie', ES: 'Musicología', DE: 'Musicographie', ZH: '\u97f3\u4e50\u5b66' },
  { value: 'literature',         EN: 'Literature', FR: 'Littérature', ES: 'Literatura', DE: 'Literatur', ZH: '\u6587\u5b66' },
  { value: 'linguistics',        EN: 'Linguistics', FR: 'Linguistique', ES: 'Lingüística', DE: 'Linguistik', ZH: '\u8bed\u8a00\u5b66' },
  { value: 'geography',          EN: 'Geography', FR: 'Géographie', ES: 'Geografía', DE: 'Geographie', ZH: '\u5730\u7406\u5b66' },
  { value: 'geology',            EN: 'Geology & Earth Sciences', FR: 'Géologie & Sciences de la Terre', ES: 'Geología', DE: 'Geologie', ZH: '\u5730\u8d28\u5b66' },
  { value: 'astronomy',          EN: 'Astronomy & Astrophysics', FR: 'Astronomie & Astrophysique', ES: 'Astronomía', DE: 'Astronomie', ZH: '\u5929\u6587\u5b66' },
  { value: 'medicine',           EN: 'Medicine & Surgery', FR: 'Médecine & Chirurgie', ES: 'Medicina', DE: 'Medizin', ZH: '\u533b\u5b66' },
  { value: 'pharmacology',       EN: 'Pharmacology', FR: 'Pharmacologie', ES: 'Farmacología', DE: 'Pharmakologie', ZH: '\u836f\u7406\u5b66' },
  { value: 'neuroscience',       EN: 'Neuroscience', FR: 'Neurosciences', ES: 'Neurociencia', DE: 'Neurowissenschaften', ZH: '\u795e\u7ecf\u79d1\u5b66' },
  { value: 'mechanical_eng',     EN: 'Mechanical Engineering', FR: 'Génie Mécanique', ES: 'Ingeniería Mecánica', DE: 'Maschinenbau', ZH: '\u673a\u68b0\u5de5\u7a0b' },
  { value: 'electrical_eng',     EN: 'Electrical Engineering', FR: 'Génie Électrique', ES: 'Ingeniería Eléctrica', DE: 'Elektrotechnik', ZH: '\u7535\u6c14\u5de5\u7a0b' },
  { value: 'chemical_eng',       EN: 'Chemical Engineering', FR: 'Génie Chimique', ES: 'Ingeniería Química', DE: 'Chemieingenieurwesen', ZH: '\u5316\u5b66\u5de5\u7a0b' },
  { value: 'civil_eng',          EN: 'Civil Engineering', FR: 'Génie Civil', ES: 'Ingeniería Civil', DE: 'Bauingenieurwesen', ZH: '\u571f\u6728\u5de5\u7a0b' },
  { value: 'aerospace_eng',      EN: 'Aerospace Engineering', FR: 'Génie Aérospatial', ES: 'Ingeniería Aeroespacial', DE: 'Luft- und Raumfahrttechnik', ZH: '\u822a\u7a9a\u822a\u5929\u5de5\u7a0b' },
  { value: 'materials_science',  EN: 'Materials Science', FR: 'Science des Matériaux', ES: 'Ciencia de Materiales', DE: 'Materialwissenschaft', ZH: '\u6750\u6599\u79d1\u5b66' },
  { value: 'environmental_sci',  EN: 'Environmental Science', FR: "Sciences de l'Environnement", ES: 'Ciencias Ambientales', DE: 'Umweltwissenschaften', ZH: '\u7269\u7406\u73af\u5883\u5b66' },
  { value: 'management',         EN: 'Business Management', FR: 'Gestion des Affaires', ES: 'Administración de Empresas', DE: 'Betriebswirtschaftslehre', ZH: '\u5de5\u5546\u7ba1\u7406' },
  { value: 'finance',            EN: 'Finance & Accounting', FR: 'Finance & Comptabilité', ES: 'Finanzas y Contabilidad', DE: 'Finanzwesen', ZH: '\u91d1\u878d\u4e0e\u4f1a\u8ba1' },
  { value: 'education',          EN: 'Pedagogy & Education', FR: 'Pédagogie & Éducation', ES: 'Pedagogía y Educación', DE: 'Pädagogik', ZH: '\u6559\u80b2\u5b66' }
] as const;

export const normalizeLevel = (level: string | undefined | null): string => {
  if (!level) return 'beginner';
  const clean = level.trim().toLowerCase();
  const matched = ACADEMIC_LEVELS.find(lvl => lvl.value.toLowerCase() === clean);
  if (matched) return matched.value;
  if (clean === 'l1') return 'L1';
  if (clean === 'l2') return 'L2';
  if (clean === 'l3') return 'L3';
  if (clean === 'm1') return 'M1';
  if (clean === 'm2') return 'M2';
  return clean;
};

export const formatCourseLevelGlobal = (level: string | undefined | null, lang: string) => {
  if (!level) return '101';
  return formatCourseLevel(level, lang);
};

export const getLevelLabel = (value: string, lang: string): string => {
  return formatCourseLevel(value, lang);
};

export const getDisciplineLabel = (value: string, lang: string): string => {
  const disc = DISCIPLINES.find(d => d.value === value);
  if (!disc) return value;
  const k = lang.toUpperCase();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`op_lang_disciplines_${k}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[value]) return parsed[value];
      }
    } catch (e) {
      console.error(e);
    }
  }
  const key = k as keyof typeof disc;
  return (disc[key] as string) || disc.EN;
};

const batchTranslateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (texts.length === 0) return [];
  const targetLower = targetLang.toLowerCase();
  const batchSize = 25;
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const joinedText = batch.join('\n');
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(joinedText)}`);
      if (res.ok) {
        const data = await res.json();
        const translatedJoined = data[0].map((x: any) => x[0]).join('');
        const translatedBatch = translatedJoined.split('\n');
        
        if (translatedBatch.length === batch.length) {
          for (let j = 0; j < batch.length; j++) {
            results.push(translatedBatch[j]?.trim() || batch[j]);
          }
        } else {
          console.warn(`[batchTranslateTexts] Batch length mismatch (${translatedBatch.length} vs ${batch.length}), falling back to item-by-item...`);
          const singleTranslations = await Promise.all(batch.map(async (text) => {
            try {
              const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(text)}`);
              if (r.ok) {
                const d = await r.json();
                return d[0].map((x: any) => x[0]).join('').trim();
              }
            } catch (e) {
              console.error(e);
            }
            return text;
          }));
          results.push(...singleTranslations);
        }
      } else {
        results.push(...batch);
      }
    } catch (err) {
      console.error("[batchTranslateTexts] error:", err);
      results.push(...batch);
    }
  }
  return results;
};

export const translateMetadataForLanguage = async (targetLang: string) => {
  const targetUpper = targetLang.toUpperCase();
  const targetLower = targetLang.toLowerCase();

  // 1. Translate all Academic Levels using static constants
  const translatedLevels: Record<string, string> = {};
  for (const lvl of ACADEMIC_LEVELS) {
    translatedLevels[lvl.value] = (lvl as any)[targetUpper] || lvl.EN;
  }
  localStorage.setItem(`op_lang_levels_${targetLang}`, JSON.stringify(translatedLevels));

  // 2. Translate all Disciplines using static constants
  const translatedDisciplines: Record<string, string> = {};
  for (const disc of DISCIPLINES) {
    translatedDisciplines[disc.value] = (disc as any)[targetUpper] || disc.EN;
  }
  localStorage.setItem(`op_lang_disciplines_${targetLang}`, JSON.stringify(translatedDisciplines));

  // 3. Static dictionary for Socratic Game UI labels to completely bypass translate API
  const gameTranslations: Record<string, string> = {};
  const uiLabels = [
    { key: 'title', val: "The Garden of Socrates" },
    { key: 'subtitle', val: "The server is offline. Harmonize your thoughts while it restores." },
    { key: 'offline_status', val: "Interrupted Connection (503)" },
    { key: 'fragments_label', val: "Fragments of thought" },
    { key: 'construction_label', val: "Constructed thought" },
    { key: 'empty_placeholder', val: "Tap the scrambled fragments below in order..." },
    { key: 'success_label', val: "Wisdom Acquired!" },
    { key: 'attribution_label', val: "Restored thought from" },
    { key: 'solved_label', val: "riddles solved" },
    { key: 'reconnect_btn', val: "Check Connection" },
    { key: 'next_btn', val: "Next" },
    { key: 'reconnect_checking', val: "Checking..." }
  ];

  const socraticUiDict: Record<string, Record<string, string>> = {
    EN: {
      title: "The Garden of Socrates",
      subtitle: "The server is offline. Harmonize your thoughts while it restores.",
      offline_status: "Interrupted Connection (503)",
      fragments_label: "Fragments of thought",
      construction_label: "Constructed thought",
      empty_placeholder: "Tap the scrambled fragments below in order...",
      success_label: "Wisdom Acquired!",
      attribution_label: "Restored thought from",
      solved_label: "riddles solved",
      reconnect_btn: "Check Connection",
      next_btn: "Next",
      reconnect_checking: "Checking..."
    },
    FR: {
      title: "Le Jardin de Socrate",
      subtitle: "Le serveur est hors ligne. Harmonisez vos pensées pendant qu'il se rétablit.",
      offline_status: "Connexion interrompue (503)",
      fragments_label: "Fragments de pensée",
      construction_label: "Pensée construite",
      empty_placeholder: "Appuyez sur les fragments mélangés ci-dessous dans l'ordre...",
      success_label: "Sagesse acquise !",
      attribution_label: "Pensée restaurée de",
      solved_label: "énigmes résolues",
      reconnect_btn: "Vérifier la connexion",
      next_btn: "Suivant",
      reconnect_checking: "Vérification..."
    },
    ES: {
      title: "El Jardín de Sócrates",
      subtitle: "El servidor está desconectado. Armoniza tus pensamientos mientras se restaura.",
      offline_status: "Conexión interrumpida (503)",
      fragments_label: "Fragmentos de pensamiento",
      construction_label: "Pensamiento construido",
      empty_placeholder: "Toca los fragmentos revueltos abajo en orden...",
      success_label: "¡Sabiduría adquirida!",
      attribution_label: "Pensamiento restaurado de",
      solved_label: "acertijos resueltos",
      reconnect_btn: "Verificar conexión",
      next_btn: "Siguiente",
      reconnect_checking: "Verificando..."
    },
    DE: {
      title: "Der Garten des Sokrates",
      subtitle: "Der Server ist offline. Harmonisiere deine Gedanken, während er wiederhergestellt wird.",
      offline_status: "Verbindung unterbrochen (503)",
      fragments_label: "Gedankensplitter",
      construction_label: "Konstruierter Gedanke",
      empty_placeholder: "Tippe die ungeordneten Fragmente unten der Reihe nach an...",
      success_label: "Weisheit erlangt!",
      attribution_label: "Wiederhergestellter Gedanke von",
      solved_label: "Rätsel gelöst",
      reconnect_btn: "Verbindung prüfen",
      next_btn: "Weiter",
      reconnect_checking: "Prüfen..."
    },
    ZH: {
      title: "苏格拉底的花园",
      subtitle: "服务器离线。请在恢复时协调您的想法。",
      offline_status: "连接中断 (503)",
      fragments_label: "思想碎片",
      construction_label: "构建的思想",
      empty_placeholder: "按顺序点击下方打乱的碎片...",
      success_label: "获得智慧！",
      attribution_label: "恢复的思想来自",
      solved_label: "解开的谜题",
      reconnect_btn: "检查连接",
      next_btn: "下一步",
      reconnect_checking: "正在检查..."
    },
    PT: {
      title: "O Jardim de Sócrates",
      subtitle: "O servidor está offline. Harmonize os seus pensamentos enquanto ele se restabelece.",
      offline_status: "Conexão interrompida (503)",
      fragments_label: "Fragmentos de pensamento",
      construction_label: "Pensamento construído",
      empty_placeholder: "Toque nos fragmentos embaralhados abaixo em ordem...",
      success_label: "Sabedoria adquirida!",
      attribution_label: "Pensamento restaurado de",
      solved_label: "enigmas resolvidos",
      reconnect_btn: "Verificar conexão",
      next_btn: "Avançar",
      reconnect_checking: "Verificando..."
    },
    AR: {
      title: "حديقة سقراط",
      subtitle: "الخادم غير متصل بالإنترنت. تناغم مع أفكارك أثناء استعادته.",
      offline_status: "اتصال مقطوع (503)",
      fragments_label: "شظايا الفكر",
      construction_label: "الفكر المبني",
      empty_placeholder: "اضغط على الشظايا المبعثرة أدناه بالترتيب...",
      success_label: "اكتساب الحكمة!",
      attribution_label: "استعادة الفكر من",
      solved_label: "ألغاز تم حلها",
      reconnect_btn: "التحقق من الاتصال",
      next_btn: "التالي",
      reconnect_checking: "جاري التحقق..."
    },
    HI: {
      title: "सुकरात का बगीचा",
      subtitle: "सर्वर ऑफ़लाइन है। इसके पुनर्प्राप्त होने तक अपने विचारों को सामंजस्यपूर्ण बनाएं।",
      offline_status: "बाधित कनेक्शन (503)",
      fragments_label: "विचारों के टुकड़े",
      construction_label: "निर्मित विचार",
      empty_placeholder: "नीचे दिए गए अव्यवस्थित टुकड़ों पर क्रम से टैप करें...",
      success_label: "ज्ञान प्राप्त हुआ!",
      attribution_label: "पुنर्प्राप्त विचार",
      solved_label: "पहेलियाँ सुलझाई गईं",
      reconnect_btn: "कनेक्शन जांचें",
      next_btn: "अगला",
      reconnect_checking: "जांच की जा रही है..."
    },
    UR: {
      title: "سقراط کا باغ",
      subtitle: "سرور آف لائن ہے۔ جب تک یہ بحال نہیں ہوتا، اپنے خیالات کو ہم آہنگ کریں۔",
      offline_status: "منقطع کنکشن (503)",
      fragments_label: "فکر کے ٹکڑے",
      construction_label: "تعمیر شدہ فکر",
      empty_placeholder: "نیچے دیئے گئے بکھرے ہوئے ٹکڑوں پر ترتیب سے ٹیپ کریں...",
      success_label: "حکمت حاصل ہو گئی!",
      attribution_label: "بحال شدہ فکر منجانب",
      solved_label: "پہیلیاں حل ہو گئیں",
      reconnect_btn: "کنکشن چیک کریں",
      next_btn: "اگla",
      reconnect_checking: "چیک کیا جا رہا ہے..."
    }
  };

  const localizedUi = socraticUiDict[targetUpper] || socraticUiDict.EN;
  for (const ui of uiLabels) {
    gameTranslations[ui.key] = localizedUi[ui.key] || ui.val;
  }

  // 4. Localize Socratic Game Quotes with complete static maps
  const baseQuotes = [
    { sentence: "I only know that I know nothing", author: "Socrates" },
    { sentence: "Education is the kindling of a flame", author: "Plato" },
    { sentence: "Wisdom begins with the definition of terms", author: "Confucius" },
    { sentence: "The mind is everything, what you think you become", author: "Buddha" },
    { sentence: "It is not because things are difficult that we do not dare", author: "Seneca" },
    { sentence: "The quality of your life depends upon the quality of your thoughts", author: "Marcus Aurelius" },
    { sentence: "A journey of a thousand miles begins with a single step", author: "Lao Tzu" },
    { sentence: "Good speech is rarer than emerald", author: "Ptahhotep" },
    { sentence: "I think therefore I am", author: "Descartes" },
    { sentence: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself", author: "Rumi" }
  ];

  const localizedQuotesDict: Record<string, { sentence: string; author: string }[]> = {
    EN: baseQuotes,
    FR: [
      { sentence: "Je sais seulement que je ne sais rien", author: "Socrate" },
      { sentence: "L'éducation est l'allumage d'une flamme", author: "Platon" },
      { sentence: "La sagesse commence par la définition des termes", author: "Confucius" },
      { sentence: "L'esprit est tout, ce que vous pensez, vous le devenez", author: "Bouddha" },
      { sentence: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas", author: "Sénèque" },
      { sentence: "La qualité de votre vie dépend de la qualité de vos pensées", author: "Marc Aurèle" },
      { sentence: "Un voyage de mille milles commence par un seul pas", author: "Lao Tseu" },
      { sentence: "La bonne parole est plus rare que l'émeraude", author: "Ptahhotep" },
      { sentence: "Je pense, donc je suis", author: "Descartes" },
      { sentence: "Hier j'étais intelligent et je voulais changer le monde. Aujourd'hui je suis sage, alors je me change moi-même", author: "Rumi" }
    ],
    ES: [
      { sentence: "Solo sé que no sé nada", author: "Sócrates" },
      { sentence: "La educación es encender una llama", author: "Platón" },
      { sentence: "La sabiduría comienza con la definición de los términos", author: "Confucio" },
      { sentence: "La mente lo es todo, lo que piensas te conviertes", author: "Buda" },
      { sentence: "No es porque las cosas sean difíciles que no nos atrevemos", author: "Séneca" },
      { sentence: "La calidad de tu vida depende de la calidad de tus pensamientos", author: "Marco Aurelio" },
      { sentence: "Un viaje de mil millas comienza con un solo paso", author: "Lao Tse" },
      { sentence: "El buen hablar es más raro que la esmeralda", author: "Ptahhotep" },
      { sentence: "Pienso, luego existo", author: "Descartes" },
      { sentence: "Ayer era inteligente, así que quería cambiar el mundo. Hoy soy sabio, así que me estoy cambiando a mí mismo", author: "Rumi" }
    ],
    DE: [
      { sentence: "Ich weiß nur, dass ich nichts weiß", author: "Sokrates" },
      { sentence: "Bildung ist das Entzünden einer Flamme", author: "Plato" },
      { sentence: "Weisheit beginnt mit der Definition von Begriffen", author: "Konfuzius" },
      { sentence: "Der Geist ist alles, was du denkst, das wirst du", author: "Buddha" },
      { sentence: "Nicht weil es schwer ist, wagen wir es nicht", author: "Seneca" },
      { sentence: "Die Qualität deines Lebens hängt von der Qualität deiner Gedanken ab", author: "Marcus Aurelius" },
      { sentence: "Eine Reise von tausend Meilen beginnt mit einem einzigen Schritt", author: "Lao Tzu" },
      { sentence: "Gute Rede ist seltener als Smaragd", author: "Ptahhotep" },
      { sentence: "Ich denke, also bin ich", author: "Descartes" },
      { sentence: "Gestern war ich klug, also wollte ich die Welt verändern. Heute bin ich weise, also verändere ich mich selbst", author: "Rumi" }
    ],
    ZH: [
      { sentence: "我只知道我一无所知", author: "苏格拉底" },
      { sentence: "教育是点燃火焰", author: "柏拉图" },
      { sentence: "智慧从定义术语开始", author: "孔子" },
      { sentence: "心是一切，你想什么就成为什么", author: "佛陀" },
      { sentence: "不是因为事情困难我们才不敢，而是因为我们不敢事情才困难", author: "塞涅卡" },
      { sentence: "你生活的质量取决于你思想的质量", author: "马可·奥勒留" },
      { sentence: "千里之行，始于足下", author: "老子" },
      { sentence: "良言比翡翠更罕见", author: "普塔霍特普" },
      { sentence: "我思故我在", author: "笛卡尔" },
      { sentence: "昨天我很聪明，所以我想改变世界。今天我有智慧，所以我正在改变自己", author: "鲁米" }
    ],
    PT: [
      { sentence: "Só sei que nada sei", author: "Sócrates" },
      { sentence: "A educação é acender uma chama", author: "Platão" },
      { sentence: "A sabedoria começa com a definição dos termos", author: "Confúcio" },
      { sentence: "A mente é tudo, o que você pensa você se torna", author: "Buda" },
      { sentence: "Não é porque as coisas são difíceis que não ousamos", author: "Sêneca" },
      { sentence: "A qualidade da sua vida depende da qualidade dos seus pensamentos", author: "Marco Aurélio" },
      { sentence: "Uma jornada de mil milhas começa com um único passo", author: "Lao Tzu" },
      { sentence: "A boa fala é mais rara que a esmeralda", author: "Ptahhotep" },
      { sentence: "Penso, logo existo", author: "Descartes" },
      { sentence: "Ontem eu era inteligente, então queria mudar o mundo. Hoje sou sábio, então estou mudando a mim mesmo", author: "Rumi" }
    ],
    AR: [
      { sentence: "أنا فقط أعرف أنني لا أعرف شيئًا", author: "سقراط" },
      { sentence: "التعليم هو إشعال شعلة", author: "أفلاطون" },
      { sentence: "تبدأ الحكمة بتعريف المصطلحات", author: "كونفوشيوس" },
      { sentence: "العقل هو كل شيء، ما تفكر فيه تصبح عليه", author: "بوذا" },
      { sentence: "ليس لأن الأشياء صعبة لا نجرؤ", author: "سينيكا" },
      { sentence: "تعتمد جودة حياتك على جودة أفكارك", author: "ماركوس أوريليوس" },
      { sentence: "رحلة الألف ميل تبدأ بخطوة واحدة", author: "لاو تزو" },
      { sentence: "الكلام الطيب أندر من الزمرد", author: "بتاح حتب" },
      { sentence: "أنا أفكر، إذن أنا موجود", author: "ديكارت" },
      { sentence: "بالأمس كنت ذكياً فأردت تغيير العالم، اليوم أنا حكيم فسأغير نفسي", author: "جلال الدين الرومي" }
    ],
    HI: [
      { sentence: "मैं केवल यही जानता हूँ कि मैं कुछ नहीं जानता", author: "सुकरात" },
      { sentence: "शिक्षा एक लौ प्रज्वलित करना है", author: "प्लेटो" },
      { sentence: "बुद्धिमानी शब्दों की परिभाषा से शुरू होती है", author: "कन्फ्यूशियस" },
      { sentence: "मन ही सब कुछ है, जो आप सोचते हैं वही बन जाते हैं", author: "बुद्ध" },
      { sentence: "ऐसा नहीं है कि चीजें कठिन हैं इसलिए हम हिम्मत नहीं करते", author: "सेनेका" },
      { sentence: "आपके जीवन की गुणवत्ता आपके विचारों की गुणवत्ता पर निर्भर करती है", author: "मार्कस ऑरेलियस" },
      { sentence: "हजारों मील की यात्रा एक कदम से शुरू होती है", author: "लाओ त्ज़ु" },
      { sentence: "अच्छा भाषण पन्ने से भी दुर्लभ है", author: "प्ताहहोटेप" },
      { sentence: "मैं सोचता हूँ, इसलिए मैं हूँ", author: "डेसकार्टेस" },
      { sentence: "कल मैं चतुर था, इसलिए मैं दुनिया बदलना चाहता था। आज मैं बुद्धिमान हूँ, इसलिए मैं खुद को बदल रहा हूँ", author: "रूमी" }
    ],
    UR: [
      { sentence: "میں صرف اتنا جانتا ہوں کہ میں کچھ نہیں جانتا", author: "سقراط" },
      { sentence: "تعلیم ایک شعلہ بھڑکانا ہے", author: "افلاطون" },
      { sentence: "حکمت اصطلاحات کی تعریف سے شروع ہوتی ہے", author: "کونفیوشس" },
      { sentence: "ذہن ہی سب کچھ ہے، جو آپ سوچتے ہیں وہی بن جاتے ہیں", author: "بدھ" },
      { sentence: "ایسا نہیں ہے کہ چیزیں مشکل ہیں اس لیے ہم ہمت نہیں کرتے", author: "سینیکا" },
      { sentence: "آپ کی زندگی کا معیار آپ کے خیالات کے معیار پر منحصر ہے", author: "مارکس اوریلیئس" },
      { sentence: "ہزار میل کا سفر ایک قدم سے شروع ہوتا ہے", author: "لاؤ تزو" },
      { sentence: "اچھی بات چیت زمرد سے بھی زیادہ نایاب ہے", author: "پتاح حتب" },
      { sentence: "میں سوچتا ہوں، اس لیے میں ہوں", author: "ڈی کارٹ" },
      { sentence: "کل میں چالاک تھا، اس لیے میں دنیا بدلنا چاہتا تھا۔ آج میں عقلمند ہوں، اس لیے میں خود کو بدل رہا ہوں", author: "رومی" }
    ]
  };

  const localizedQuotes = localizedQuotesDict[targetUpper] || baseQuotes;
  gameTranslations['quotes'] = JSON.stringify(localizedQuotes);
  localStorage.setItem(`op_lang_game_${targetLang}`, JSON.stringify(gameTranslations));

  // 5. Dynamic translation of the cockpit dictionaries: COCKPIT_DICTIONARY, LOCALIZED_POPUPS, CURRICULUM_STRINGS, EXTRA_TOOLTIP_STRINGS
  try {
    console.log(`[translateMetadataForLanguage] Dynamic batch translation started for cockpit dictionary to: ${targetUpper}`);
    
    const translateRecord = async (sourceRecord: Record<string, string>): Promise<Record<string, string>> => {
      const keys = Object.keys(sourceRecord);
      const values = keys.map(k => sourceRecord[k]);
      const translatedValues = await batchTranslateTexts(values, targetLower);
      
      const resultRecord: Record<string, string> = {};
      for (let i = 0; i < keys.length; i++) {
        resultRecord[keys[i]] = translatedValues[i] || values[i];
      }
      return resultRecord;
    };

    // A. COCKPIT_DICTIONARY (en)
    const translatedCockpit = await translateRecord(COCKPIT_DICTIONARY.EN);
    localStorage.setItem(`op_lang_cockpit_dict_${targetLang}`, JSON.stringify(translatedCockpit));
    (COCKPIT_DICTIONARY as any)[targetUpper] = translatedCockpit;

    // B. LOCALIZED_POPUPS (EN)
    const translatedPopups = await translateRecord(LOCALIZED_POPUPS.EN);
    localStorage.setItem(`op_lang_localized_popups_${targetLang}`, JSON.stringify(translatedPopups));
    (LOCALIZED_POPUPS as any)[targetUpper] = translatedPopups;

    // C. CURRICULUM_STRINGS (EN)
    const translatedCurriculum = await translateRecord(CURRICULUM_STRINGS.EN);
    localStorage.setItem(`op_lang_curriculum_strings_${targetLang}`, JSON.stringify(translatedCurriculum));
    (CURRICULUM_STRINGS as any)[targetUpper] = translatedCurriculum;

    // D. EXTRA_TOOLTIP_STRINGS (EN)
    const translatedTooltips = await translateRecord(EXTRA_TOOLTIP_STRINGS.EN);
    localStorage.setItem(`op_lang_extra_tooltips_${targetLang}`, JSON.stringify(translatedTooltips));
    (EXTRA_TOOLTIP_STRINGS as any)[targetUpper] = translatedTooltips;

    console.log(`[translateMetadataForLanguage] Dynamic batch translation completed successfully for ${targetUpper}!`);
  } catch (err) {
    console.error("[translateMetadataForLanguage] Error translating cockpit dictionaries dynamically:", err);
  }
};

export const POTENTIAL_CURRICULA = [
  {
    title: "Tronc Commun L1 Sciences",
    level: "L1",
    subject: "Physics",
    childCourses: [1, 3, 8],
    description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire."
  },
  {
    title: "L1 Biology Curriculum — Fundamentals",
    level: "L1",
    subject: "Biology",
    childCourses: [13, 14, 15, 16, 17],
    description: "Complete first-year Biology Bachelor curriculum. Covers cell biology, molecular genetics, structural biochemistry, microbiology, and general ecology."
  },
  {
    title: "Sovereign AI Mastery Curriculum",
    level: "L2",
    subject: "Mathematics",
    childCourses: [7, 8, 11],
    description: "An elite academic syllabus detailing dynamic artificial intelligence systems, sovereign LLMs, and neural grid controllers."
  }
];

// Initialize dynamic cockpit dictionaries from localStorage on startup in the browser
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      if (key.startsWith('op_lang_cockpit_dict_')) {
        const langCode = key.substring('op_lang_cockpit_dict_'.length).toUpperCase();
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (COCKPIT_DICTIONARY as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic cockpit dictionary for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_localized_popups_')) {
        const langCode = key.substring('op_lang_localized_popups_'.length).toUpperCase();
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (LOCALIZED_POPUPS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic localized popups for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_curriculum_strings_')) {
        const langCode = key.substring('op_lang_curriculum_strings_'.length).toUpperCase();
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (CURRICULUM_STRINGS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic curriculum strings for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_extra_tooltips_')) {
        const langCode = key.substring('op_lang_extra_tooltips_'.length).toUpperCase();
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (EXTRA_TOOLTIP_STRINGS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic extra tooltips for ${langCode}:`, e);
        }
      }
    }
  } catch (err) {
    console.error("Error loading dynamic locales from localStorage into exported dictionaries:", err);
  }
}
