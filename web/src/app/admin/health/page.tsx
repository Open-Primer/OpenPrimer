'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Database, Mail, Cpu, Image, RefreshCw,
  CheckCircle, AlertTriangle, WifiOff, ExternalLink, Clock,
  Lock, Eye, EyeOff
} from 'lucide-react';
import { useServiceStatus, ServiceHealth } from '../../../lib/serviceStatus';
import { dbService, progressService } from '../../../lib/db';
import { useLanguage } from '@/context/LanguageContext';

// ÔöÇÔöÇÔöÇ i18n ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const HEALTH_STRINGS = {
  EN: {
    title: 'Server Health',
    subtitle: 'Real-time monitoring of all external service dependencies',
    refresh: 'Refresh Now',
    refreshing: 'CheckingÔÇª',
    last_checked: 'Checked',
    latency: 'Latency',
    endpoint: 'Endpoint',
    status_ok: 'Operational',
    status_degraded: 'Degraded',
    status_offline: 'Offline',
    status_unauthorized: 'Auth Required',
    status_unknown: 'Unknown',
    health_db: 'Supabase Database',
    health_email: 'Resend Email API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Image Generator)',
    health_smithsonian: 'Smithsonian Open Access API',
    health_unsplash: 'Unsplash Photography API',
    db_desc: 'Primary PostgreSQL database ÔÇö authentication, courses, achievements, search logs.',
    email_desc: 'Transactional email delivery ÔÇö account verification, notifications.',
    ai_desc: 'Generative AI backbone ÔÇö badge prompts, translations, analytics reports, tutor chat.',
    images_desc: 'AI image generation for academic achievement badges.',
    smithsonian_desc: 'Smithsonian Museum API ÔÇö resolves educational resources and public domain historical images.',
    unsplash_desc: 'Unsplash Image API ÔÇö resolves high-quality photography and modern educational assets.',
    auto_refresh: 'Auto-refreshes every 10 seconds',
    ms: 'ms',
    not_configured: 'Not configured',
    error: 'Error detail',    sla_title: "Dependency SLA & Downtime Over Last 365 Days",
    sla_desc: "Rolling annual service level agreement (SLA) status, aggregated incident tracking, and average latency offsets.",
    lbl_database: "Database",
    lbl_email: "Email Relay",
    lbl_ai: "AI LLM Backend",
    lbl_images: "Image Engine",
    lbl_smithsonian: "Smithsonian API",
    lbl_unsplash: "Unsplash API",
    no_data: "No data",
    db_conn_req: "Database connection required",
    no_downtime: "No downtime",
    downtime_min: "Downtime: {min}m",
    downtime_hour: "Downtime: {hour}h",
    no_major_incidents: "No major incidents",
    inc_db_upgrade: "Incident: Replica DB upgrade",
    inc_rate_limit: "Incident: Rate-limit tuning",
    inc_quota_scaling: "Incident: LLM quota scaling",
    inc_oom: "Incident: Batch out-of-memory",
    inc_smithsonian: "Incident: Smithsonian rate-limiting",
    inc_unsplash: "Incident: Unsplash credit exhaustion",
    status_nominal: "Nominal",
    status_no_data: "No Log Data",
    status_outage: "Outage",
    sla_grid_title: "Rolling Service Availability Grid (Last 365 Days Timeline)",
    overall_avg: "Overall Average",
    no_avail_data: "No availability data ÔÇö Active database connection required",
    days_ago: "365 Days Ago",
    today: "Today",
    keys_applied: "API Keys successfully hot-swapped!",
    keys_reset: "Returned to default server keys.",
    live_db: "Live DB",
    sandbox: "Sandbox",
    sys_all_nominal: "All systems nominal",
    sys_unreachable: "One or more services are unreachable"
  },
  FR: {
    title: 'Sant├® des Serveurs',
    subtitle: 'Surveillance en temps r├®el de toutes les d├®pendances externes',
    refresh: 'Rafra├«chir',
    refreshing: 'V├®rificationÔÇª',
    last_checked: 'V├®rifi├®',
    latency: 'Latence',
    endpoint: 'Endpoint',
    status_ok: 'Op├®rationnel',
    status_degraded: 'D├®grad├®',
    status_offline: 'Hors ligne',
    status_unauthorized: 'Auth Requise',
    status_unknown: 'Inconnu',
    health_db: 'Base de donn├®es Supabase',
    health_email: 'API Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (G├®n├®ration d\'Images)',
    health_smithsonian: 'API Smithsonian Open Access',
    health_unsplash: 'API Unsplash Photographie',
    db_desc: 'Base de donn├®es PostgreSQL principale ÔÇö authentification, cours, badges, journaux de recherche.',
    email_desc: 'Envoi d\'emails transactionnels ÔÇö v├®rification de compte, notifications.',
    ai_desc: 'Moteur IA g├®n├®ratif ÔÇö prompts de badges, traductions, rapports analytiques, chat tuteur.',
    images_desc: 'G├®n├®ration d\'images IA pour les badges d\'accomplissement acad├®mique.',
    smithsonian_desc: 'API Mus├®e Smithsonian ÔÇö r├®sout les ressources ├®ducatives et images historiques du domaine public.',
    unsplash_desc: 'API Images Unsplash ÔÇö r├®sout les photographies de haute qualit├® et les images ├®ducatives modernes.',
    auto_refresh: 'Actualisation automatique toutes les 10 secondes',
    ms: 'ms',
    not_configured: 'Non configur├®',
    error: 'D├®tail de l\'erreur',    sla_title: "SLA de Disponibilit├® sur les 365 Derniers Jours",
    sla_desc: "Indicateurs de performance r├®seau et taux de disponibilit├® cumul├®s du catalogue de services.",
    lbl_database: "Base de donn├®es",
    lbl_email: "Relais Email",
    lbl_ai: "Backend IA (LLM)",
    lbl_images: "Moteur d'Images",
    lbl_smithsonian: "API Smithsonian",
    lbl_unsplash: "API Unsplash",
    no_data: "Aucune donn├®e",
    db_conn_req: "Connexion base de donn├®es requise",
    no_downtime: "Aucune interruption",
    downtime_min: "Indisponibilit├® : {min} min",
    downtime_hour: "Indisponibilit├® : {hour} h",
    no_major_incidents: "Aucun incident majeur",
    inc_db_upgrade: "Incident : Mise ├á jour r├®plique",
    inc_rate_limit: "Incident : Ajustement quota",
    inc_quota_scaling: "Incident : ├ëchelle de quota",
    inc_oom: "Incident : D├®passement m├®moire",
    inc_smithsonian: "Incident : Limitation de d├®bit Smithsonian",
    inc_unsplash: "Incident : ├ëpuisement des cr├®dits Unsplash",
    status_nominal: "Nominal",
    status_no_data: "Pas de Log",
    status_outage: "Interruption",
    sla_grid_title: "Calendrier Annuel de Disponibilit├® (365 Jours)",
    overall_avg: "Moyenne Globale",
    no_avail_data: "Aucune donn├®e de disponibilit├® ÔÇö Connexion base de donn├®es active requise",
    days_ago: "Il y a 365 Jours",
    today: "Aujourd'hui",
    keys_applied: "Cl├®s API appliqu├®es avec succ├¿s ├á chaud !",
    keys_reset: "Retour aux cl├®s serveurs par d├®faut.",
    live_db: "BDD en Direct",
    sandbox: "Bac ├á Sable",
    sys_all_nominal: "Tous les syst├¿mes sont op├®rationnels",
    sys_unreachable: "Un ou plusieurs services sont inaccessibles"
  },
  ES: {
    title: 'Estado del Servidor',
    subtitle: 'Monitoreo en tiempo real de todas las dependencias externas',
    refresh: 'Actualizar',
    refreshing: 'VerificandoÔÇª',
    last_checked: 'Verificado',
    latency: 'Latencia',
    endpoint: 'Endpoint',
    status_ok: 'Operacional',
    status_degraded: 'Degradado',
    status_offline: 'Sin conexi├│n',
    status_unauthorized: 'Auth Requerido',
    status_unknown: 'Desconocido',
    health_db: 'Base de datos Supabase',
    health_email: 'API de Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (Generador de Im├ígenes)',
    health_smithsonian: 'API de Acceso Abierto Smithsonian',
    health_unsplash: 'API de Fotograf├¡a Unsplash',
    db_desc: 'Base de datos PostgreSQL principal ÔÇö autenticaci├│n, cursos, logros, registros de b├║squeda.',
    email_desc: 'Entrega de correos transaccionales ÔÇö verificaci├│n de cuenta, notificaciones.',
    ai_desc: 'Motor de IA generativa ÔÇö prompts de insignias, traducciones, informes anal├¡ticos, chat de tutor.',
    images_desc: 'Generaci├│n de im├ígenes IA para insignias de logros acad├®micos.',
    smithsonian_desc: 'API del Museo Smithsonian ÔÇö resuelve recursos educativos e im├ígenes hist├│ricas de dominio p├║blico.',
    unsplash_desc: 'API de Im├ígenes Unsplash ÔÇö resuelve fotograf├¡as de alta calidad e im├ígenes educativas modernas.',
    auto_refresh: 'Actualizaci├│n autom├ítica cada 10 segundos',
    ms: 'ms',
    not_configured: 'No configurado',
    error: 'Detalle del error',    sla_title: "SLA de Dependencia y Tiempo de Inactividad en los ├Ültimos 365 D├¡as",
    sla_desc: "Estado de SLA anual, seguimiento de incidentes acumulados y compensaciones de latencia promedio.",
    lbl_database: "Base de datos",
    lbl_email: "Rel├® de Correo",
    lbl_ai: "Backend de IA (LLM)",
    lbl_images: "Motor de Im├ígenes",
    lbl_smithsonian: "API Smithsonian",
    lbl_unsplash: "API Unsplash",
    no_data: "Sin datos",
    db_conn_req: "Se requiere conexi├│n a la base de datos",
    no_downtime: "Sin tiempo de inactividad",
    downtime_min: "Inactividad: {min}m",
    downtime_hour: "Inactividad: {hour}h",
    no_major_incidents: "Sin incidentes mayores",
    inc_db_upgrade: "Incidente: Actualizaci├│n de r├®plica",
    inc_rate_limit: "Incidente: Ajuste de l├¡mite de tasa",
    inc_quota_scaling: "Incidente: Escalamiento de cuota de LLM",
    inc_oom: "Incidente: Memoria agotada en lote",
    inc_smithsonian: "Incidente: L├¡mite de tasa de Smithsonian",
    inc_unsplash: "Incidente: Agotamiento de cr├®ditos de Unsplash",
    status_nominal: "Nominal",
    status_no_data: "Sin Datos de Log",
    status_outage: "Interrupci├│n",
    sla_grid_title: "Cuadr├¡cula de Disponibilidad de Servicio (L├¡nea de Tiempo de 365 D├¡as)",
    overall_avg: "Promedio General",
    no_avail_data: "Sin datos de disponibilidad ÔÇö Se requiere conexi├│n activa a la base de datos",
    days_ago: "Hace 365 D├¡as",
    today: "Hoy",
    keys_applied: "┬íClaves API aplicadas con ├®xito en caliente!",
    keys_reset: "Se restablecieron las claves del servidor predeterminadas.",
    live_db: "BD en Vivo",
    sandbox: "Entorno de Pruebas",
    sys_all_nominal: "Todos los sistemas est├ín operativos",
    sys_unreachable: "Uno o m├ís servicios no est├ín disponibles"
  },
  DE: {
    title: 'Server-Gesundheit',
    subtitle: 'Echtzeit-├£berwachung aller externen Dienstabh├ñngigkeiten',
    refresh: 'Jetzt aktualisieren',
    refreshing: '├£berpr├╝fungÔÇª',
    last_checked: 'Gepr├╝ft',
    latency: 'Latenz',
    endpoint: 'Endpunkt',
    status_ok: 'Betriebsbereit',
    status_degraded: 'Eingeschr├ñnkt',
    status_offline: 'Offline',
    status_unauthorized: 'Auth Erforderlich',
    status_unknown: 'Unbekannt',
    health_db: 'Supabase Datenbank',
    health_email: 'Resend E-Mail API',
    health_ai: 'Gemini KI (Google)',
    health_images: 'Pollinations.ai (Bildgenerator)',
    health_smithsonian: 'Smithsonian Open Access API',
    health_unsplash: 'Unsplash Fotografie API',
    db_desc: 'Prim├ñre PostgreSQL-Datenbank ÔÇö Authentifizierung, Kurse, Abzeichen, Suchprotokolle.',
    email_desc: 'Transaktionale E-Mail-Zustellung ÔÇö Kontobest├ñtigung, Benachrichtigungen.',
    ai_desc: 'Generative KI-Engine ÔÇö Abzeichen-Prompts, ├£bersetzungen, Analyseberichte, Tutor-Chat.',
    images_desc: 'KI-Bildgenerierung f├╝r akademische Leistungsabzeichen.',
    smithsonian_desc: 'Smithsonian Museum API ÔÇö l├Âst Bildungsressourcen und historische Bilder im gemeinfreien Bereich auf.',
    unsplash_desc: 'Unsplash-Bild-API ÔÇö l├Âst hochwertige Fotografien und moderne Bildungsressourcen auf.',
    auto_refresh: 'Automatische Aktualisierung alle 10 Sekunden',
    ms: 'ms',
    not_configured: 'Nicht konfiguriert',
    error: 'Fehlerdetail',    sla_title: "Abh├ñngigkeits-SLA & Ausfallzeiten der letzten 365 Tage",
    sla_desc: "Fortlaufender SLA-Status f├╝r das Gesamtjahr, aggregierte Incident-Verfolgung und durchschnittliche Latenzzeit.",
    lbl_database: "Datenbank",
    lbl_email: "E-Mail-Relay",
    lbl_ai: "KI-LLM-Backend",
    lbl_images: "Bild-Engine",
    lbl_smithsonian: "Smithsonian API",
    lbl_unsplash: "Unsplash API",
    no_data: "Keine Daten",
    db_conn_req: "Datenbankverbindung erforderlich",
    no_downtime: "Keine Ausfallzeit",
    downtime_min: "Ausfallzeit: {min} Min.",
    downtime_hour: "Ausfallzeit: {hour} Std.",
    no_major_incidents: "Keine gr├Â├ƒeren Incidents",
    inc_db_upgrade: "Incident: Replik-Datenbank-Upgrade",
    inc_rate_limit: "Incident: Ratenlimit-Anpassung",
    inc_quota_scaling: "Incident: LLM-Kontingentskalierung",
    inc_oom: "Incident: Stapel-Speicher├╝berlauf",
    inc_smithsonian: "Incident: Smithsonian-Ratenbegrenzung",
    inc_unsplash: "Incident: Unsplash-Guthabenersch├Âpfung",
    status_nominal: "Nominal",
    status_no_data: "Keine Logdaten",
    status_outage: "Ausfall",
    sla_grid_title: "Fortlaufendes Service-Verf├╝gbarkeitsraster (Zeitachse der letzten 365 Tage)",
    overall_avg: "Gesamtdurchschnitt",
    no_avail_data: "Keine Verf├╝gbarkeitsdaten ÔÇö Aktive Datenbankverbindung erforderlich",
    days_ago: "Vor 365 Tagen",
    today: "Heute",
    keys_applied: "API-Schl├╝ssel erfolgreich im laufenden Betrieb getauscht!",
    keys_reset: "Auf Standard-Serverschl├╝ssel zur├╝ckgesetzt.",
    live_db: "Live-Datenbank",
    sandbox: "Sandbox",
    sys_all_nominal: "Alle Systeme laufen normal",
    sys_unreachable: "Ein oder mehrere Dienste sind nicht erreichbar"
  },
  ZH: {
    title: 'µ£ìÕèíÕÖ¿ÕüÑÕ║ÀþèÂµÇü',
    subtitle: 'Õ«×µùÂþøæµÄºµëÇµ£ëÕñûÚâ¿µ£ìÕèíõ¥ØÞÁû',
    refresh: 'þ½ïÕì│ÕêÀµû░',
    refreshing: 'µúÇµƒÑõ©¡ÔÇª',
    last_checked: 'ÕÀ▓µúÇµƒÑ',
    latency: 'Õ╗ÂÞ┐ƒ',
    endpoint: 'µ£ìÕèíþ½»þé╣',
    status_ok: 'µ¡úÕ©©Þ┐ÉÞíî',
    status_degraded: 'µ£ìÕèíÚÖìþ║º',
    status_offline: 'þª╗þ║┐',
    status_unauthorized: 'Ú£ÇÞªüÚ¬îÞ»ü',
    status_unknown: 'µ£¬þƒÑ',
    health_db: 'Supabase µò░µì«Õ║ô',
    health_email: 'Resend Úé«õ╗Â API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Õø¥ÕâÅþöƒµêÉÕÖ¿)',
    health_smithsonian: 'Smithsonian Õ╝Çµö¥ÞÄÀÕÅû API',
    health_unsplash: 'Unsplash µæäÕ¢▒Õø¥Õ║ô API',
    db_desc: 'õ©╗Þªü PostgreSQL µò░µì«Õ║ô ÔÇö Þ║½õ╗¢Ú¬îÞ»üÒÇüÞ»¥þ¿ïÒÇüµêÉÕ░▒ÒÇüµÉ£þ┤óµùÑÕ┐ùÒÇé',
    email_desc: 'õ║ïÕèíµÇºÚé«õ╗ÂÕÅæÚÇü ÔÇö Þ┤ªµêÀÚ¬îÞ»üÒÇüÚÇÜþƒÑÒÇé',
    ai_desc: 'þöƒµêÉÕ╝Å AI Õ╝òµôÄ ÔÇö Õ¥¢þ½áµÅÉþñ║ÒÇüþ┐╗Þ»æÒÇüÕêåµ×ÉµèÑÕæèÒÇüÕ»╝Õ©êÞüèÕñ®ÒÇé',
    images_desc: 'AI Õø¥ÕâÅþöƒµêÉ´╝îþö¿õ║ÄÕ¡ªµ£»µêÉÕ░▒Õ¥¢þ½áÒÇé',
    smithsonian_desc: 'Smithsonian ÕìÜþë®Úªå API ÔÇö Þºúµ×ÉÕà¼Õà▒ÚóåÕƒƒþÜäÕÄåÕÅ▓Õø¥ÕâÅõ©ÄµòÖÞé▓ÞÁäµ║ÉÒÇé',
    unsplash_desc: 'Unsplash Õø¥ÕâÅ API ÔÇö Þºúµ×ÉÚ½ÿÕôüÞ┤¿þÜäµæäÕ¢▒õ¢£Õôüõ©ÄþÄ░õ╗úµòÖÞé▓µÅÆÕø¥ÒÇé',
    auto_refresh: 'µ»Å 10 þºÆÞç¬Õè¿ÕêÀµû░',
    ms: 'ms',
    not_configured: 'µ£¬Úàìþ¢«',
    error: 'ÚöÖÞ»»Þ»ªµâà',    sla_title: "µ£ÇÞ┐æ 365 Õñ®µ£ìÕèíÕÅ»þö¿µÇº (SLA) õ©ÄÕü£µ£║µùÂÚù┤",
    sla_desc: "Õ╣┤Õ║ªµ╗ÜÕè¿µ£ìÕèíþ¡ëþ║ºÕìÅÞ«« (SLA) ÕÅ»þö¿þÄçÒÇüÞüÜÕÉêµòàÚÜ£õ║ïõ╗ÂÞ┐¢Þ©¬ÕÆîÕ╣│ÕØçÕ╗ÂÞ┐ƒÕüÅþº╗ÚçÅÒÇé",
    lbl_database: "µò░µì«Õ║ô",
    lbl_email: "Úé«õ╗Âõ©¡þ╗º",
    lbl_ai: "AI ÕñºÞ»¡Þ¿Çµ¿íÕ×ïÕÉÄÕÅ░",
    lbl_images: "Õø¥ÕâÅþöƒµêÉÕ╝òµôÄ",
    lbl_smithsonian: "Smithsonian API",
    lbl_unsplash: "Unsplash API",
    no_data: "µÜéµùáµò░µì«",
    db_conn_req: "Ú£ÇÞªüµ┤╗ÞÀâµò░µì«Õ║ôÞ┐×µÄÑ",
    no_downtime: "µ£¬ÕÅæþöƒÕü£µ£║",
    downtime_min: "Õü£µ£║µùÂÚò┐´╝Ü{min} ÕêåÚÆƒ",
    downtime_hour: "Õü£µ£║µùÂÚò┐´╝Ü{hour} Õ░ÅµùÂ",
    no_major_incidents: "µ£¬ÕÅæþöƒÚçìÕñºµòàÚÜ£",
    inc_db_upgrade: "µòàÚÜ£õ║ïõ╗Â´╝ÜÕÅ¬Þ»╗Õë»µ£¼µò░µì«Õ║ôÕìçþ║º",
    inc_rate_limit: "µòàÚÜ£õ║ïõ╗Â´╝ÜÚóæþÄçÚÖÉÕêÂÕÅéµò░Þ░âµò┤",
    inc_quota_scaling: "µòàÚÜ£õ║ïõ╗Â´╝ÜÕñºµ¿íÕ×ï API ÚàìÚóØÕñºþëêÚØóÞ░âõ╝ÿ",
    inc_oom: "µòàÚÜ£õ║ïõ╗Â´╝Üµë╣ÚçÅþöƒµêÉõ╗╗ÕèíÕåàÕ¡ÿµ║óÕç║",
    inc_smithsonian: "µòàÚÜ£õ║ïõ╗Â´╝ÜSmithsonian API Úóæµ¼íÚÖÉÕêÂ",
    inc_unsplash: "µòàÚÜ£õ║ïõ╗Â´╝ÜUnsplash þé╣µò░ÚóØÕ║ªÞÇùÕ░¢",
    status_nominal: "µ¡úÕ©©",
    status_no_data: "µùáµùÑÕ┐ùµò░µì«",
    status_outage: "Õü£µ£║õ©¡µû¡",
    sla_grid_title: "µ╗ÜÕè¿µ£ìÕèíÕÅ»þö¿þÄçþ¢æµá╝ (µ£ÇÞ┐æ 365 Õñ®µùÂÚù┤þ║┐)",
    overall_avg: "Õà¿Õ▒ÇÕ╣│ÕØçÕÅ»þö¿þÄç",
    no_avail_data: "µÜéµùáÕÅ»þö¿µÇºµò░µì« ÔÇö Ú£ÇÞªüÕ╗║þ½ïµ┤╗ÞÀâþÜäµò░µì«Õ║ôÞ┐×µÄÑ",
    days_ago: "365 Õñ®Õëì",
    today: "õ╗èÕñ®",
    keys_applied: "API Õ»åÚÆÑÕÀ▓µêÉÕèƒþâ¡µÅÆµïöÕ║öþö¿´╝ü",
    keys_reset: "ÕÀ▓µêÉÕèƒµüóÕñìõ©║Ú╗ÿÞ«ñµ£ìÕèíÕÖ¿þ½»Õ»åÚÆÑþÄ»ÕóâÒÇé",
    live_db: "µ┤╗ÞÀâµò░µì«Õ║ô",
    sandbox: "µ▓ÖþøÆµÁïÞ»ò",
    sys_all_nominal: "µëÇµ£ëþ│╗þ╗ƒÞ┐ÉÞíîµ¡úÕ©©",
    sys_unreachable: "õ©Çõ©¬µêûÕñÜõ©¬µ£ìÕèíµùáµ│òÞ«┐Úù«"
  },
  PT: {
    title: 'Sa├║de do Servidor',
    subtitle: 'Monitoriza├º├úo em tempo real de todas as depend├¬ncias de servi├ºos externos',
    refresh: 'Atualizar Agora',
    refreshing: 'A verificarÔÇª',
    last_checked: 'Verificado',
    latency: 'Lat├¬ncia',
    endpoint: 'Endpoint',
    status_ok: 'Operacional',
    status_degraded: 'Degradado',
    status_offline: 'Offline',
    status_unauthorized: 'Autentica├º├úo Necess├íria',
    status_unknown: 'Desconhecido',
    health_db: 'Base de dados Supabase',
    health_email: 'API de E-mail Resend',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Gerador de Imagens)',
    health_smithsonian: 'API Smithsonian Open Access',
    health_unsplash: 'API de Fotografia Unsplash',
    db_desc: 'Base de dados PostgreSQL principal ÔÇö autentica├º├úo, cursos, conquistas, registos de pesquisa.',
    email_desc: 'Envio de e-mails transacionais ÔÇö verifica├º├úo de conta, notifica├º├Áes.',
    ai_desc: 'Espinha dorsal de IA generativa ÔÇö prompts de medalhas, tradu├º├Áes, relat├│rios anal├¡ticos, chat do tutor.',
    images_desc: 'Gera├º├úo de imagens por IA para medalhas de conquistas acad├®micas.',
    smithsonian_desc: 'API do Museu Smithsonian ÔÇö resolve recursos educacionais e imagens hist├│ricas de dom├¡nio p├║blico.',
    unsplash_desc: 'API de Imagens Unsplash ÔÇö resolve fotografias de alta qualidade e imagens educativas modernas.',
    auto_refresh: 'Atualiza├º├úo autom├ítica a cada 10 segundos',
    ms: 'ms',
    not_configured: 'N├úo configurado',
    error: 'Detalhe do erro',    sla_title: "SLA de Depend├¬ncia e Tempo de Inatividade nos ├Ültimos 365 Dias",
    sla_desc: "Estado do acordo de n├¡vel de servi├ºo (SLA) anual cont├¡nuo, rastreamento de incidentes agregados e desvios de lat├¬ncia m├®dia.",
    lbl_database: "Base de dados",
    lbl_email: "Rel├® de E-mail",
    lbl_ai: "Backend AI LLM",
    lbl_images: "Motor de Imagem",
    lbl_smithsonian: "API Smithsonian",
    lbl_unsplash: "API Unsplash",
    no_data: "Sem dados",
    db_conn_req: "Liga├º├úo ├á base de dados necess├íria",
    no_downtime: "Sem tempo de inatividade",
    downtime_min: "Inatividade: {min}m",
    downtime_hour: "Inatividade: {hour}h",
    no_major_incidents: "Sem incidentes graves",
    inc_db_upgrade: "Incidente: Atualiza├º├úo da DB r├®plica",
    inc_rate_limit: "Incidente: Ajuste de limite de taxa",
    inc_quota_scaling: "Incidente: Dimensionamento da quota de LLM",
    inc_oom: "Incidente: Out of memory de lote",
    inc_smithsonian: "Incidente: Limita├º├úo de taxa do Smithsonian",
    inc_unsplash: "Incidente: Esgotamento de cr├®ditos do Unsplash",
    status_nominal: "Nominal",
    status_no_data: "Sem Dados de Registo",
    status_outage: "Interrup├º├úo",
    sla_grid_title: "Grelha Cont├¡nua de Disponibilidade do Servi├ºo (Linha do tempo dos ├║ltimos 365 dias)",
    overall_avg: "M├®dia Geral",
    no_avail_data: "Sem dados de disponibilidade ÔÇö Liga├º├úo ativa ├á base de dados necess├íria",
    days_ago: "H├í 365 Dias",
    today: "Hoje",
    keys_applied: "Chaves API substitu├¡das com sucesso!",
    keys_reset: "Retornado ├ás chaves padr├úo do servidor.",
    live_db: "DB Ativa",
    sandbox: "Sandbox",
    sys_all_nominal: "Todos os sistemas nominais",
    sys_unreachable: "Um ou mais servi├ºos est├úo inacess├¡veis"
  },
  AR: {
    title: 'Ï¡Ïº┘äÏ® Ïº┘äÏ«ÏºÏ»┘à',
    subtitle: '┘àÏ▒Ïº┘éÏ¿Ï® ┘ü┘êÏ▒┘èÏ® ┘äÏ¼┘à┘èÏ╣ Ï¬Ï¿Ï╣┘èÏºÏ¬ Ïº┘äÏ«Ï»┘àÏºÏ¬ Ïº┘äÏ«ÏºÏ▒Ï¼┘èÏ®',
    refresh: 'Ï¬Ï¡Ï»┘èÏ½ Ïº┘äÏó┘å',
    refreshing: 'Ï¼ÏºÏ▒┘è Ïº┘äÏ¬Ï¡┘é┘éÔÇª',
    last_checked: 'Ï¬┘à Ïº┘äÏ¬Ï¡┘é┘é',
    latency: 'Ï▓┘à┘å Ïº┘äÏº┘åÏ¬┘éÏº┘ä',
    endpoint: '┘å┘éÏÀÏ® Ïº┘ä┘å┘çÏº┘èÏ®',
    status_ok: '┘èÏ╣┘à┘ä',
    status_degraded: '┘àÏ¬Ï▒ÏºÏ¼Ï╣',
    status_offline: '┘àÏ¬┘ê┘é┘ü',
    status_unauthorized: 'Ïº┘ä┘àÏÁÏºÏ»┘éÏ® ┘àÏÀ┘ä┘êÏ¿Ï®',
    status_unknown: 'Ï║┘èÏ▒ ┘àÏ╣Ï▒┘ê┘ü',
    health_db: '┘éÏºÏ╣Ï»Ï® Ï¿┘èÏº┘åÏºÏ¬ Supabase',
    health_email: '┘êÏºÏ¼┘çÏ® Ï¿Ï▒┘èÏ» Resend',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (┘à┘ê┘äÏ» Ïº┘äÏÁ┘êÏ▒)',
    health_smithsonian: '┘êÏºÏ¼┘çÏ® Smithsonian Open Access',
    health_unsplash: '┘êÏºÏ¼┘çÏ® Unsplash ┘ä┘äÏÁ┘êÏ▒ Ïº┘ä┘ü┘êÏ¬┘êÏ║Ï▒Ïº┘ü┘èÏ®',
    db_desc: '┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬ Ïº┘äÏúÏ│ÏºÏ│┘èÏ® PostgreSQL ÔÇö Ïº┘ä┘àÏÁÏºÏ»┘éÏ®Ïî Ïº┘äÏ»┘êÏ▒ÏºÏ¬Ïî Ïº┘äÏÑ┘åÏ¼ÏºÏ▓ÏºÏ¬Ïî Ï│Ï¼┘äÏºÏ¬ Ïº┘äÏ¿Ï¡Ï½.',
    email_desc: 'ÏÑÏ▒Ï│Ïº┘ä Ïº┘äÏ¿Ï▒┘èÏ» Ïº┘äÏÑ┘ä┘âÏ¬Ï▒┘ê┘å┘è Ïº┘äÏÑÏ¼Ï▒ÏºÏª┘è ÔÇö Ï¬┘üÏ╣┘è┘ä Ïº┘äÏ¡Ï│ÏºÏ¿Ïî Ïº┘äÏÑÏ┤Ï╣ÏºÏ▒ÏºÏ¬.',
    ai_desc: 'Ïº┘äÏ╣┘à┘êÏ» Ïº┘ä┘ü┘éÏ▒┘è ┘ä┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è Ïº┘äÏ¬┘ê┘ä┘èÏ»┘è ÔÇö ┘àÏÀÏº┘äÏ¿ÏºÏ¬ Ïº┘äÏú┘êÏ│┘àÏ®Ïî Ïº┘äÏ¬Ï▒Ï¼┘àÏºÏ¬Ïî Ïº┘äÏ¬┘éÏºÏ▒┘èÏ▒ Ïº┘äÏ¬Ï¡┘ä┘è┘ä┘èÏ®Ïî ┘àÏ¡ÏºÏ»Ï½Ï® Ïº┘ä┘àÏ╣┘ä┘à.',
    images_desc: 'Ï¬┘ê┘ä┘èÏ» Ïº┘äÏÁ┘êÏ▒ Ï¿Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è ┘äÏú┘êÏ│┘àÏ® Ïº┘äÏÑ┘åÏ¼ÏºÏ▓ Ïº┘äÏú┘âÏºÏ»┘è┘à┘è.',
    smithsonian_desc: '┘êÏºÏ¼┘çÏ® ┘àÏ¬Ï¡┘ü Smithsonian ÔÇö Ï¬┘ê┘üÏ▒ ┘à┘êÏºÏ▒Ï» Ï¬Ï╣┘ä┘è┘à┘èÏ® ┘êÏÁ┘êÏ▒Ïº┘ï Ï¬ÏºÏ▒┘èÏ«┘èÏ® ┘à┘å Ïº┘ä┘à┘ä┘â┘èÏ® Ïº┘äÏ╣Ïº┘àÏ®.',
    unsplash_desc: '┘êÏºÏ¼┘çÏ® ÏÁ┘êÏ▒ Unsplash ÔÇö Ï¬┘ê┘üÏ▒ ÏÁ┘êÏ▒Ïº┘ï ┘ü┘êÏ¬┘êÏ║Ï▒Ïº┘ü┘èÏ® Ï╣Ïº┘ä┘èÏ® Ïº┘äÏ¼┘êÏ»Ï® ┘êÏúÏÁ┘ê┘äÏº┘ï Ï¬Ï╣┘ä┘è┘à┘èÏ® Ï¡Ï»┘èÏ½Ï®.',
    auto_refresh: 'Ï¬Ï¡Ï»┘èÏ½ Ï¬┘ä┘éÏºÏª┘è ┘â┘ä 10 Ï½┘êÏº┘å┘ì',
    ms: '┘à┘ä┘è Ï½Ïº┘å┘èÏ®',
    not_configured: 'Ï║┘èÏ▒ ┘à┘ç┘èÏú',
    error: 'Ï¬┘üÏºÏÁ┘è┘ä Ïº┘äÏ«ÏÀÏú',    sla_title: "ÏºÏ¬┘üÏº┘é┘èÏ® ┘àÏ│Ï¬┘ê┘ë Ïº┘äÏ«Ï»┘àÏ® ┘ä┘äÏ¬Ï¿Ï╣┘èÏºÏ¬ ┘ê┘ê┘éÏ¬ Ïº┘äÏ¬┘ê┘é┘ü Ï«┘äÏº┘ä Ïº┘ä┘Ç 365 ┘è┘ê┘àÏº┘ï Ïº┘ä┘àÏºÏÂ┘èÏ®",
    sla_desc: "Ï¡Ïº┘äÏ® ÏºÏ¬┘üÏº┘é┘èÏ® ┘àÏ│Ï¬┘ê┘ë Ïº┘äÏ«Ï»┘àÏ® (SLA) Ïº┘äÏ│┘å┘ê┘èÏ® Ïº┘ä┘àÏ│Ï¬┘àÏ▒Ï®Ïî ┘êÏ¬Ï¬Ï¿Ï╣ Ïº┘äÏ¡┘êÏºÏ»Ï½ Ïº┘ä┘àÏ¼┘àÏ╣Ï®Ïî ┘ê┘àÏ¬┘êÏ│ÏÀ ÏÑÏ▓ÏºÏ¡ÏºÏ¬ Ï▓┘à┘å Ïº┘äÏº┘åÏ¬┘éÏº┘ä.",
    lbl_database: "┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬",
    lbl_email: "┘àÏ▒Ï¡┘ä Ïº┘äÏ¿Ï▒┘èÏ»",
    lbl_ai: "┘êÏºÏ¼┘çÏ® Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è LLM",
    lbl_images: "┘àÏ¡Ï▒┘â Ïº┘äÏÁ┘êÏ▒",
    lbl_smithsonian: "┘êÏºÏ¼┘çÏ® Smithsonian",
    lbl_unsplash: "┘êÏºÏ¼┘çÏ® Unsplash",
    no_data: "┘äÏº Ï¬┘êÏ¼Ï» Ï¿┘èÏº┘åÏºÏ¬",
    db_conn_req: "ÏºÏ¬ÏÁÏº┘ä ┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬ ┘àÏÀ┘ä┘êÏ¿",
    no_downtime: "┘äÏº ┘è┘êÏ¼Ï» ┘ê┘éÏ¬ Ï¬┘ê┘é┘ü",
    downtime_min: "┘ê┘éÏ¬ Ïº┘äÏ¬┘ê┘é┘ü: {min} Ï»┘é┘è┘éÏ®",
    downtime_hour: "┘ê┘éÏ¬ Ïº┘äÏ¬┘ê┘é┘ü: {hour} Ï│ÏºÏ╣Ï®",
    no_major_incidents: "┘äÏº Ï¬┘êÏ¼Ï» Ï¡┘êÏºÏ»Ï½ Ï▒Ïª┘èÏ│┘èÏ®",
    inc_db_upgrade: "Ï¡ÏºÏ»Ï½: Ï¬Ï▒┘é┘èÏ® ┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬ Ïº┘äÏ¿Ï»┘è┘äÏ®",
    inc_rate_limit: "Ï¡ÏºÏ»Ï½: ÏÂÏ¿ÏÀ Ï¡Ï» Ïº┘ä┘àÏ╣Ï»┘ä",
    inc_quota_scaling: "Ï¡ÏºÏ»Ï½: Ï¬┘êÏ│┘èÏ╣ Ï¡ÏÁÏ® LLM",
    inc_oom: "Ï¡ÏºÏ»Ï½: ┘å┘üÏºÏ» Ïº┘äÏ░Ïº┘âÏ▒Ï® ┘ü┘è Ïº┘äÏ»┘üÏ╣Ï®",
    inc_smithsonian: "Ï¡ÏºÏ»Ï½: Ï¬Ï¡Ï»┘èÏ» ┘àÏ╣Ï»┘ä Smithsonian",
    inc_unsplash: "Ï¡ÏºÏ»Ï½: ÏºÏ│Ï¬┘å┘üÏºÏ» Ï▒ÏÁ┘èÏ» Unsplash",
    status_nominal: "ÏÀÏ¿┘èÏ╣┘è",
    status_no_data: "┘äÏº Ï¬┘êÏ¼Ï» Ï¿┘èÏº┘åÏºÏ¬ Ï│Ï¼┘ä",
    status_outage: "Ïº┘å┘éÏÀÏºÏ╣",
    sla_grid_title: "Ï┤Ï¿┘âÏ® Ï¬┘ê┘üÏ▒ Ïº┘äÏ«Ï»┘àÏ® Ïº┘ä┘àÏ│Ï¬┘àÏ▒Ï® (Ïº┘äÏ«ÏÀ Ïº┘äÏ▓┘à┘å┘è ┘ä┘ä┘Ç 365 ┘è┘ê┘àÏº┘ï Ïº┘ä┘àÏºÏÂ┘èÏ®)",
    overall_avg: "Ïº┘ä┘àÏ╣Ï»┘ä Ïº┘äÏ╣Ïº┘à",
    no_avail_data: "┘äÏº Ï¬┘êÏ¼Ï» Ï¿┘èÏº┘åÏºÏ¬ Ï¬┘ê┘üÏ▒ ÔÇö ÏºÏ¬ÏÁÏº┘ä ┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬ Ïº┘ä┘åÏ┤ÏÀ ┘àÏÀ┘ä┘êÏ¿",
    days_ago: "┘éÏ¿┘ä 365 ┘è┘ê┘àÏº┘ï",
    today: "Ïº┘ä┘è┘ê┘à",
    keys_applied: "Ï¬┘à ÏºÏ│Ï¬Ï¿Ï»Ïº┘ä ┘à┘üÏºÏ¬┘èÏ¡ ┘êÏºÏ¼┘çÏ® Ïº┘äÏ¿Ï▒┘àÏ¼Ï® Ï¿┘åÏ¼ÏºÏ¡!",
    keys_reset: "Ï¬┘à Ïº┘äÏ╣┘êÏ»Ï® ÏÑ┘ä┘ë ┘à┘üÏºÏ¬┘èÏ¡ Ïº┘äÏ«ÏºÏ»┘à Ïº┘äÏº┘üÏ¬Ï▒ÏºÏÂ┘èÏ®.",
    live_db: "┘éÏºÏ╣Ï»Ï® Ïº┘äÏ¿┘èÏº┘åÏºÏ¬ Ïº┘ä┘åÏ┤ÏÀÏ®",
    sandbox: "Ïº┘äÏ¿┘èÏªÏ® Ïº┘äÏ¬Ï¼Ï▒┘èÏ¿┘èÏ®",
    sys_all_nominal: "Ï¼┘à┘èÏ╣ Ïº┘äÏú┘åÏ©┘àÏ® Ï¬Ï╣┘à┘ä Ï¿Ï┤┘â┘ä ÏÀÏ¿┘èÏ╣┘è",
    sys_unreachable: "Ï«Ï»┘àÏ® ┘êÏºÏ¡Ï»Ï® Ïú┘ê Ïú┘âÏ½Ï▒ Ï║┘èÏ▒ ┘éÏºÏ¿┘äÏ® ┘ä┘ä┘êÏÁ┘ê┘ä"
  },
  HI: {
    title: 'Óñ©Óñ░ÓÑìÓñÁÓñ░ Óñ©ÓÑìÓñÁÓñ¥Óñ©ÓÑìÓñÑÓÑìÓñ»',
    subtitle: 'Óñ©Óñ¡ÓÑÇ Óñ¼Óñ¥Óñ╣Óñ░ÓÑÇ Óñ©ÓÑçÓñÁÓñ¥ Óñ¿Óñ┐Óñ░ÓÑìÓñ¡Óñ░ÓññÓñ¥ÓñôÓñé ÓñòÓÑÇ ÓñÁÓñ¥Óñ©ÓÑìÓññÓñÁÓñ┐Óñò Óñ©Óñ«Óñ» Óñ¿Óñ┐ÓñùÓñ░Óñ¥Óñ¿ÓÑÇ',
    refresh: 'ÓñàÓñ¡ÓÑÇ Óñ░ÓÑÇÓñ½ÓÑìÓñ░ÓÑçÓñÂ ÓñòÓñ░ÓÑçÓñé',
    refreshing: 'Óñ£Óñ¥ÓñüÓñÜ ÓñòÓÑÇ Óñ£Óñ¥ Óñ░Óñ╣ÓÑÇ Óñ╣ÓÑêÔÇª',
    last_checked: 'Óñ£Óñ¥ÓñüÓñÜÓñ¥ ÓñùÓñ»Óñ¥',
    latency: 'ÓñÁÓñ┐Óñ▓ÓñéÓñ¼ÓññÓñ¥',
    endpoint: 'ÓñÅÓñéÓñíÓñ¬ÓÑëÓñçÓñéÓñƒ',
    status_ok: 'Óñ¬Óñ░Óñ┐ÓñÜÓñ¥Óñ▓Óñ¿ Óñ«ÓÑçÓñé',
    status_degraded: 'Óñ¿Óñ┐Óñ«ÓÑìÓñ¿ÓÑÇÓñòÓÑâÓññ',
    status_offline: 'ÓñæÓñ½Óñ╝Óñ▓Óñ¥ÓñçÓñ¿',
    status_unauthorized: 'Óñ¬ÓÑìÓñ░Óñ«Óñ¥ÓñúÓÑÇÓñòÓñ░Óñú ÓñåÓñÁÓñÂÓÑìÓñ»Óñò',
    status_unknown: 'ÓñàÓñ£ÓÑìÓñ×Óñ¥Óññ',
    health_db: 'Supabase ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ©',
    health_email: 'Resend ÓñêÓñ«ÓÑçÓñ▓ API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (ÓñøÓñÁÓñ┐ Óñ£Óñ¿Óñ░ÓÑçÓñƒÓñ░)',
    health_smithsonian: 'Smithsonian Open Access API',
    health_unsplash: 'Unsplash Óñ½ÓÑïÓñƒÓÑïÓñùÓÑìÓñ░Óñ¥Óñ½ÓÑÇ API',
    db_desc: 'Óñ¬ÓÑìÓñ░Óñ¥ÓñÑÓñ«Óñ┐Óñò PostgreSQL ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ© ÔÇö Óñ¬ÓÑìÓñ░Óñ«Óñ¥ÓñúÓÑÇÓñòÓñ░Óñú, Óñ¬Óñ¥ÓñáÓÑìÓñ»ÓñòÓÑìÓñ░Óñ«, ÓñëÓñ¬Óñ▓Óñ¼ÓÑìÓñºÓñ┐Óñ»Óñ¥Óñé, ÓñûÓÑïÓñ£ Óñ▓ÓÑëÓñùÓÑñ',
    email_desc: 'Óñ▓ÓÑçÓñ¿ÓñªÓÑçÓñ¿ Óñ©ÓñéÓñ¼ÓñéÓñºÓÑÇ ÓñêÓñ«ÓÑçÓñ▓ ÓñÁÓñ┐ÓññÓñ░Óñú ÔÇö ÓñûÓñ¥ÓññÓñ¥ Óñ©ÓññÓÑìÓñ»Óñ¥Óñ¬Óñ¿, Óñ©ÓÑéÓñÜÓñ¿Óñ¥ÓñÅÓñéÓÑñ',
    ai_desc: 'Óñ£ÓÑçÓñ¿Óñ░ÓÑçÓñƒÓñ┐ÓñÁ ÓñÅÓñåÓñê Óñ░ÓÑÇÓñóÓñ╝ ÔÇö Óñ¼ÓÑêÓñ£ Óñ©ÓñéÓñòÓÑçÓññ, ÓñàÓñ¿ÓÑüÓñÁÓñ¥Óñª, ÓñÁÓñ┐ÓñÂÓÑìÓñ▓ÓÑçÓñÀÓñúÓñ¥ÓññÓÑìÓñ«Óñò Óñ░Óñ┐Óñ¬ÓÑïÓñ░ÓÑìÓñƒ, ÓñƒÓÑìÓñ»ÓÑéÓñƒÓñ░ ÓñÜÓÑêÓñƒÓÑñ',
    images_desc: 'ÓñàÓñòÓñ¥ÓñªÓñ«Óñ┐Óñò ÓñëÓñ¬Óñ▓Óñ¼ÓÑìÓñºÓñ┐ Óñ¼ÓÑêÓñ£ ÓñòÓÑç Óñ▓Óñ┐ÓñÅ ÓñÅÓñåÓñê ÓñøÓñÁÓñ┐ Óñ¿Óñ┐Óñ░ÓÑìÓñ«Óñ¥ÓñúÓÑñ',
    smithsonian_desc: 'Óñ©ÓÑìÓñ«Óñ┐ÓñÑÓñ©ÓÑïÓñ¿Óñ┐Óñ»Óñ¿ Óñ©ÓñéÓñùÓÑìÓñ░Óñ╣Óñ¥Óñ▓Óñ» API ÔÇö Óñ©Óñ¥Óñ░ÓÑìÓñÁÓñ£Óñ¿Óñ┐Óñò ÓñíÓÑïÓñ«ÓÑçÓñ¿ ÓñòÓÑÇ ÓñÉÓññÓñ┐Óñ╣Óñ¥Óñ©Óñ┐Óñò ÓñøÓñÁÓñ┐Óñ»ÓÑïÓñé ÓñöÓñ░ ÓñÂÓÑêÓñòÓÑìÓñÀÓñ┐Óñò Óñ©ÓñéÓñ©Óñ¥ÓñºÓñ¿ÓÑïÓñé ÓñòÓÑï Óñ╣Óñ▓ ÓñòÓñ░ÓññÓñ¥ Óñ╣ÓÑêÓÑñ',
    unsplash_desc: 'Unsplash ÓñøÓñÁÓñ┐ API ÔÇö ÓñëÓñÜÓÑìÓñÜ-ÓñùÓÑüÓñúÓñÁÓññÓÑìÓññÓñ¥ ÓñÁÓñ¥Óñ▓ÓÑÇ Óñ½ÓÑïÓñƒÓÑïÓñùÓÑìÓñ░Óñ¥Óñ½ÓÑÇ ÓñöÓñ░ ÓñåÓñºÓÑüÓñ¿Óñ┐Óñò ÓñÂÓÑêÓñòÓÑìÓñÀÓñ┐Óñò Óñ©ÓñéÓñ¬ÓññÓÑìÓññÓñ┐Óñ»ÓÑïÓñé ÓñòÓÑï Óñ╣Óñ▓ ÓñòÓñ░ÓññÓñ¥ Óñ╣ÓÑêÓÑñ',
    auto_refresh: 'Óñ╣Óñ░ 10 Óñ©ÓÑçÓñòÓñéÓñí Óñ«ÓÑçÓñé Óñ©ÓÑìÓñÁÓññÓñâ Óñ░ÓÑÇÓñ½ÓÑìÓñ░ÓÑçÓñÂ Óñ╣ÓÑïÓññÓñ¥ Óñ╣ÓÑê',
    ms: 'ms',
    not_configured: 'ÓñòÓÑëÓñ¿ÓÑìÓñ½Óñ╝Óñ┐ÓñùÓñ░ Óñ¿Óñ╣ÓÑÇÓñé ÓñòÓñ┐Óñ»Óñ¥ ÓñùÓñ»Óñ¥',
    error: 'ÓññÓÑìÓñ░ÓÑüÓñƒÓñ┐ ÓñÁÓñ┐ÓñÁÓñ░Óñú',    sla_title: 'Óñ¬Óñ┐ÓñøÓñ▓ÓÑç 365 ÓñªÓñ┐Óñ¿ÓÑïÓñé Óñ«ÓÑçÓñé Óñ¿Óñ┐Óñ░ÓÑìÓñ¡Óñ░ÓññÓñ¥ SLA ÓñöÓñ░ ÓñíÓñ¥ÓñëÓñ¿ÓñƒÓñ¥ÓñçÓñ«',
    sla_desc: 'Óñ░ÓÑïÓñ▓Óñ┐ÓñéÓñù ÓñÁÓñ¥Óñ░ÓÑìÓñÀÓñ┐Óñò Óñ©ÓÑçÓñÁÓñ¥ Óñ©ÓÑìÓññÓñ░ Óñ©Óñ«ÓñØÓÑîÓññÓñ¥ (SLA) Óñ©ÓÑìÓñÑÓñ┐ÓññÓñ┐, ÓñòÓÑüÓñ▓ ÓñÿÓñƒÓñ¿Óñ¥ ÓñƒÓÑìÓñ░ÓÑêÓñòÓñ┐ÓñéÓñù, ÓñöÓñ░ ÓñöÓñ©Óññ ÓñÁÓñ┐Óñ▓ÓñéÓñ¼ÓññÓñ¥ ÓñæÓñ½Óñ╝Óñ©ÓÑçÓñƒÓÑñ',
    lbl_database: 'ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ©',
    lbl_email: 'ÓñêÓñ«ÓÑçÓñ▓ Óñ░Óñ┐Óñ▓ÓÑç',
    lbl_ai: 'AI LLM Óñ¼ÓÑêÓñòÓñÅÓñéÓñí',
    lbl_images: 'ÓñøÓñÁÓñ┐ ÓñçÓñéÓñ£Óñ¿',
    lbl_smithsonian: 'Smithsonian API',
    lbl_unsplash: 'Unsplash API',
    no_data: 'ÓñòÓÑïÓñê ÓñíÓÑçÓñƒÓñ¥ Óñ¿Óñ╣ÓÑÇÓñé',
    db_conn_req: 'ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ© ÓñòÓñ¿ÓÑçÓñòÓÑìÓñÂÓñ¿ ÓñåÓñÁÓñÂÓÑìÓñ»Óñò',
    no_downtime: 'ÓñòÓÑïÓñê ÓñíÓñ¥ÓñëÓñ¿ÓñƒÓñ¥ÓñçÓñ« Óñ¿Óñ╣ÓÑÇÓñé',
    downtime_min: 'ÓñíÓñ¥ÓñëÓñ¿ÓñƒÓñ¥ÓñçÓñ«: {min} Óñ«Óñ┐Óñ¿Óñƒ',
    downtime_hour: 'ÓñíÓñ¥ÓñëÓñ¿ÓñƒÓñ¥ÓñçÓñ«: {hour} ÓñÿÓñéÓñƒÓÑç',
    no_major_incidents: 'ÓñòÓÑïÓñê Óñ¼ÓñíÓñ╝ÓÑÇ ÓñÿÓñƒÓñ¿Óñ¥ Óñ¿Óñ╣ÓÑÇÓñé',
    inc_db_upgrade: 'ÓñÿÓñƒÓñ¿Óñ¥: Óñ¬ÓÑìÓñ░ÓññÓñ┐ÓñòÓÑâÓññÓñ┐ ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ© ÓñàÓñ¬ÓñùÓÑìÓñ░ÓÑçÓñí',
    inc_rate_limit: 'ÓñÿÓñƒÓñ¿Óñ¥: ÓñªÓñ░-Óñ©ÓÑÇÓñ«Óñ¥ Óñ©Óñ«Óñ¥Óñ»ÓÑïÓñ£Óñ¿',
    inc_quota_scaling: 'ÓñÿÓñƒÓñ¿Óñ¥: LLM ÓñòÓÑïÓñƒÓñ¥ Óñ©ÓÑìÓñòÓÑçÓñ▓Óñ┐ÓñéÓñù',
    inc_oom: 'ÓñÿÓñƒÓñ¿Óñ¥: Óñ¼ÓÑêÓñÜ ÓñåÓñëÓñƒ-ÓñæÓñ½-Óñ«ÓÑçÓñ«ÓÑïÓñ░ÓÑÇ',
    inc_smithsonian: "ÓñÿÓñƒÓñ¿Óñ¥: Óñ©ÓÑìÓñ«Óñ┐ÓñÑÓñ©ÓÑïÓñ¿Óñ┐Óñ»Óñ¿ ÓñªÓñ░-Óñ©ÓÑÇÓñ«Óñ┐Óññ",
    inc_unsplash: "ÓñÿÓñƒÓñ¿Óñ¥: ÓñàÓñ¿Óñ©ÓÑìÓñ¬ÓÑìÓñ▓ÓÑêÓñÂ ÓñòÓÑìÓñ░ÓÑçÓñíÓñ┐Óñƒ Óñ©Óñ«Óñ¥Óñ¬ÓÑìÓññÓñ┐",
    status_nominal: 'Óñ¿Óñ¥Óñ«Óñ«Óñ¥ÓññÓÑìÓñ░',
    status_no_data: 'ÓñòÓÑïÓñê Óñ▓ÓÑëÓñù ÓñíÓÑçÓñƒÓñ¥ Óñ¿Óñ╣ÓÑÇÓñé',
    status_outage: 'ÓñåÓñëÓñƒÓÑçÓñ£',
    sla_grid_title: 'Óñ░ÓÑïÓñ▓Óñ┐ÓñéÓñù Óñ©ÓÑçÓñÁÓñ¥ ÓñëÓñ¬Óñ▓Óñ¼ÓÑìÓñºÓññÓñ¥ ÓñùÓÑìÓñ░Óñ┐Óñí (Óñ¬Óñ┐ÓñøÓñ▓ÓÑç 365 ÓñªÓñ┐Óñ¿ÓÑïÓñé ÓñòÓÑÇ Óñ©Óñ«Óñ»Óñ░ÓÑçÓñûÓñ¥)',
    overall_avg: 'ÓñòÓÑüÓñ▓ ÓñöÓñ©Óññ',
    no_avail_data: 'ÓñòÓÑïÓñê ÓñëÓñ¬Óñ▓Óñ¼ÓÑìÓñºÓññÓñ¥ ÓñíÓÑçÓñƒÓñ¥ Óñ¿Óñ╣ÓÑÇÓñé ÔÇö Óñ©ÓñòÓÑìÓñ░Óñ┐Óñ» ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ© ÓñòÓñ¿ÓÑçÓñòÓÑìÓñÂÓñ¿ ÓñåÓñÁÓñÂÓÑìÓñ»Óñò',
    days_ago: '365 ÓñªÓñ┐Óñ¿ Óñ¬Óñ╣Óñ▓ÓÑç',
    today: 'ÓñåÓñ£',
    keys_applied: 'API ÓñòÓÑüÓñéÓñ£Óñ┐Óñ»Óñ¥Óñü Óñ©Óñ½Óñ▓ÓññÓñ¥Óñ¬ÓÑéÓñ░ÓÑìÓñÁÓñò Óñ¼ÓñªÓñ▓ ÓñªÓÑÇ ÓñùÓñêÓñé!',
    keys_reset: 'ÓñíÓñ┐Óñ½Óñ╝ÓÑëÓñ▓ÓÑìÓñƒ Óñ©Óñ░ÓÑìÓñÁÓñ░ ÓñòÓÑüÓñéÓñ£Óñ┐Óñ»ÓÑïÓñé Óñ¬Óñ░ ÓñÁÓñ¥Óñ¬Óñ© Óñå ÓñùÓñÅÓÑñ',
    live_db: 'Óñ©ÓñòÓÑìÓñ░Óñ┐Óñ» ÓñíÓÑçÓñƒÓñ¥Óñ¼ÓÑçÓñ©',
    sandbox: 'Óñ©ÓÑêÓñéÓñíÓñ¼ÓÑëÓñòÓÑìÓñ©',
    sys_all_nominal: 'Óñ©Óñ¡ÓÑÇ Óñ¬ÓÑìÓñ░ÓñúÓñ¥Óñ▓Óñ┐Óñ»Óñ¥Óñü Óñ¿Óñ¥Óñ«Óñ«Óñ¥ÓññÓÑìÓñ░ Óñ╣ÓÑêÓñé',
    sys_unreachable: 'ÓñÅÓñò Óñ»Óñ¥ ÓñàÓñºÓñ┐Óñò Óñ©ÓÑçÓñÁÓñ¥ÓñÅÓñü ÓñàÓñ¿ÓÑüÓñ¬Óñ▓Óñ¼ÓÑìÓñº Óñ╣ÓÑêÓñé'
  },
  UR: {
    title: 'Ï│Ï▒┘êÏ▒ ┌®█î Ï¡Ïº┘äÏ¬',
    subtitle: 'Ï¬┘àÏº┘à Ï¿█îÏ▒┘ê┘å█î Ï│Ï▒┘êÏ│Ï▓ ┌®█Æ Ïº┘åÏ¡ÏÁÏºÏ▒ ┌®█î Ï¡┘é█î┘é█î ┘ê┘éÏ¬ ┘à█î┌║ ┘å┌»Ï▒Ïº┘å█î',
    refresh: 'ÏºÏ¿┌¥█î Ï▒█î┘üÏ▒█îÏ┤ ┌®Ï▒█î┌║',
    refreshing: 'Ï¼Ïº┘å┌å ┘¥┌æÏ¬Ïº┘ä Ï¼ÏºÏ▒█î █ü█ÆÔÇª',
    last_checked: 'Ï¼Ïº┘å┌å ┘ä█îÏº ┌»█îÏº',
    latency: 'Ï¬ÏºÏ«█îÏ▒ (Latency)',
    endpoint: 'Ïº█î┘å┌ê ┘¥┘êÏºÏª┘å┘╣',
    status_ok: '┘üÏ╣Ïº┘ä',
    status_degraded: '┘àÏ¬ÏºÏ½Ï▒█ü',
    status_offline: 'Ïó┘ü ┘äÏºÏª┘å',
    status_unauthorized: 'Ï¬ÏÁÏ»█î┘é Ï»Ï▒┌®ÏºÏ▒ █ü█Æ',
    status_unknown: '┘åÏº┘àÏ╣┘ä┘ê┘à',
    health_db: 'Supabase ┌ê█î┘╣Ïº Ï¿█îÏ│',
    health_email: 'Resend Ïº█î ┘à█î┘ä API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Ïº┘à█îÏ¼ Ï¼┘åÏ▒█î┘╣Ï▒)',
    health_smithsonian: 'Smithsonian Open Access API',
    health_unsplash: 'Unsplash Photography API',
    db_desc: 'Ï¿┘å█îÏºÏ»█î PostgreSQL ┌ê█î┘╣Ïº Ï¿█îÏ│ ÔÇö Ï¬ÏÁÏ»█î┘éÏî ┌®┘êÏ▒Ï│Ï▓Ïî ┌®Ïº┘à█îÏºÏ¿█îÏº┌║Ïî Ï¬┘äÏºÏ┤ ┌®█Æ ┘äÏº┌»Ï▓█ö',
    email_desc: 'Ïº█î ┘à█î┘ä ┌®█î Ï¬Ï▒Ï│█î┘ä ÔÇö Ïº┌®ÏºÏñ┘å┘╣ ┌®█î Ï¬ÏÁÏ»█î┘éÏî ÏºÏÀ┘äÏºÏ╣ÏºÏ¬█ö',
    ai_desc: 'Ï¼┘åÏ▒█î┘╣┘ê Ïº█Æ ÏóÏª█î ┘üÏ▒█î┘à ┘êÏ▒┌® ÔÇö Ï¿█îÏ¼ ┘¥Ï▒Ïº┘à┘¥┘╣Ï│Ïî Ï¬Ï▒Ï¼┘à█ÆÏî Ï▒┘¥┘êÏ▒┘╣█î┌║Ïî ┘╣█î┘ê┘╣Ï▒ ┌å█î┘╣█ö',
    images_desc: 'Ï¿█îÏ¼Ï▓ ┌®█Æ ┘ä█î█Æ Ï¬ÏÁ┘ê█îÏ▒ Ï¿┘åÏº┘åÏºÓÑñ',
    smithsonian_desc: 'Smithsonian Museum API ÔÇö resolves educational resources and public domain historical images.',
    unsplash_desc: 'Unsplash Image API ÔÇö resolves high-quality photography and modern educational assets.',
    auto_refresh: '█üÏ▒ 10 Ï│█î┌®┘å┌ê ┘à█î┌║ Ï«┘êÏ» Ï¿Ï«┘êÏ» Ï▒█î┘üÏ▒█îÏ┤ █ü┘êÏ¬Ïº █ü█Æ',
    ms: '┘à┘ä█î Ï│█î┌®┘å┌ê',
    not_configured: '┌®┘å┘ü█î┌»Ï▒ ┘å█ü█î┌║ ┌®█îÏº ┌»█îÏº',
    error: 'Ï«Ï▒ÏºÏ¿█î ┌®█î Ï¬┘üÏÁ█î┘ä',    sla_title: '┌»Ï▓Ï┤Ï¬█ü 365 Ï»┘å┘ê┌║ ┘à█î┌║ Ï│Ï▒┘êÏ│Ï▓ ┌®Ïº Ïº┘åÏ¡ÏÁÏºÏ▒ SLA Ïº┘êÏ▒ ┌êÏºÏñ┘å ┘╣ÏºÏª┘à',
    sla_desc: 'Ï│Ïº┘äÏº┘å█ü Ï▒┘ê┘ä┘å┌» Ï│Ï▒┘êÏ│ ┘ä█î┘ê┘ä Ïº█î┌»Ï▒█î┘à┘å┘╣ (SLA) ┌®█î ÏÁ┘êÏ▒Ï¬Ï¡Ïº┘äÏî ┘àÏ¼┘à┘êÏ╣█î ┘êÏº┘éÏ╣ÏºÏ¬ ┌®█î ┘╣Ï▒█î┌®┘å┌»Ïî Ïº┘êÏ▒ Ïº┘êÏ│ÏÀ Ï¬ÏºÏ«█îÏ▒ ┌®█Æ Ïó┘ü Ï│█î┘╣Ï│█ö',
    lbl_database: '┌ê█î┘╣Ïº Ï¿█îÏ│',
    lbl_email: 'Ïº█î ┘à█î┘ä Ï▒█î┘ä█Æ',
    lbl_ai: 'AI LLM Ï¿█î┌® Ïº█î┘å┌ê',
    lbl_images: 'Ïº┘à█îÏ¼ Ïº┘åÏ¼┘å',
    lbl_smithsonian: "Smithsonian API",
    lbl_unsplash: "Unsplash API",
    no_data: '┌®┘êÏª█î ┌ê█î┘╣Ïº Ï»Ï│Ï¬█îÏºÏ¿ ┘å█ü█î┌║',
    db_conn_req: '┌ê█î┘╣Ïº Ï¿█îÏ│ ┌®┘å┌®Ï┤┘å Ï»Ï▒┌®ÏºÏ▒ █ü█Æ',
    no_downtime: '┌®┘êÏª█î ┌êÏºÏñ┘å ┘╣ÏºÏª┘à ┘å█ü█î┌║',
    downtime_min: '┌êÏºÏñ┘å ┘╣ÏºÏª┘à: {min} ┘à┘å┘╣',
    downtime_hour: '┌êÏºÏñ┘å ┘╣ÏºÏª┘à: {hour} ┌»┌¥┘å┘╣█Æ',
    no_major_incidents: '┌®┘êÏª█î Ï¿┌æÏº ┘êÏº┘éÏ╣█ü ┘¥█îÏ┤ ┘å█ü█î┌║ Ïó█îÏº',
    inc_db_upgrade: '┘êÏº┘éÏ╣█ü: Ï▒█î┘¥┘ä█î┌®Ïº ┌ê█î┘╣Ïº Ï¿█îÏ│ Ïº┘¥ ┌»Ï▒█î┌ê',
    inc_rate_limit: '┘êÏº┘éÏ╣█ü: Ï▒█î┘╣ ┘ä┘à█î┘╣ ┌®█î Ïº█î┌êÏ¼Ï│┘╣┘à┘å┘╣',
    inc_quota_scaling: '┘êÏº┘éÏ╣█ü: LLM ┌®┘ê┘╣█ü ÏºÏ│┌®█î┘ä┘å┌»',
    inc_oom: '┘êÏº┘éÏ╣█ü: Ï¿█î┌å ÏóÏñ┘╣ Ïó┘ü ┘à█î┘à┘êÏ▒█î',
    inc_smithsonian: "┘êÏº┘éÏ╣█ü: Ï│┘àÏ¬┌¥Ï│┘ê┘å█î┘å Ï▒█î┘╣ ┘ä┘à█î┘╣┘å┌»",
    inc_unsplash: "┘êÏº┘éÏ╣█ü: Ïº┘å ÏºÏ│┘¥┘äÏ┤ ┌®Ï▒█î┌ê┘╣ ┌®Ïº Ï«ÏºÏ¬┘à█ü",
    status_nominal: 'Ï╣Ïº┘à',
    status_no_data: '┌®┘êÏª█î ┘äÏº┌» ┌ê█î┘╣Ïº Ï»Ï│Ï¬█îÏºÏ¿ ┘å█ü█î┌║',
    status_outage: 'ÏóÏñ┘╣█îÏ¼',
    sla_grid_title: 'Ï▒┘ê┘ä┘å┌» Ï│Ï▒┘êÏ│ ┌®█î Ï»Ï│Ï¬█îÏºÏ¿█î ┌®Ïº ┌»Ï▒█î┌ê (┌»Ï▓Ï┤Ï¬█ü 365 Ï»┘å┘ê┌║ ┌®Ïº ┘╣ÏºÏª┘à ┘äÏºÏª┘å)',
    overall_avg: '┘àÏ¼┘à┘êÏ╣█î Ïº┘êÏ│ÏÀ',
    no_avail_data: 'Ï»Ï│Ï¬█îÏºÏ¿█î ┌®Ïº ┌®┘êÏª█î ┌ê█î┘╣Ïº ┘å█ü█î┌║ ÔÇö ┘üÏ╣Ïº┘ä ┌ê█î┘╣Ïº Ï¿█îÏ│ ┌®┘å┌®Ï┤┘å Ï»Ï▒┌®ÏºÏ▒ █ü█Æ',
    days_ago: '365 Ï»┘å ┘¥█ü┘ä█Æ',
    today: 'ÏóÏ¼',
    keys_applied: 'API ┌®█îÏ▓ ┌®Ïº┘à█îÏºÏ¿█î ┌®█Æ Ï│ÏºÏ¬┌¥ Ï¬Ï¿Ï»█î┘ä ┌®Ï▒ Ï»█î ┌»Ïª█î┌║!',
    keys_reset: '┌ê█î┘üÏº┘ä┘╣ Ï│Ï▒┘êÏ▒ ┌®█îÏ▓ ┘¥Ï▒ ┘êÏº┘¥Ï│ Ïó ┌»Ïª█Æ█ö',
    live_db: 'Ï│┘¥Ï▒ ┌ê█î┘╣Ïº Ï¿█îÏ│',
    sandbox: 'Ï│█î┘å┌ê Ï¿Ïº┌®Ï│',
    sys_all_nominal: 'Ï¬┘àÏº┘à Ï│Ï│┘╣┘àÏ▓ ┘åÏºÏ▒┘à┘ä █ü█î┌║',
    sys_unreachable: 'Ïº█î┌® █îÏº Ï▓█îÏºÏ»█ü Ï│Ï▒┘êÏ│Ï▓ Ï¬┌® Ï▒Ï│ÏºÏª█î ┘à┘à┌®┘å ┘å█ü█î┌║'
  }
};

// ÔöÇÔöÇÔöÇ Service metadata ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const SERVICE_META: Record<string, { icon: any; descKey: keyof typeof HEALTH_STRINGS.EN; color: string }> = {
  db:     { icon: Database, descKey: 'db_desc',     color: 'emerald' },
  email:  { icon: Mail,     descKey: 'email_desc',  color: 'blue' },
  ai:     { icon: Cpu,      descKey: 'ai_desc',     color: 'violet' },
  images: { icon: Image,    descKey: 'images_desc', color: 'orange' },
  smithsonian: { icon: Image, descKey: 'smithsonian_desc', color: 'blue' },
  unsplash: { icon: Image, descKey: 'unsplash_desc', color: 'orange' },
};

const COLOR_MAP: Record<string, Record<string, string>> = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20' },
  violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20' },
  orange:  { bg: 'bg-orange-500/10',  icon: 'text-orange-400',  border: 'border-orange-500/20' },
};

// ÔöÇÔöÇÔöÇ Status badge ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function StatusBadge({ status, t }: { status: ServiceHealth['status']; t: typeof HEALTH_STRINGS.EN }) {
  if (status === 'ok') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <CheckCircle className="w-3 h-3" /> {t.status_ok}
    </span>
  );
  if (status === 'degraded') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <AlertTriangle className="w-3 h-3" /> {t.status_degraded}
    </span>
  );
  if (status === 'unauthorized') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <Lock className="w-3 h-3" /> {(t as any).status_unauthorized || 'Auth Required'}
    </span>
  );
  if (status === 'offline') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <WifiOff className="w-3 h-3" /> {t.status_offline}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-500 border border-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest">
      <Clock className="w-3 h-3" /> {t.status_unknown}
    </span>
  );
}

// ÔöÇÔöÇÔöÇ Service card ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function ServiceCard({ svc, t, lang }: { svc: ServiceHealth; t: typeof HEALTH_STRINGS.EN; lang: string }) {
  const meta = SERVICE_META[svc.id];
  const colors = COLOR_MAP[meta?.color || 'blue'];
  const Icon = meta?.icon || Activity;
  const nameKey = `health_${svc.id}` as keyof typeof HEALTH_STRINGS.EN;
  const descKey = meta?.descKey;

  const borderColor = svc.status === 'ok' ? 'border-slate-800 hover:border-emerald-500/20'
    : svc.status === 'offline' ? 'border-red-500/20'
    : svc.status === 'degraded' || svc.status === 'unauthorized' ? 'border-amber-500/20'
    : 'border-slate-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 border ${borderColor} rounded-[32px] bg-slate-900/40 flex flex-col gap-5 transition-colors`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">{t[nameKey] || svc.id}</h3>
            {descKey && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t[descKey]}</p>}
          </div>
        </div>
        <StatusBadge status={svc.status} t={t} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950/60 rounded-2xl">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.latency}</p>
          <p className={`text-xl font-black mt-1 ${svc.latencyMs === null ? 'text-slate-600' : svc.latencyMs < 500 ? 'text-emerald-400' : svc.latencyMs < 2000 ? 'text-amber-400' : 'text-red-400'}`}>
            {svc.latencyMs !== null ? `${svc.latencyMs} ${t.ms}` : 'ÔÇö'}
          </p>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-2xl overflow-hidden">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.last_checked}</p>
          <p className="text-xs text-slate-400 mt-1 font-mono truncate">
            {svc.checkedAt ? new Date(svc.checkedAt).toLocaleTimeString() : 'ÔÇö'}
          </p>
        </div>
      </div>

      {/* Endpoint */}
      <div className="flex items-center gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-850">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex-shrink-0">{t.endpoint}</p>
        <a
          href={svc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 hover:text-white transition-colors font-mono truncate flex items-center gap-1"
        >
          {svc.url}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </div>

      {/* Error detail */}
      {svc.errorMessage && (
        <div className="px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl">
          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{t.error}</p>
          <p className="text-xs text-red-400 font-mono">{svc.errorMessage}</p>
        </div>
      )}
    </motion.div>
  );
}

// ÔöÇÔöÇÔöÇ Page ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
export default function ServerHealthPage() {
  const { language } = useLanguage();
  const lang = (language || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const t = (HEALTH_STRINGS[lang] || HEALTH_STRINGS.EN) as typeof HEALTH_STRINGS.EN;
  const { health, isChecking, refresh } = useServiceStatus(10_000);

  const [slaHistory, setSlaHistory] = useState<any[]>(() => []);
  const [slaSource, setSlaSource] = useState<'prng' | 'database'>('database');
  const [hoveredDay, setHoveredDay] = useState<{ date: string; db: number; email: number; ai: number; images: number; smithsonian: number; unsplash: number; status: string } | null>(null);


  const getServiceStats = (id: 'db' | 'email' | 'ai' | 'images' | 'smithsonian' | 'unsplash') => {
    if (!slaHistory || slaHistory.length === 0) {
      return {
        avg: '0.00%',
        downtime: t.no_data || 'No data',
        incident: t.db_conn_req || 'Database connection required'
      };
    }
    const sum = slaHistory.reduce((acc, entry) => acc + (entry[id] ?? 100), 0);
    const avg = sum / slaHistory.length;

    const downtimeHours = slaHistory.reduce((acc, entry) => acc + (100 - (entry[id] ?? 100)) / 100 * 24, 0);

    let downtimeStr = '';
    if (downtimeHours === 0) {
      downtimeStr = t.no_downtime || 'No downtime';
    } else if (downtimeHours < 1) {
      const mins = Math.round(downtimeHours * 60);
      downtimeStr = (t.downtime_min || 'Downtime: {min}m').replace('{min}', String(mins));
    } else {
      const hrs = downtimeHours.toFixed(1);
      downtimeStr = (t.downtime_hour || 'Downtime: {hour}h').replace('{hour}', String(hrs));
    }

    let incident = t.no_major_incidents || 'No major incidents';
    if (avg < 100) {
      if (id === 'db') incident = t.inc_db_upgrade || 'Incident: Replica DB upgrade';
      if (id === 'email') incident = t.inc_rate_limit || 'Incident: Rate-limit tuning';
      if (id === 'ai') incident = t.inc_quota_scaling || 'Incident: LLM quota scaling';
      if (id === 'images') incident = t.inc_oom || 'Incident: Batch out-of-memory';
      if (id === 'smithsonian') incident = (t as any).inc_smithsonian || 'Incident: Smithsonian rate-limiting';
      if (id === 'unsplash') incident = (t as any).inc_unsplash || 'Incident: Unsplash credit exhaustion';
    }

    return {
      avg: `${avg.toFixed(2)}%`,
      downtime: downtimeStr,
      incident
    };
  };

  const overallAvg = (() => {
    if (!slaHistory || slaHistory.length === 0) return 0;
    let total = 0;
    slaHistory.forEach(day => {
      total += (day.db + day.email + day.ai + day.images + (day.smithsonian ?? 100) + (day.unsplash ?? 100)) / 6;
    });
    return total / slaHistory.length;
  })();

  const getDayStatus = (dayData: typeof slaHistory[0]) => {
    const vals = [dayData.db, dayData.email, dayData.ai, dayData.images, dayData.smithsonian ?? 100, dayData.unsplash ?? 100];
    const maxVal = Math.max(...vals);
    if (maxVal === 0) return 'no_data';
    
    const minVal = Math.min(...vals);
    if (minVal < 98) return 'outage';
    if (minVal < 100) return 'degraded';
    return 'nominal';
  };

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [smithsonianApiKey, setSmithsonianApiKey] = useState('');
  const [unsplashApiKey, setUnsplashApiKey] = useState('');
  const [showSbKey, setShowSbKey] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showSmithsonianKey, setShowSmithsonianKey] = useState(false);
  const [showUnsplashKey, setShowUnsplashKey] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  // Load hot-swap keys and SLA history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('op_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
      setSupabaseAnonKey(localStorage.getItem('op_supabase_anon_key') || '');
      setResendApiKey(localStorage.getItem('op_resend_api_key') || '');
      setGeminiApiKey(localStorage.getItem('op_gemini_api_key') || '');
      setSmithsonianApiKey(localStorage.getItem('op_smithsonian_api_key') || '');
      setUnsplashApiKey(localStorage.getItem('op_unsplash_api_key') || '');

      // Fetch dynamic database SLA History
      const fetchSla = async () => {
        try {
          const adminSession = localStorage.getItem('op_session') || '';
          const headers: Record<string, string> = {};
          if (localStorage.getItem('op_supabase_url')) headers['x-supabase-url'] = localStorage.getItem('op_supabase_url') || '';
          if (localStorage.getItem('op_supabase_anon_key')) headers['x-supabase-anon-key'] = localStorage.getItem('op_supabase_anon_key') || '';
          if (adminSession === 'true') headers['x-admin-session'] = 'true';

          const res = await fetch('/api/health/sla', { headers });
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setSlaHistory(json.data);
              setSlaSource(json.source);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch database SLA history", err);
        }
      };
      fetchSla();
    }
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl && supabaseUrl !== process.env.NEXT_PUBLIC_SUPABASE_URL) localStorage.setItem('op_supabase_url', supabaseUrl);
    else localStorage.removeItem('op_supabase_url');

    if (supabaseAnonKey) localStorage.setItem('op_supabase_anon_key', supabaseAnonKey);
    else localStorage.removeItem('op_supabase_anon_key');

    if (resendApiKey) localStorage.setItem('op_resend_api_key', resendApiKey);
    else localStorage.removeItem('op_resend_api_key');

    if (geminiApiKey) localStorage.setItem('op_gemini_api_key', geminiApiKey);
    else localStorage.removeItem('op_gemini_api_key');

    if (smithsonianApiKey) localStorage.setItem('op_smithsonian_api_key', smithsonianApiKey);
    else localStorage.removeItem('op_smithsonian_api_key');

    if (unsplashApiKey) localStorage.setItem('op_unsplash_api_key', unsplashApiKey);
    else localStorage.removeItem('op_unsplash_api_key');

    setNotif(t.keys_applied || 'API Keys successfully hot-swapped!');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const handleResetKeys = () => {
    localStorage.removeItem('op_supabase_url');
    localStorage.removeItem('op_supabase_anon_key');
    localStorage.removeItem('op_resend_api_key');
    localStorage.removeItem('op_gemini_api_key');
    localStorage.removeItem('op_smithsonian_api_key');
    localStorage.removeItem('op_unsplash_api_key');
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
    setSupabaseAnonKey('');
    setResendApiKey('');
    setGeminiApiKey('');
    setSmithsonianApiKey('');
    setUnsplashApiKey('');
    setNotif(t.keys_reset || 'Returned to default server keys.');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const services = Object.values(health);
  const allOk = services.every(s => s.status === 'ok');
  const anyOffline = services.some(s => s.status === 'offline');

  const strings = {
    EN: {
      cfg_title: '­ƒøá´©Å Hot-Swap API Keys Configurator',
      cfg_desc: 'Temporarily override server environment keys in this browser session. Securely passed in authenticated request headers.',
      lbl_sb_url: 'Supabase Project URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API Key',
      lbl_gemini: 'Gemini API Key or Service Account JSON',
      lbl_smithsonian: 'Smithsonian API Key',
      lbl_unsplash: 'Unsplash Access Key',
      btn_apply: 'Apply Hot-Swap Keys',
      btn_reset: 'Reset to Defaults'
    },
    FR: {
      cfg_title: '­ƒøá´©Å Configurateur de Cl├®s API ├á Chaud',
      cfg_desc: 'Surcharger temporairement les cl├®s serveurs pour cette session de navigateur. Transmis en toute s├®curit├® via en-t├¬tes requ├¬tes.',
      lbl_sb_url: 'URL du Projet Supabase',
      lbl_sb_key: 'Cl├® Publique Anon Supabase',
      lbl_resend: 'Cl├® API Resend',
      lbl_gemini: 'Cl├® API Gemini ou Compte de Service JSON',
      lbl_smithsonian: 'Cl├® API Smithsonian',
      lbl_unsplash: "Cl├® d'Acc├¿s Unsplash",
      btn_apply: 'Appliquer les Cl├®s',
      btn_reset: 'R├®initialiser aux D├®fauts'
    },
    ES: {
      cfg_title: '­ƒøá´©Å Configurador de Claves API en Caliente',
      cfg_desc: 'Anule temporalmente las claves del servidor en esta sesi├│n. Transmitido de forma segura a trav├®s de encabezados.',
      lbl_sb_url: 'URL del Proyecto Supabase',
      lbl_sb_key: 'Clave P├║blica Anon Supabase',
      lbl_resend: 'Clave API Resend',
      lbl_gemini: 'Clave API Gemini o Cuenta de Servicio JSON',
      lbl_smithsonian: 'Clave API Smithsonian',
      lbl_unsplash: 'Clave de Acceso Unsplash',
      btn_apply: 'Aplicar Cambios',
      btn_reset: 'Restablecer Valores'
    },
    DE: {
      cfg_title: '­ƒøá´©Å Hot-Swap API-Schl├╝ssel Konfigurator',
      cfg_desc: 'Server-Umgebungsschl├╝ssel in dieser Sitzung vor├╝bergehend ├╝berschreiben. Sicher ├╝bertragen ├╝ber Anfrage-Header.',
      lbl_sb_url: 'Supabase Projekt-URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API-Schl├╝ssel',
      lbl_gemini: 'Gemini API-Schl├╝ssel oder Service-Account-JSON',
      lbl_smithsonian: 'Smithsonian API-Schl├╝ssel',
      lbl_unsplash: 'Unsplash-Zugriffsschl├╝ssel',
      btn_apply: 'Schl├╝ssel anwenden',
      btn_reset: 'Auf Standard zur├╝cksetzen'
    },
    ZH: {
      cfg_title: '­ƒøá´©Å þâ¡µÅÆµïö API Õ»åÚÆÑÚàìþ¢«ÕÖ¿',
      cfg_desc: 'Õ£¿Õ¢ôÕëìµÁÅÞºêÕÖ¿õ╝ÜÞ»Øõ©¡õ©┤µùÂÞªåþøûµ£ìÕèíÕÖ¿þÄ»ÕóâÕÅÿÚçÅÕ»åÚÆÑÒÇéÕ»åÚÆÑÚÇÜÞ┐çÕ«ëÕà¿Þ»Àµ▒éÕñ┤Õè¿µÇüõ╝áÞ¥ôÒÇé',
      lbl_sb_url: 'Supabase Úí╣þø« URL',
      lbl_sb_key: 'Supabase Anon Õà¼ÚÆÑ',
      lbl_resend: 'Resend Úé«õ╗Â API Õ»åÚÆÑ',
      lbl_gemini: 'Gemini API Õ»åÚÆÑµêûµ£ìÕèíÞ┤ªÕÅÀ JSON',
      lbl_smithsonian: 'Smithsonian API Õ»åÚÆÑ',
      lbl_unsplash: 'Unsplash Þ«┐Úù«Õ»åÚÆÑ',
      btn_apply: 'Õ║öþö¿þâ¡µÅÆµïöÕ»åÚÆÑ',
      btn_reset: 'Úçìþ¢«õ©║Ú╗ÿÞ«ñÕÇ╝'
    },
    PT: {
      cfg_title: '­ƒøá´©Å Configurador de Chaves API Hot-Swap',
      cfg_desc: 'Substituir temporariamente as chaves do ambiente do servidor nesta sess├úo do navegador. Passado com seguran├ºa em cabe├ºalhos de solicita├º├úo autenticados.',
      lbl_sb_url: 'URL do Projeto Supabase',
      lbl_sb_key: 'Chave P├║blica Anon do Supabase',
      lbl_resend: 'Chave API Resend',
      lbl_gemini: 'Chave API Gemini ou JSON da Conta de Servi├ºo',
      lbl_smithsonian: 'Chave API Smithsonian',
      lbl_unsplash: 'Chave de Acesso Unsplash',
      btn_apply: 'Aplicar Chaves Hot-Swap',
      btn_reset: 'Repor Padr├Áes'
    },
    AR: {
      cfg_title: '­ƒøá´©Å ┘à┘â┘ê┘å ┘à┘üÏºÏ¬┘èÏ¡ ┘êÏºÏ¼┘çÏ® Ï¿Ï▒┘àÏ¼Ï® Ïº┘äÏ¬ÏÀÏ¿┘è┘éÏºÏ¬ Ïº┘äÏ│ÏºÏ«┘å (Hot-Swap)',
      cfg_desc: 'Ï¬Ï¼Ïº┘êÏ▓ ┘àÏñ┘éÏ¬ ┘ä┘à┘üÏºÏ¬┘èÏ¡ Ï¿┘èÏªÏ® Ïº┘äÏ«ÏºÏ»┘à ┘ü┘è Ï¼┘äÏ│Ï® Ïº┘ä┘àÏ¬ÏÁ┘üÏ¡ ┘çÏ░┘ç. ┘èÏ¬┘à Ï¬┘àÏ▒┘èÏ▒┘çÏº Ï¿Ïú┘àÏº┘å ┘ü┘è Ï▒Ïñ┘êÏ│ Ïº┘äÏÀ┘äÏ¿ÏºÏ¬ Ïº┘ä┘àÏÁÏºÏ»┘é Ï╣┘ä┘è┘çÏº.',
      lbl_sb_url: 'Ï▒ÏºÏ¿ÏÀ ┘àÏ┤Ï▒┘êÏ╣ Supabase',
      lbl_sb_key: 'Ïº┘ä┘à┘üÏ¬ÏºÏ¡ Ïº┘äÏ╣Ïº┘à Ïº┘ä┘àÏ¼┘ç┘ê┘ä ┘ä┘Ç Supabase',
      lbl_resend: '┘à┘üÏ¬ÏºÏ¡ ┘êÏºÏ¼┘çÏ® Ï¿Ï▒┘àÏ¼Ï® Ï¬ÏÀÏ¿┘è┘éÏºÏ¬ Resend',
      lbl_gemini: '┘à┘üÏ¬ÏºÏ¡ ┘êÏºÏ¼┘çÏ® Gemini Ïú┘ê ┘à┘ä┘ü JSON ┘äÏ¡Ï│ÏºÏ¿ Ïº┘äÏ«Ï»┘àÏ®',
      lbl_smithsonian: '┘à┘üÏ¬ÏºÏ¡ ┘êÏºÏ¼┘çÏ® Smithsonian',
      lbl_unsplash: '┘à┘üÏ¬ÏºÏ¡ ┘êÏÁ┘ê┘ä Unsplash',
      btn_apply: 'Ï¬ÏÀÏ¿┘è┘é ┘à┘üÏºÏ¬┘èÏ¡ Ïº┘äÏºÏ│Ï¬Ï¿Ï»Ïº┘ä Ïº┘äÏ│ÏºÏ«┘å',
      btn_reset: 'ÏÑÏ╣ÏºÏ»Ï® Ï¬Ï╣┘è┘è┘å ÏÑ┘ä┘ë Ïº┘äÏº┘üÏ¬Ï▒ÏºÏÂ┘èÏºÏ¬'
    },
    HI: {
      cfg_title: '­ƒøá´©Å Óñ╣ÓÑëÓñƒ-Óñ©ÓÑìÓñÁÓÑêÓñ¬ API ÓñòÓÑüÓñéÓñ£Óñ┐Óñ»Óñ¥Óñü ÓñòÓÑëÓñ¿ÓÑìÓñ½Óñ╝Óñ┐ÓñùÓñ░Óñ░',
      cfg_desc: 'ÓñçÓñ© Óñ¼ÓÑìÓñ░Óñ¥ÓñëÓñ£Óñ╝Óñ░ Óñ©ÓññÓÑìÓñ░ Óñ«ÓÑçÓñé Óñ©Óñ░ÓÑìÓñÁÓñ░ Óñ¬Óñ░ÓÑìÓñ»Óñ¥ÓñÁÓñ░Óñú ÓñòÓÑüÓñéÓñ£Óñ┐Óñ»ÓÑïÓñé ÓñòÓÑï ÓñàÓñ©ÓÑìÓñÑÓñ¥Óñ»ÓÑÇ Óñ░ÓÑéÓñ¬ Óñ©ÓÑç ÓñôÓñÁÓñ░Óñ░Óñ¥ÓñçÓñí ÓñòÓñ░ÓÑçÓñéÓÑñ Óñ¬ÓÑìÓñ░Óñ«Óñ¥ÓñúÓñ┐Óññ ÓñàÓñ¿ÓÑüÓñ░ÓÑïÓñº Óñ╣ÓÑçÓñíÓñ░ Óñ«ÓÑçÓñé Óñ©ÓÑüÓñ░ÓñòÓÑìÓñÀÓñ┐Óññ Óñ░ÓÑéÓñ¬ Óñ©ÓÑç Óñ¬Óñ¥Óñ░Óñ┐Óññ ÓñòÓñ┐Óñ»Óñ¥ ÓñùÓñ»Óñ¥ÓÑñ',
      lbl_sb_url: 'Supabase Óñ¬ÓÑìÓñ░ÓÑïÓñ£ÓÑçÓñòÓÑìÓñƒ URL',
      lbl_sb_key: 'Supabase ÓñàÓñ¿Óñ¥Óñ« Óñ©Óñ¥Óñ░ÓÑìÓñÁÓñ£Óñ¿Óñ┐Óñò ÓñòÓÑüÓñéÓñ£ÓÑÇ',
      lbl_resend: 'Resend API ÓñòÓÑüÓñéÓñ£ÓÑÇ',
      lbl_gemini: 'Gemini API ÓñòÓÑüÓñéÓñ£ÓÑÇ Óñ»Óñ¥ Óñ©ÓÑçÓñÁÓñ¥ ÓñûÓñ¥ÓññÓñ¥ JSON',
      lbl_smithsonian: 'Smithsonian API ÓñòÓÑüÓñéÓñ£ÓÑÇ',
      lbl_unsplash: 'Unsplash ÓñÅÓñòÓÑìÓñ©ÓÑçÓñ© ÓñòÓÑüÓñéÓñ£ÓÑÇ',
      btn_apply: 'Óñ╣ÓÑëÓñƒ-Óñ©ÓÑìÓñÁÓÑêÓñ¬ ÓñòÓÑüÓñéÓñ£Óñ┐Óñ»Óñ¥Óñü Óñ▓Óñ¥ÓñùÓÑé ÓñòÓñ░ÓÑçÓñé',
      btn_reset: 'ÓñíÓñ┐Óñ½Óñ╝ÓÑëÓñ▓ÓÑìÓñƒ Óñ¬Óñ░ Óñ░ÓÑÇÓñ©ÓÑçÓñƒ ÓñòÓñ░ÓÑçÓñé'
    },
    UR: {
      cfg_title: '­ƒøá´©Å █üÏº┘╣-Ï│┘ê┘¥ API ┌®█îÏ▓ ┌®┘å┘ü█î┌»Ï▒Ï▒',
      cfg_desc: 'ÏºÏ│ Ï¿Ï▒ÏºÏñÏ▓Ï▒ Ï│█îÏ┤┘å ┘à█î┌║ Ï╣ÏºÏ▒ÏÂ█î ÏÀ┘êÏ▒ ┘¥Ï▒ Ï│Ï▒┘êÏ▒ ┌®█î ┘àÏºÏ¡┘ê┘ä█îÏºÏ¬█î ┌®█îÏ▓ ┌®┘ê Ïº┘ê┘êÏ▒ Ï▒ÏºÏª█î┌ê ┌®Ï▒█î┌║█ö Ï¬ÏÁÏ»█î┘é Ï┤Ï»█ü Ï»Ï▒Ï«┘êÏºÏ│Ï¬ █ü█î┌êÏ▒Ï▓ ┘à█î┌║ ┘àÏ¡┘ü┘êÏ© ÏÀÏ▒█î┘é█Æ Ï│█Æ ┘à┘åÏ¬┘é┘ä ┌®█îÏº Ï¼ÏºÏ¬Ïº █ü█Æ█ö',
      lbl_sb_url: 'Supabase ┘¥Ï▒┘êÏ¼█î┌®┘╣ URL',
      lbl_sb_key: 'Supabase Anon ┘¥Ï¿┘ä┌® ┌®█î',
      lbl_resend: 'Resend API ┌®█î',
      lbl_gemini: 'Gemini API ┌®█î █îÏº Ï│Ï▒┘êÏ│ Ïº┌®ÏºÏñ┘å┘╣ JSON',
      lbl_smithsonian: 'Smithsonian API ┌®█î',
      lbl_unsplash: 'Unsplash Ïº█î┌®Ï│█îÏ│ ┌®█î',
      btn_apply: '█üÏº┘╣-Ï│┘ê┘¥ ┌®█îÏ▓ ┘äÏº┌»┘ê ┌®Ï▒█î┌║',
      btn_reset: '┌ê█î┘üÏº┘ä┘╣ ┘¥Ï▒ Ï▒█î Ï│█î┘╣ ┌®Ï▒█î┌║'
    }
  };

  const currentCfg = strings[lang] || strings.EN;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <Activity className={`w-8 h-8 ${allOk ? 'text-emerald-500' : anyOffline ? 'text-red-500' : 'text-amber-500'}`} />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
          <p className="text-slate-700 text-[10px] pt-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <RefreshCw className="w-3 h-3 animate-pulse" /> {t.auto_refresh}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={refresh}
            disabled={isChecking}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? t.refreshing : t.refresh}
          </button>
        </div>
      </div>

      {/* Global status banner */}
      {allOk && (
        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-300">{t.status_ok} ÔÇö {(t as any).sys_all_nominal || 'All systems nominal'}</p>
        </div>
      )}
      {anyOffline && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <WifiOff className="w-5 h-5 text-red-400" />
          <p className="text-sm font-semibold text-red-300">{t.status_offline} ÔÇö {(t as any).sys_unreachable || 'One or more services are unreachable'}</p>
        </div>
      )}

      {/* SECTION: DOWNTIME OVER LAST 365 DAYS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 border border-slate-800 hover:border-emerald-500/20 rounded-[32px] bg-slate-900/40 space-y-6 transition-all"
      >
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            {t.sla_title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            {t.sla_desc}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            { id: 'db' as const, name: 'Supabase DB', label: t.lbl_database, color: 'text-emerald-400' },
            { id: 'email' as const, name: 'Resend API', label: t.lbl_email, color: 'text-blue-400' },
            { id: 'ai' as const, name: 'Gemini AI', label: t.lbl_ai, color: 'text-violet-400' },
            { id: 'images' as const, name: 'Pollinations.ai', label: t.lbl_images, color: 'text-orange-400' },
            { id: 'smithsonian' as const, name: 'Smithsonian API', label: (t as any).lbl_smithsonian || 'Smithsonian', color: 'text-sky-400' },
            { id: 'unsplash' as const, name: 'Unsplash API', label: (t as any).lbl_unsplash || 'Unsplash', color: 'text-amber-400' },
          ].map(s => {
            const stats = getServiceStats(s.id);
            return (
              <div key={s.id} className="p-6 bg-slate-950/60 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50" />
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider block mb-1">{s.label}</span>
                  <h4 className="text-base font-bold text-slate-200">{s.name}</h4>
                  <p className={`text-2xl font-black mt-3 ${s.color}`}>{stats.avg}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-slate-400 font-mono">{stats.downtime}</span>
                  <span className="text-[8px] font-bold text-slate-650 group-hover:text-slate-500 transition-colors uppercase tracking-wider">{stats.incident}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Year-long SLA grid timeline */}
        <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-850 space-y-4">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400 min-h-8">
              {hoveredDay ? (
                <div className="flex items-center justify-between w-full text-[10px] text-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-extrabold font-mono">
                      {new Date(hoveredDay.date).toLocaleDateString({ EN: 'en-US', FR: 'fr-FR', ES: 'es-ES', DE: 'de-DE', ZH: 'zh-CN', PT: 'pt-BR', AR: 'ar-SA', HI: 'hi-IN', UR: 'ur-PK' }[lang] || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      hoveredDay.status === 'nominal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : hoveredDay.status === 'degraded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' 
                      : hoveredDay.status === 'no_data' ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                    }`}>
                      {hoveredDay.status === 'nominal' ? (t.status_nominal || 'Nominal')
                        : hoveredDay.status === 'degraded' ? (t.status_degraded || 'Degraded')
                        : hoveredDay.status === 'no_data' ? (t.status_no_data || 'No Log Data')
                        : (t.status_outage || 'Outage')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_database || 'DB'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.db < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.db}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_email || 'Email'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.email < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.email}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_ai || 'AI'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.ai < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.ai}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_images || 'Images'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.images < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.images}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{(t as any).lbl_smithsonian || 'Smithsonian'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.smithsonian ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.smithsonian ?? 100}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{(t as any).lbl_unsplash || 'Unsplash'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.unsplash ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? 'ÔÇö' : `${hoveredDay.unsplash ?? 100}%`}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span>{t.sla_grid_title}</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">
                    {overallAvg.toFixed(3)}% {t.overall_avg}
                  </span>
                </div>
              )}
            </div>
            
            {slaHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-[10px] font-semibold gap-2 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/20">
                <WifiOff className="w-6 h-6 text-slate-650 animate-pulse" />
                <span>
                  {t.no_avail_data}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-rows-7 grid-flow-col gap-[3.5px] overflow-x-auto py-2 pr-2 select-none justify-start max-w-full">
                   {slaHistory.map((dayData, idx) => {
                     const status = getDayStatus(dayData);
                     const color = status === 'nominal' ? 'bg-emerald-500 border-emerald-400/20 shadow-[0_0_4px_rgba(16,185,129,0.1)] hover:bg-emerald-400'
                        : status === 'degraded' ? 'bg-amber-500 border-amber-400/20 shadow-[0_0_4px_rgba(245,158,11,0.1)] hover:bg-amber-400'
                        : status === 'no_data' ? 'bg-slate-850/60 border-slate-800/80 shadow-none hover:bg-slate-800 hover:border-slate-700'
                        : 'bg-red-500 border-red-400/20 shadow-[0_0_4px_rgba(239,68,68,0.1)] hover:bg-red-400';

                     const isHovered = hoveredDay?.date === dayData.date;

                     return (
                       <div 
                         key={idx}
                         className={`w-3.5 h-3.5 rounded-sm border cursor-help transition-all duration-100 ${color} ${
                           isHovered 
                             ? 'scale-125 border-slate-100 shadow-[0_0_8px_rgba(255,255,255,0.4)] z-10' 
                             : ''
                         }`}
                         onMouseEnter={() => setHoveredDay({ ...dayData, status })}
                         onMouseLeave={() => setHoveredDay(null)}
                       />
                     );
                   })}
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-650 tracking-widest pt-2">
                   <span>{t.days_ago}</span>
                   <div className="flex gap-4">
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500 border border-emerald-400" /> {t.status_nominal}</span>
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500 border border-amber-400" /> {t.status_degraded}</span>
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500 border border-red-400" /> {t.status_outage}</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-850 border border-slate-800" /> {t.status_no_data || 'No Log Data'}</span>
                   </div>
                   <span>{t.today}</span>
                </div>
              </>
            )}
         </div>
      </motion.div>

        {/* Hot-Swap API Keys Configurator Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border border-slate-800 hover:border-blue-500/20 rounded-[32px] bg-slate-900/30 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-lg font-black text-white">{currentCfg.cfg_title}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{currentCfg.cfg_desc}</p>
          </div>

          {notif && (
            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-blue-400 text-xs font-black uppercase tracking-widest">
              {notif}
            </div>
          )}

          <form onSubmit={handleSaveKeys} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_url}</label>
              <input
                type="text"
                autoComplete="new-password"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="w-full bg-slate-955 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_key}</label>
              <div className="relative">
                <input
                  type={showSbKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={supabaseAnonKey}
                  onChange={e => setSupabaseAnonKey(e.target.value)}
                  placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowSbKey(!showSbKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showSbKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_resend}</label>
              <div className="relative">
                <input
                  type={showResendKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={resendApiKey}
                  onChange={e => setResendApiKey(e.target.value)}
                  placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowResendKey(!showResendKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_gemini}</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder={geminiApiKey && geminiApiKey.trim().startsWith('{') ? "Service Account JSON loaded..." : "ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <label className="text-[9px] font-bold text-slate-500 hover:text-white transition-colors cursor-pointer bg-slate-800/60 border border-slate-750 rounded-lg px-2.5 py-1.5 active:scale-[0.98]">
                  <span>Upload Service Account JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          try {
                            JSON.parse(text);
                            setGeminiApiKey(text);
                            setShowGeminiKey(false);
                          } catch (err) {
                            alert("Invalid JSON file!");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                {geminiApiKey && geminiApiKey.trim().startsWith('{') && (
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded-lg">
                    JSON Key Loaded
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_smithsonian || 'Smithsonian API Key'}</label>
              <div className="relative">
                <input
                  type={showSmithsonianKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={smithsonianApiKey}
                  onChange={e => setSmithsonianApiKey(e.target.value)}
                  placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowSmithsonianKey(!showSmithsonianKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showSmithsonianKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_unsplash || 'Unsplash Access Key'}</label>
              <div className="relative">
                <input
                  type={showUnsplashKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={unsplashApiKey}
                  onChange={e => setUnsplashApiKey(e.target.value)}
                  placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowUnsplashKey(!showUnsplashKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showUnsplashKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 px-6 py-4.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]"
              >
                {currentCfg.btn_apply}
              </button>
              <button
                type="button"
                onClick={handleResetKeys}
                className="px-6 py-4.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
              >
                {currentCfg.btn_reset}
              </button>
            </div>
          </form>
        </motion.div>

        

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(svc => (
            <ServiceCard key={svc.id} svc={svc} t={t} lang={lang} />
          ))}
        </div>
    </div>
  );
}
