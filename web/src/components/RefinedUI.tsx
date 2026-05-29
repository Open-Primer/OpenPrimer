"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain, Loader2, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from './OpenPrimerIcon';
import { COURSE_SYLLABUS_DETAILS } from './StaticPages';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, TutorPersonality } from '@/lib/db';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
const STATIC_UI_STRINGS = {
  EN: { 
    my_progress: "My Progress", admin: "Admin Console", settings: "Account Settings",
    terms: "Terms of Service", privacy: "Privacy Sovereignty",
    copyright: "© 2026 OpenPrimer Project • Global AI Academic Repository",
    all: "All", saved: "Saved", physics: "Physics", biology: "Biology", law: "Law", math: "Mathematics", search: "Search modules...",
    tagline: "The Future of Open Academic Sovereignty",
    cta_start: "Start Learning", cta_foundation: "Explore Foundation",
    tutor: "AI Tutor", placeholder: "Ask a question...", welcome: "Hello! I am your OpenPrimer tutor.",
    copy: "Link copied!", report: "Report", signout: "Sign Out", login: "Log In", signup: "Sign In", profile: "My Profile",
    delete: "Delete Account", langLabel: "Language",
    foundation: "Foundation", curriculum: "Curriculum", legal: "Legal",
    philosophy: "Our Philosophy", contact: "Contact Support", opensource: "Open Source",
    languages: "Languages", elite: "Elite",
    mission: "Universal Academic Sovereignty", mission_sub: "Project Manifesto",
    mission_desc: "OpenPrimer is built on the belief that elite education is a fundamental human right, not a localized privilege.",
    accessibility: "Radical Accessibility", accessibility_desc: "We eliminate linguistic barriers by providing all certified academic content in the 5 most spoken global languages.",
    quality: "Institutional Quality", quality_desc: "Every module on OpenPrimer is aligned with international standards (ECTS, US Credits).",
    methodology: "Methodology", methodology_desc: "The Feynman Methodology",
    transparency: "Radical Transparency", transparency_desc: "The logic of education should never be a black box. OpenPrimer is 100% Open Source.",
    universal_knowledge: "Universal Knowledge.", finally_free: "Finally Free.",
    summary: "OpenPrimer synthesizes the entirety of academic curricula, from primary school to Bachelor's degree, into a single, interactive, and AI-tutored experience.",
    rigor: "Academic Rigor", rigor_desc: "Full university curricula synthesized with the Feynman method for maximum depth.",
    tutor_desc: "Context-aware AI tutoring directly integrated into every learning module.",
    multilingual_desc: "Native support for EN, FR, ES, DE, and ZH. Breaking the language barrier in education.",
    mission_link: "Learn about our vision", beta_tag: "", elite_tag: "Elite", new_tag: "New", try_label: "Try:",
    socratic: "Socratic Method", pragmatic: "Pragmatic Mode", academic: "Rigorous Academic",
    give_example: "Give Example", tell_story: "Tell Story", simplify: "Simplify", test_me: "Test Me",
    analysis: "Academic analysis in progress...", mode_default: "Default", mode_paper: "Paper", mode_focus: "Focus",
    footer_desc: "Universalizing elite academic knowledge through recursive AI-assisted pedagogy.",
    logged_in_as: "Logged in as", my_curriculum: "My Curriculum", catalog: "Browse Catalog",
    account_mgmt: "Account Management", profile_settings: "Profile Settings",
    personal_info: "Personal Information", first_name: "First Name", last_name: "Last Name", email_addr: "Email Address",
    save_changes: "Save Changes", preferences: "Preferences", preferred_lang: "Preferred Language",
    lang_desc: "Global UI and tutor interaction language.", danger_zone: "Danger Zone",
    delete_account: "Delete Account", delete_desc: "This action is permanent. All progress will be lost.",
    profile_updated: "Profile Updated Successfully",
    total_credits: "Total Credits", knowledge_points: "Knowledge Points", learning_time: "Learning Time",
    active_modules: "Active Modules", progress: "Progress", tutor_summary: "AI Pedagogical Summary",
    tutor_feedback: "Academic Feedback", curriculum_overview: "Your Curriculum Overview",
    classical_mechanics: "Classical Mechanics", cell_biology: "Cell Biology", constitutional_law: "Constitutional Law",
    search_course: "Search this course...", course_progress: "Course Progress",
    password: "Password", confirm_password: "Confirm Password", create_account: "Create an Account",
    begin_journey: "Begin your journey", validate_reg: "Validate Registration", already_registered: "Already registered?",
    access_repo: "Access the Repository", verified_success: "Account validated successfully!",
    verified_desc: "Your registration is confirmed. Connect now to choose your courses and compose your curriculum.",
    new_to_op: "New to OpenPrimer?", create_an_account: "Create an Account", verify_email: "Verify Email",
    verify_sent: "A validation link has been sent to", verify_confirm: "Please confirm your email to unlock your access.",
    simulated_email: "SIMULATED EMAIL", welcome_to_op: "Welcome to OpenPrimer!", verify_and_login: "Verify Account & Log In",
    back: "Back", first_name_placeholder: "John", last_name_placeholder: "Doe", forgot_password: "Forgot Password?",
    reset_password: "Reset Password", send_reset_link: "Send Reset Link", back_to_login: "Back to Login",
    enter_email: "Enter your email address", email_sent: "A password reset link has been sent to your email address.",
    sign_in_google: "Continue with Google", password_complexity_error: "Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.",
    passwords_dont_match: "Passwords do not match.", all_fields_required: "Please fill in all required fields.",
    invalid_credentials: "Incorrect credentials. Please verify your email and password.", verifying: "Verifying...",
    welcome_back: "Welcome Back", continue_journey: "Continue your universal learning journey.",
    free_account_desc: "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!",
    or_continue_with: "Or continue with", join_future: "Join the Future", access_knowledge: "Access the world's knowledge for free.",
    sign_up_free: "Sign Up for Free", active_account: "Account Activated!",
    activation_success: "Your email address has been successfully validated. Redirecting to your course catalog...",
    real_email_sent: "✉️ A real validation email has been sent via Resend. Please click the confirmation link in your inbox.",
    simulated_inbox: "MAILBOX SIMULATOR", hello: "Hello", real_url_generated: "Real generated URL:",
    return_to_form: "Return to Form", course_select_optional: "Select Initial Courses (Optional)",
    password_placeholder: "••••••••••••", validation_in_progress: "Validation in progress",
    validation_verifying_desc: "We are verifying your secure validation code...", resend_email_dispatched: "An email verification link has been sent.",
    mailbox_sim_title: "MAILBOX SIMULATOR", forgot_question: "Forgot?", email_required_error: "Please enter your email and password."
  },
  FR: { 
    my_progress: "Mon Progrès", admin: "Console Admin", settings: "Paramètres",
    terms: "Conditions d'Utilisation", privacy: "Souveraineté des Données",
    copyright: "© 2026 Projet OpenPrimer • Répertoire Académique Mondial d'IA",
    all: "Tous", saved: "Favoris", physics: "Physique", biology: "Biologie", law: "Droit", math: "Mathématiques", search: "Rechercher des modules...",
    tagline: "L'Avenir de la Souveraineté Académique Libre",
    cta_start: "Commencer", cta_foundation: "Explorer la Fondation",
    tutor: "Tuteur IA", placeholder: "Posez une question...", welcome: "Bonjour ! Je suis votre tuteur OpenPrimer.", 
    copy: "Lien copié !", report: "Signaler", signout: "Déconnexion", login: "Se connecter", signup: "S'inscrire", profile: "Mon Curriculum", 
    delete: "Supprimer le compte", langLabel: "Langue",
    foundation: "Fondation", curriculum: "Curriculum", legal: "Légal",
    philosophy: "Notre Philosophie", contact: "Contact Support", opensource: "Open Source",
    languages: "Langues", elite: "Élite",
    mission: "Souveraineté Académique Universelle", mission_sub: "Manifeste du Projet",
    mission_desc: "OpenPrimer repose sur la conviction que l'éducation d'élite est un droit humain fondamental, pas un privilège localisé.",
    accessibility: "Accessibilité Radicale", accessibility_desc: "Nous éliminons les barrières linguistiques en fournissant tout le contenu académique certifié dans les 5 langues les plus parlées au monde.",
    quality: "Qualité Institutionnelle", quality_desc: "Chaque module sur OpenPrimer est aligné sur les normes internationales (ECTS, US Credits).",
    methodology: "Méthodologie", methodology_desc: "La Méthodologie Feynman",
    transparency: "Transparence Radicale", transparency_desc: "L'éducation ne devrait jamais être une boîte noire. OpenPrimer est 100% Open Source.",
    universal_knowledge: "Le Savoir Universel.", finally_free: "Enfin Libre.",
    summary: "OpenPrimer synthétise l'intégralité des cursus académiques, du primaire au Bachelor, dans une expérience unique, interactive et tutorée par l'IA.",
    rigor: "Rigueur Académique", rigor_desc: "Des cursus universitaires complets synthétisés avec la méthode Feynman.",
    tutor_desc: "Tutorat IA contextuel intégré directement dans chaque module d'apprentissage.",
    multilingual_desc: "Support natif pour EN, FR, ES, DE et ZH. Briser la barrière de la langue.",
    mission_link: "Découvrir notre vision", beta_tag: "", elite_tag: "Élite", new_tag: "Nouveau", try_label: "Essayer :",
    socratic: "Méthode Socratique", pragmatic: "Mode Pragmatique", academic: "Rigueur Académique",
    give_example: "Donner un exemple", tell_story: "Raconter une histoire", simplify: "Simplifier", test_me: "M'évaluer",
    analysis: "Analyse académique en cours...", mode_default: "Défaut", mode_paper: "Papier", mode_focus: "Focus",
    footer_desc: "Universalisation du savoir académique d'élite via une pédagogie assistée par IA récursive.",
    logged_in_as: "Connecté en tant que", my_curriculum: "Mon Curriculum", catalog: "Parcourir le Catalogue",
    account_mgmt: "Gestion du Compte", profile_settings: "Paramètres du Profil",
    personal_info: "Informations Personnelles", first_name: "Prénom", last_name: "Nom", email_addr: "Adresse Email",
    save_changes: "Enregistrer", preferences: "Préférences", preferred_lang: "Langue Préférée",
    lang_desc: "Langue globale de l'interface et du tuteur.", danger_zone: "Zone de Danger",
    delete_account: "Supprimer le Compte", delete_desc: "Cette action est permanente. Tout le progrès sera perdu.",
    profile_updated: "Profil mis à jour avec succès",
    total_credits: "Crédits Totaux", knowledge_points: "Points de Savoir", learning_time: "Temps d'Apprentissage",
    active_modules: "Modules Actifs", progress: "Progression", tutor_summary: "Résumé Pédagogique IA",
    tutor_feedback: "Feedback Académique", curriculum_overview: "Aperçu de votre Curriculum",
    classical_mechanics: "Mécanique Classique", cell_biology: "Biologie Cellulaire", constitutional_law: "Droit Constitutionnel",
    search_course: "Rechercher dans ce cours...", course_progress: "Progression du Cours",
    password: "Mot de passe", confirm_password: "Confirmer le mot de passe", create_account: "Créer un Compte",
    begin_journey: "Commencer votre parcours", validate_reg: "Valider mon inscription", already_registered: "Déjà un compte ?",
    access_repo: "Accéder au Dépôt", verified_success: "Compte validé avec succès !",
    verified_desc: "Votre inscription est confirmée. Connectez-vous maintenant pour choisir vos cours et composer votre curriculum.",
    new_to_op: "Nouveau sur OpenPrimer ?", create_an_account: "Créer un compte", verify_email: "Vérifier l'Email",
    verify_sent: "Un lien de validation a été envoyé à", verify_confirm: "Veuillez confirmer votre email pour débloquer votre accès.",
    simulated_email: "EMAIL SIMULÉ", welcome_to_op: "Bienvenue sur OpenPrimer !", verify_and_login: "Valider mon compte & Se Connecter",
    back: "Retour", first_name_placeholder: "Jean", last_name_placeholder: "Dupont", forgot_password: "Mot de passe oublié ?",
    reset_password: "Réinitialiser le mot de passe", send_reset_link: "Envoyer le lien de réinitialisation", back_to_login: "Retour à la connexion",
    enter_email: "Entrez votre adresse email", email_sent: "Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.",
    sign_in_google: "Continuer avec Google", password_complexity_error: "Le mot de passe doit contenir au moins 12 caractères, incluant une lettre majuscule, une lettre minuscule, un nombre et un caractère spécial.",
    passwords_dont_match: "Les mots de passe ne correspondent pas.", all_fields_required: "Veuillez remplir tous les champs requis.",
    invalid_credentials: "Identifiants incorrects. Veuillez vérifier votre email et mot de passe.", verifying: "Vérification...",
    welcome_back: "Bon retour", continue_journey: "Continuez votre parcours d'apprentissage universel.",
    free_account_desc: "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !",
    or_continue_with: "Ou continuer avec", join_future: "Rejoindre le futur", access_knowledge: "Accédez gratuitement au savoir mondial.",
    sign_up_free: "S'inscrire gratuitement", active_account: "Compte activé !",
    activation_success: "Votre adresse email a été validée avec succès. Redirection vers votre catalogue de cours...",
    real_email_sent: "✉️ Un e-mail de validation réel a été envoyé via Resend. Veuillez cliquer sur le lien de confirmation présent dans votre boîte aux lettres.",
    simulated_inbox: "SIMULATEUR DE BOÎTE MAIL", hello: "Bonjour", real_url_generated: "URL Réelle générée :",
    return_to_form: "Retourner au formulaire", course_select_optional: "Sélectionner des Cours Initiaux (Optionnel)",
    password_placeholder: "••••••••••••", validation_in_progress: "Validation en cours",
    validation_verifying_desc: "Nous vérifions votre code de validation sécurisé...", resend_email_dispatched: "Un lien de vérification par e-mail a été envoyé.",
    mailbox_sim_title: "SIMULATEUR DE BOÎTE MAIL", forgot_question: "Oublié ?", email_required_error: "Veuillez renseigner votre email et votre mot de passe."
  },
  ES: { 
    my_progress: "Mi Progreso", admin: "Consola Admin", settings: "Ajustes",
    terms: "Términos de Servicio", privacy: "Soberanía de Privacidad",
    copyright: "© 2026 Fundación OpenPrimer • Consorcio Académico Europeo",
    all: "Todos", saved: "Guardados", physics: "Física", biology: "Biología", law: "Derecho", math: "Matemáticas", search: "Buscar módulos...",
    tagline: "El Futuro de la Soberanía Académica Abierta",
    cta_start: "Empezar", cta_foundation: "Explorar Fundación",
    tutor: "Tutor IA", placeholder: "Hacer una pregunta...", welcome: "¡Hola! Soy tu tutor OpenPrimer.", 
    copy: "¡Enlace copiado!", report: "Reportar", signout: "Cerrar sesión", login: "Iniciar sesión", signup: "Registrarse", profile: "Mi Currículo", 
    delete: "Eliminar cuenta", langLabel: "Idioma",
    foundation: "Fundación", curriculum: "Currículo", legal: "Legal",
    philosophy: "Nuestra Filosofía", contact: "Contacto", opensource: "Código Abierto",
    languages: "Idiomas", elite: "Élite",
    mission: "Soberanía Académica Universal", mission_sub: "Manifiesto del Proyecto",
    mission_desc: "OpenPrimer se basa en la creencia que la educación de élite es un derecho humano fundamental, no un privilegio localizado.",
    accessibility: "Accesibilidad Radical", accessibility_desc: "Eliminamos las barreras lingüísticas al proporcionar todo el contenido académico certificado en los 5 idiomas más hablados del mundo.",
    quality: "Calidad Institucional", quality_desc: "Cada módulo en OpenPrimer está alineado con los estándares internacionales (ECTS, créditos estadounidenses).",
    methodology: "Metodología", methodology_desc: "La Metodología Feynman",
    transparency: "Transparencia Radical", transparency_desc: "La lógica de la educación nunca debe ser una caja negra. OpenPrimer es 100% código abierto.",
    universal_knowledge: "El Conocimiento Universal.", finally_free: "Finalmente Libre.",
    summary: "OpenPrimer sintetiza la totalidad de los currículos académicos, desde la escuela primaria hasta el grado, en una experiencia única, interactiva y tutorizada por IA.",
    rigor: "Rigor Académico", rigor_desc: "Currículos universitarios completos sintetizados con el método Feynman.",
    tutor_desc: "Tutoría de IA consciente del contexto integrada directamente en cada módulo de aprendizaje.",
    multilingual_desc: "Soporte nativo para EN, FR, ES, DE y ZH. Rompiendo la barrera del idioma.",
    mission_link: "Conoce nuestra visión", beta_tag: "", elite_tag: "Élite", new_tag: "Nuevo", try_label: "Probar:",
    socratic: "Método Socrático", pragmatic: "Modo Pragmático", academic: "Rigor Académico",
    give_example: "Dar ejemplo", tell_story: "Contar historia", simplify: "Simplificar", test_me: "Evaluarme",
    analysis: "Análisis académico en curso...", mode_default: "Predeterminado", mode_paper: "Papel", mode_focus: "Enfoque",
    footer_desc: "Universalizar el conocimiento académico de élite mediante una pedagogía recursiva asistida por IA.",
    logged_in_as: "Conectado como", my_curriculum: "Mi Currículo", catalog: "Explorar Catálogo",
    account_mgmt: "Gestión de Cuenta", profile_settings: "Ajustes del Perfil",
    personal_info: "Información Personal", first_name: "Nombre", last_name: "Apellido", email_addr: "Correo Electrónico",
    save_changes: "Guardar Cambios", preferences: "Preferencias", preferred_lang: "Idioma Preferido",
    lang_desc: "Idioma global de la interfaz y del tutor.", danger_zone: "Zona de Peligro",
    delete_account: "Eliminar Cuenta", delete_desc: "Esta acción es permanente. Se perderá todo el progreso.",
    profile_updated: "Perfil actualizado con éxito",
    total_credits: "Créditos Totales", knowledge_points: "Puntos de Conocimiento", learning_time: "Tiempo de Aprendizaje",
    active_modules: "Módulos Activos", progress: "Progreso", tutor_summary: "Resumen Pedagógico IA",
    tutor_feedback: "Feedback Académico", curriculum_overview: "Resumen de su Currículo",
    classical_mechanics: "Mecánica Clásica", cell_biology: "Biología Celular", constitutional_law: "Derecho Constitucional",
    search_course: "Buscar en este curso...", course_progress: "Progreso del Curso",
    password: "Contraseña", confirm_password: "Confirmar Contraseña", create_account: "Crear una Cuenta",
    begin_journey: "Comienza tu viaje", validate_reg: "Validar Registro", already_registered: "¿Ya tienes cuenta?",
    access_repo: "Acceder al Repositorio", verified_success: "¡Cuenta validada con éxito!",
    verified_desc: "Tu registro está confirmado. Conéctate ahora para elegir tus cursos y componer tu currículo.",
    new_to_op: "¿Nuevo en OpenPrimer?", create_an_account: "Crear una cuenta", verify_email: "Verificar Correo",
    verify_sent: "Se ha enviado un enlace de validación a", verify_confirm: "Por favor confirma tu correo para desbloquear tu acceso.",
    simulated_email: "CORREO SIMULADO", welcome_to_op: "¡Bienvenido a OpenPrimer!", verify_and_login: "Validar cuenta e Iniciar sesión",
    back: "Volver", first_name_placeholder: "Juan", last_name_placeholder: "Pérez", forgot_password: "¿Olvidó su contraseña?",
    reset_password: "Restablecer contraseña", send_reset_link: "Enviar enlace de restablecimiento", back_to_login: "Volver a Iniciar sesión",
    enter_email: "Introduzca su dirección de correo electrónico", email_sent: "Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.",
    sign_in_google: "Continuar con Google", password_complexity_error: "La contraseña debe tener al menos 12 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
    passwords_dont_match: "Las contraseñas no coinciden.", all_fields_required: "Por favor, rellene todos los campos requeridos.",
    invalid_credentials: "Credenciales incorrectas. Verifique su correo electrónico y contraseña.", verifying: "Verificando...",
    welcome_back: "Bienvenido de nuevo", continue_journey: "Continúe su viaje de aprendizaje universal.",
    free_account_desc: "¡Una cuenta gratuita está disponible para que pueda seguir todo el plan de estudios, guardar su progreso de forma permanente y beneficiarse de las características de un tutor personal de IA excepcional!",
    or_continue_with: "O continuar con", join_future: "Únete al Futuro", access_knowledge: "Accede al conocimiento del mundo gratis.",
    sign_up_free: "Regístrate Gratis", active_account: "¡Cuenta Activada!",
    activation_success: "Su dirección de correo electrónico ha sido validada con éxito. Redirigiendo a su catálogo de cursos...",
    real_email_sent: "✉️ Se ha enviado un correo electrónico de validación real a través de Resend. Haga clic en el enlace de confirmación en su bandeja de entrada.",
    simulated_inbox: "SIMULADOR DE CORREO", hello: "Hola", real_url_generated: "URL real generada:",
    return_to_form: "Volver al formulario", course_select_optional: "Seleccionar cursos iniciales (opcional)",
    password_placeholder: "••••••••••••", validation_in_progress: "Validación en curso",
    validation_verifying_desc: "Estamos verificando su código de validación seguro...", resend_email_dispatched: "Se ha enviado un enlace de verificación de correo electrónico.",
    mailbox_sim_title: "SIMULADOR DE BANDEJA DE ENTRADA", forgot_question: "¿Olvidó?", email_required_error: "Por favor, introduzca su correo electrónico y contraseña."
  },
  DE: { 
    my_progress: "Mein Fortschritt", admin: "Admin-Konsole", settings: "Einstellungen",
    terms: "Nutzungsbedingungen", privacy: "Datenschutz-Souveränität",
    copyright: "© 2026 OpenPrimer Stiftung • Europäisches Akademisches Konsortium",
    all: "Alle", saved: "Gespeichert", physics: "Physik", biology: "Biologie", law: "Recht", math: "Mathematik", search: "Module suchen...",
    tagline: "Die Zukunft der freien akademischen Souveränität",
    cta_start: "Lernen starten", cta_foundation: "Stiftung erkunden",
    tutor: "KI-Tutor", placeholder: "Frage stellen...", welcome: "Hallo! Ich bin dein OpenPrimer Tutor.", 
    copy: "Link kopiert!", report: "Melden", signout: "Abmelden", login: "Einloggen", signup: "Registrieren", profile: "Mein Lehrplan", 
    delete: "Konto löschen", langLabel: "Sprache",
    foundation: "Stiftung", curriculum: "Lehrplan", legal: "Rechtliches",
    philosophy: "Unsere Philosophie", contact: "Kontakt", opensource: "Open Source",
    languages: "Sprachen", elite: "Elite",
    mission: "Universelle akademische Souveränität", mission_sub: "Projekt-Manifest",
    mission_desc: "OpenPrimer basiert auf der Überzeugung, dass Elitebildung ein grundlegendes Menschenrecht ist, kein lokales Privileg.",
    accessibility: "Radikale Barrierefreiheit", accessibility_desc: "Wir beseitigen Sprachbarrieren, indem wir alle zertifizierten akademischen Inhalte in den 5 meistgesprochenen Weltsprachen bereitstellen.",
    quality: "Institutionelle Qualität", quality_desc: "Jedes Modul auf OpenPrimer ist auf internationale Standards (ECTS, US-Credits) ausgerichtet.",
    methodology: "Methodik", methodology_desc: "Die Feynman-Methodik",
    transparency: "Radikale Transparenz", transparency_desc: "Die Logik der Bildung sollte niemals eine Blackbox sein. OpenPrimer ist 100 % Open Source.",
    universal_knowledge: "Universelles Wissen.", finally_free: "Endlich Frei.",
    summary: "OpenPrimer synthetisiert die gesamte akademische Laufbahn, von der Grundschule bis zum Bachelor, in einer einzigen, interaktiven und KI-gestützten Erfahrung.",
    rigor: "Akademische Strenge", rigor_desc: "Vollständige universitäre Lehrpläne, synthetisiert mit der Feynman-Methode.",
    tutor_desc: "Kontextbewusstes KI-Tutoring, das direkt in jedes Lernmodul integriert ist.",
    multilingual_desc: "Native Unterstützung für EN, FR, ES, DE und ZH. Überwindung der Sprachbarriere.",
    mission_link: "Erfahren Sie mehr über unsere Vision", beta_tag: "", elite_tag: "Elite", new_tag: "Neu", try_label: "Probieren:",
    socratic: "Sokratische Methode", pragmatic: "Pragmatischer Modus", academic: "Akademische Strenge",
    give_example: "Beispiel geben", tell_story: "Geschichte erzählen", simplify: "Vereinfachen", test_me: "Testen Sie mich",
    analysis: "Akademische Analyse läuft...", mode_default: "Standard", mode_paper: "Papier", mode_focus: "Fokus",
    footer_desc: "Universalisierung akademischen Elite-Wissens durch rekursive KI-gestützte Pädagogik.",
    logged_in_as: "Angemeldet als", my_curriculum: "Mein Lehrplan", catalog: "Katalog durchsuchen",
    account_mgmt: "Kontoverwaltung", profile_settings: "Profileinstellungen",
    personal_info: "Persönliche Informationen", first_name: "Vorname", last_name: "Nachname", email_addr: "E-Mail-Adresse",
    save_changes: "Änderungen speichern", preferences: "Einstellungen", preferred_lang: "Bevorzugte Sprache",
    lang_desc: "Globale UI- und Tutor-Interaktionssprache.", danger_zone: "Gefahrenzone",
    delete_account: "Konto löschen", delete_desc: "Diese Aktion ist permanent. Alle Fortschritte gehen verloren.",
    profile_updated: "Profil erfolgreich aktualisiert",
    total_credits: "Gesamt-Credits", knowledge_points: "Wissenspunkte", learning_time: "Lernzeit",
    active_modules: "Aktive Module", progress: "Fortschritt", tutor_summary: "KI-Pädagogische Zusammenfassung",
    tutor_feedback: "Akademisches Feedback", curriculum_overview: "Ihr Lehrplan-Überblick",
    classical_mechanics: "Klassische Mechanik", cell_biology: "Zellbiologie", constitutional_law: "Verfassungsrecht",
    search_course: "Diesen Kurs durchsuchen...", course_progress: "Kursfortschritt",
    password: "Passwort", confirm_password: "Passwort bestätigen", create_account: "Konto erstellen",
    begin_journey: "Beginne deine Reise", validate_reg: "Registrierung bestätigen", already_registered: "Bereits registriert?",
    access_repo: "Repository betreten", verified_success: "Konto erfolgreich validiert!",
    verified_desc: "Ihre Registrierung ist bestätigt. Verbinden Sie sich jetzt, um Ihre Kurse auszuwählen und Ihren Lehrplan zu erstellen.",
    new_to_op: "Neu bei OpenPrimer?", create_an_account: "Konto erstellen", verify_email: "E-Mail verifizieren",
    verify_sent: "Ein Bestätigungslink wurde gesendet an", verify_confirm: "Bitte bestätigen Sie Ihre E-Mail, um Ihren Zugang freizuschalten.",
    simulated_email: "SIMULIERTE E-MAIL", welcome_to_op: "Willkommen bei OpenPrimer!", verify_and_login: "Konto verifizieren & Einloggen",
    back: "Zurück", first_name_placeholder: "Hans", last_name_placeholder: "Müller", forgot_password: "Passwort vergessen?",
    reset_password: "Passwort zurücksetzen", send_reset_link: "Zurücksetzungslink senden", back_to_login: "Zurück zum Login",
    enter_email: "Geben Sie Ihre E-Mail-Adresse ein", email_sent: "Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail-Adresse gesendet.",
    sign_in_google: "Mit Google fortfahren", password_complexity_error: "Das Passwort muss mindestens 12 Zeichen lang sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    passwords_dont_match: "Passwörter stimmen nicht überein.", all_fields_required: "Bitte füllen Sie alle erforderlichen Felder aus.",
    invalid_credentials: "Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.", verifying: "Verifizierung...",
    welcome_back: "Willkommen zurück", continue_journey: "Setzen Sie Ihre universelle Lernreise fort.",
    free_account_desc: "Ein kostenloses Konto ist verfügbar, damit Sie dem gesamten Lehrplan folgen, Ihren Fortschritt dauerhaft speichern und von den Funktionen eines außergewöhnlichen persönlichen KI-Tutors profitieren können!",
    or_continue_with: "Oder fortfahren mit", join_future: "Tritt der Zukunft bei", access_knowledge: "Greife kostenlos auf das Wissen der Welt zu.",
    sign_up_free: "Kostenlos registrieren", active_account: "Konto aktiviert!",
    activation_success: "Ihre E-Mail-Adresse wurde erfolgreich validiert. Weiterleitung zu Ihrem Kursbereich...",
    real_email_sent: "✉️ Eine echte Bestätigungs-E-Mail wurde über Resend gesendet. Bitte klicken Sie auf den Bestätigungslink in Ihrem Posteingang.",
    simulated_inbox: "E-MAIL-SIMULATOR", hello: "Hallo", real_url_generated: "Echte generierte URL:",
    return_to_form: "Zurück zum Formular", course_select_optional: "Erstkurse auswählen (Optional)",
    password_placeholder: "••••••••••••", validation_in_progress: "Validierung läuft",
    validation_verifying_desc: "Wir überprüfen Ihren sicheren Validierungscode...", resend_email_dispatched: "Ein Link zur E-Mail-Verifizierung wurde gesendet.",
    mailbox_sim_title: "POSTEINGANGS-SIMULATOR", forgot_question: "Vergessen?", email_required_error: "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein."
  },
  ZH: { 
    my_progress: "我的进度", admin: "管理控制台", settings: "账户设置",
    terms: "服务条款", privacy: "隐私主权",
    copyright: "© 2026 OpenPrimer 基金会 • 欧洲学术联盟",
    all: "全部", saved: "已保存", physics: "物理", biology: "生物", law: "法律", math: "数学", search: "搜索模块...",
    tagline: "开放学术主权的未来",
    cta_start: "开始学习", cta_foundation: "探索基金会",
    tutor: "AI 导师", placeholder: "提问...", welcome: "你好！我是你的 OpenPrimer 导师。", 
    copy: "链接已复制！", report: "举报", signout: "登出", login: "登录", signup: "注册", profile: "我的课程", 
    delete: "删除账户", langLabel: "语言",
    foundation: "基金会", curriculum: "课程", legal: "法律",
    philosophy: "我们的哲学", contact: "联系我们", opensource: "开源项目",
    languages: "语言", elite: "精英",
    mission: "全民学术主权", mission_sub: "项目宣言",
    mission_desc: "OpenPrimer 建立在这样一种信念之上：精英教育是一项基本人权，而不是一种局部特权。",
    accessibility: "彻底的无障碍", accessibility_desc: "我们通过提供全球 5 种最常用语言的所有认证学术内容来消除语言障碍。",
    quality: "机构质量", quality_desc: "OpenPrimer 上的每个模块都符合国际标准（ECTS、美国学分）。",
    methodology: "教学法", methodology_desc: "费曼教学法",
    transparency: "彻底的透明度", transparency_desc: "教育的逻辑绝不应该是一个黑匣子。OpenPrimer 是 100% 开源的。",
    universal_knowledge: "普及全球知识。", finally_free: "最终实现自由。",
    summary: "OpenPrimer 将从小学到学士学位的全部学术课程综合为单一的、互动的和 AI 指导的体验。",
    rigor: "严谨学术", rigor_desc: "采用费曼教学法综合的完整大学课程。",
    tutor_desc: "情境感知 AI 辅导，直接集成到每个学习模块中。",
    multilingual_desc: "原生支持英文、法文、西班牙文、德文和中文。打破教育中的语言障碍。",
    mission_link: "了解我们的愿景", beta_tag: "", elite_tag: "精英", new_tag: "新内容", try_label: "尝试：",
    socratic: "苏格拉底教学法", pragmatic: "务实模式", academic: "严谨学术",
    give_example: "举例说明", tell_story: "讲述故事", simplify: "简化内容", test_me: "测试我",
    analysis: "正在进行学术分析...", mode_default: "默认", mode_paper: "纸质", mode_focus: "专注",
    footer_desc: "通过递归 AI 辅助教学法普及精英学术知识。",
    logged_in_as: "登录身份为", my_curriculum: "我的课程", catalog: "浏览课程目录",
    account_mgmt: "账户管理", profile_settings: "个人资料设置",
    personal_info: "个人信息", first_name: "名字", last_name: "姓氏", email_addr: "电子邮件地址",
    save_changes: "保存更改", preferences: "偏好设置", preferred_lang: "首选语言",
    lang_desc: "全局界面和导师互动语言。", danger_zone: "危险区域",
    delete_account: "删除账户", delete_desc: "此操作是永久性的。所有进度都将丢失。",
    profile_updated: "资料更新成功",
    total_credits: "总学分", knowledge_points: "知识点", learning_time: "学习时长",
    active_modules: "当前模块", progress: "进度", tutor_summary: "AI 教学总结",
    tutor_feedback: "学术反馈", curriculum_overview: "课程概览",
    classical_mechanics: "经典力学", cell_biology: "细胞生物学", constitutional_law: "宪法",
    search_course: "搜索此课程...", course_progress: "课程进度",
    password: "密码", confirm_password: "确认密码", create_account: "创建账户",
    begin_journey: "开始您的学术旅程", validate_reg: "确认注册", already_registered: "已经注册？",
    access_repo: "访问学术仓库", verified_success: "账户验证成功！",
    verified_desc: "您的注册已确认。请立即登录以选择课程并制定您的专属学习计划。",
    new_to_op: "首次使用 OpenPrimer？", create_an_account: "创建账户", verify_email: "验证电子邮件",
    verify_sent: "验证链接已发送至", verify_confirm: "请确认您的电子邮件以解锁访问权限。",
    simulated_email: "模拟邮件", welcome_to_op: "欢迎来到 OpenPrimer！", verify_and_login: "验证账户并登录",
    back: "返回", first_name_placeholder: "三", last_name_placeholder: "张", forgot_password: "忘记密码？",
    reset_password: "重置密码", send_reset_link: "发送重置链接", back_to_login: "返回登录",
    enter_email: "输入您的电子邮件地址", email_sent: "重置密码的链接已发送至您的电子邮箱。",
    sign_in_google: "使用 Google 登录", password_complexity_error: "密码长度必须至少为 12 个字符，且必须包含大小写字母、数字及特殊字符。",
    passwords_dont_match: "密码不匹配。", all_fields_required: "请填写所有必填字段。",
    invalid_credentials: "凭据不正确。请核对您的电子邮件和密码。", verifying: "正在验证...",
    welcome_back: "欢迎回来", continue_journey: "继续您的全球学术探索之旅。",
    free_account_desc: "您可以免费注册一个账户，用来跟踪完整课程、永久保存学习进度并享受专属 AI 导师提供的个性化教学指导！",
    or_continue_with: "或使用以下方式继续", join_future: "拥抱未来", access_knowledge: "免费获取全球人类智慧结晶。",
    sign_up_free: "免费注册", active_account: "账户已激活！",
    activation_success: "您的电子邮件地址已成功通过验证。正在重定向到课程目录...",
    real_email_sent: "✉️ 真实的验证邮件已通过 Resend 发送。请查收并点击您邮箱中的确认链接。",
    simulated_inbox: "邮箱模拟器", hello: "你好", real_url_generated: "生成的真实 URL：",
    return_to_form: "返回表单", course_select_optional: "选择初始课程（可选）",
    password_placeholder: "••••••••••••", validation_in_progress: "正在验证中",
    validation_verifying_desc: "我们正在核对您的安全验证码...", resend_email_dispatched: "电子邮件验证链接已发送。",
    mailbox_sim_title: "邮箱模拟器", forgot_question: "忘记？", email_required_error: "请输入您的电子邮件和密码。"
  },
  IT: { 
    my_progress: "Il Mio Progresso", admin: "Console Amministratore", settings: "Impostazioni Account",
    terms: "Termini di Servizio", privacy: "Sovranità dei Dati",
    copyright: "© 2026 Progetto OpenPrimer • Archivio Accademico Globale dell'IA",
    all: "Tutti", saved: "Salvati", physics: "Fisica", biology: "Biologia", law: "Diritto", math: "Matematica", search: "Cerca moduli...",
    tagline: "Il Futuro della Sovranità Accademica Aperta",
    cta_start: "Inizia ad Imparare", cta_foundation: "Esplora Fondazione",
    tutor: "Tutor IA", placeholder: "Fai una domanda...", welcome: "Ciao! Sono il tuo tutor OpenPrimer.", 
    copy: "Link copiato!", report: "Segnala", signout: "Disconnetti", login: "Accedi", signup: "Registrati", profile: "Il Mio Curriculum", 
    delete: "Elimina Account", langLabel: "Lingua",
    foundation: "Fondazione", curriculum: "Curriculum", legal: "Legale",
    philosophy: "La Nostra Filosofia", contact: "Contatta il Supporto", opensource: "Open Source",
    languages: "Lingue", elite: "Elite",
    mission: "Sovranità Accademica Universale", mission_sub: "Manifesto del Progetto",
    mission_desc: "OpenPrimer si basa sulla convinzione che l'istruzione d'élite sia un diritto umano fondamentale, non un privilegio localizzato.",
    accessibility: "Accessibilità Radicale", accessibility_desc: "Eliminiamo le barriere linguistiche fornendo tutti i contenuti accademici certificati nelle 5 lingue più parlate al mondo.",
    quality: "Qualità Istituzionale", quality_desc: "Ogni modulo su OpenPrimer è allineato con gli standard internazionali (ECTS, crediti USA).",
    methodology: "Metodologia", methodology_desc: "La Metodologia Feynman",
    transparency: "Trasparenza Radicale", transparency_desc: "La logica dell'istruzione non dovrebbe mai essere una scatola nera. OpenPrimer è al 100% Open Source.",
    universal_knowledge: "La Conoscenza Universale.", finally_free: "Finalmente Libera.",
    summary: "OpenPrimer sintetizza l'intero percorso scolastico, dalla scuola primaria fino alla laurea, in un'esperienza unica, interattiva e assistita da un tutor IA.",
    rigor: "Rigore Accademico", rigor_desc: "Curricula universitari completi sintetizzati con il metodo Feynman per la massima profondità.",
    tutor_desc: "Tutoraggio IA consapevole del contesto integrato direttamente in ogni modulo di apprendimento.",
    multilingual_desc: "Supporto nativo per EN, FR, ES, DE, IT e ZH. Abbattimento delle barriere linguistiche nell'istruzione.",
    mission_link: "Scopri la nostra visione", beta_tag: "", elite_tag: "Elite", new_tag: "Novità", try_label: "Prova:",
    socratic: "Metodo Socratico", pragmatic: "Modalità Pragmatica", academic: "Rigore Accademico",
    give_example: "Fai un esempio", tell_story: "Racconta una storia", simplify: "Semplifica", test_me: "Mettimi alla prova",
    analysis: "Analisi accademica in corso...", mode_default: "Predefinito", mode_paper: "Carta", mode_focus: "Focus",
    footer_desc: "Universalizzazione della conoscenza accademica d'élite attraverso una pedagogia recursiva assistita dall'IA.",
    logged_in_as: "Accesso effettuato come", my_curriculum: "Il Mio Curriculum", catalog: "Sfoglia il Catalogo",
    account_mgmt: "Gestione Account", profile_settings: "Impostazioni Profilo",
    personal_info: "Informazioni Personali", first_name: "Nome", last_name: "Cognome", email_addr: "Indirizzo Email",
    save_changes: "Salva Modifiche", preferences: "Preferenze", preferred_lang: "Lingua Preferita",
    lang_desc: "Lingua globale dell'interfaccia e del tutor.", danger_zone: "Zona di Pericolo",
    delete_account: "Elimina Account", delete_desc: "Questa azione è permanente. Tutti i progressi andranno persi.",
    profile_updated: "Profilo aggiornato con successo",
    total_credits: "Crediti Totali", knowledge_points: "Punti di Conoscenza", learning_time: "Tempo di Apprendimento",
    active_modules: "Moduli Attivi", progress: "Progresso", tutor_summary: "Riepilogo Pedagogico IA",
    tutor_feedback: "Feedback Accademico", curriculum_overview: "Panoramica del Tuo Curriculum",
    classical_mechanics: "Meccanica Classica", cell_biology: "Biologia Cellulare", constitutional_law: "Diritto Costituzionale",
    search_course: "Cerca in questo corso...", course_progress: "Progresso del Corso"
  }
};

export const UI_STRINGS = new Proxy(STATIC_UI_STRINGS, {
  get(target, prop: string) {
    if (typeof window !== 'undefined') {
      const cached = window.localStorage.getItem(`openprimer_ui_strings_${prop.toUpperCase()}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return target[prop as keyof typeof target] || target.EN;
  }
}) as any;


import { usePathname } from 'next/navigation';

interface AITutorOverlayProps {
  lang?: string;
  pageContext?: string;
}

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = ({ lang: propLang, pageContext }: AITutorOverlayProps = {}) => {
  const { language: contextLang } = useLanguage();
  const lang = propLang || contextLang;
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('op_active_tutor_personality') || 'socratic';
      const names: Record<string, string> = {
        socratic: 'Socratic Coach',
        direct: 'Direct Synthesizer',
        gamified: 'Gamified Companion',
        historical: 'Historical Storyteller',
        feynman: 'Feynman Simplifier',
        proof: 'Rigorous Proof Master'
      };
      return names[storedId] || 'Socratic Coach';
    }
    return 'Socratic Coach';
  });
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const pathname = usePathname();
  const isCurriculumPage = pathname.includes('/L1/') || pathname.includes('/L2/') || pathname.includes('/L3/');

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const getPersonaName = (pName: string) => {
    const selected = personalities.find(p => p.name === pName || p.id === pName);
    if (selected && selected.translations?.[lang]) {
      return selected.translations[lang].name;
    }
    return pName;
  };

  useEffect(() => {
    const updateAuth = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session !== 'false');
    };
    updateAuth();
    window.addEventListener('storage', updateAuth);
    window.addEventListener('op_auth_state_changed', updateAuth);
    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('op_auth_state_changed', updateAuth);
    };
  }, []);

  // Periodic health check with auto-reconnection loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    async function checkHealth() {
      try {
        if (isOffline) {
          setIsRetrying(true);
        }
        const res = await fetch('/api/tutor/health');
        if (!res.ok) {
          throw new Error('Tutor health degraded');
        }
        setIsOffline(false);
        setIsRetrying(false);
      } catch (err) {
        setIsOffline(true);
        setIsRetrying(true);
      }
    }

    if (isOpen) {
      checkHealth();
      timer = setInterval(checkHealth, 5000); // Check every 5 seconds for robust state synchronization
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, isOffline]);

  // Query Tutor Personalities & Safeguard Check on Mount/Open
  useEffect(() => {
    async function loadPersonalities() {
      const { data } = await dbService.getTutorPersonalities();
      if (data && data.length > 0) {
        setPersonalities(data);
        
        const syncActiveTutor = () => {
          const storedId = localStorage.getItem('op_active_tutor_personality') || 'socratic';
          const active = data.find(p => p.id === storedId);
          if (active) {
            setPersona(active.name);
          } else {
            const defaultPers = data.find(p => p.isDefault) || data[0];
            if (defaultPers) {
              setPersona(defaultPers.name);
              localStorage.setItem('op_active_tutor_personality', defaultPers.id);
            }
          }
        };

        syncActiveTutor();
        window.addEventListener('op_active_tutor_changed', syncActiveTutor);
        window.addEventListener('storage', syncActiveTutor);
        return () => {
          window.removeEventListener('op_active_tutor_changed', syncActiveTutor);
          window.removeEventListener('storage', syncActiveTutor);
        };
      }
    }
    loadPersonalities();
  }, [isOpen]);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
    }
  };

  if (!isCurriculumPage) return null;

  const QUICK_ACTIONS = [
    { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: "Give me a concrete real-world example of this concept." },
    { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: "Tell me a historical anecdote about this discovery." },
    { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: "Explain this to me as if I were a complete beginner." },
    { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: "Give me a challenge question to test my understanding." }
  ];

  // Persist history based on course slug instead of specific page pathname
  const slugParts = pathname ? pathname.split('/') : [];
  const isLPage = slugParts.includes('L1') || slugParts.includes('L2') || slugParts.includes('L3');
  const courseSlug = isLPage ? slugParts[3] : 'global';

  useEffect(() => {
    const key = `op_tutor_hist_${courseSlug}_${lang}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: t.welcome }]);
    }
  }, [courseSlug, lang, t.welcome]);

  useEffect(() => {
    if (messages.length > 1) {
      const key = `op_tutor_hist_${courseSlug}_${lang}`;
      localStorage.setItem(key, JSON.stringify(messages.slice(-10))); // Keep last 10
    }
  }, [messages, courseSlug, lang]);

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    if (!text) setInput('');

    // Append an assistant slot that we will stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);
    
    try {
      let token: string | undefined;
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      } catch (err) {
        console.warn("[TUTOR CHAT] Failed to retrieve client auth session token:", err);
      }

      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: newMessages,
          persona,
          pageContext: pageContext || '',
          language: lang
        })
      });

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const dataStr = line.slice(5).trim();
              if (!dataStr) continue;
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                if (firstChunk) {
                  accumulatedText = parsed.text;
                  firstChunk = false;
                } else {
                  accumulatedText += parsed.text;
                }
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0) {
                    updated[updated.length - 1] = { role: 'assistant', content: accumulatedText };
                  }
                  return updated;
                });
              }
            } catch (err) {}
          }
        }
      }
    } catch (err) {
      console.error("Streaming error", err);
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = { 
            role: 'assistant', 
            content: lang === 'FR' 
              ? "Désolé, une erreur est survenue lors de la communication avec le tuteur. Veuillez réessayer." 
              : "Sorry, an error occurred while communicating with the tutor. Please try again."
          };
         }
         return updated;
       });
     }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans text-slate-100">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[400px] h-[600px] rounded-[40px] bg-slate-900/95 border border-slate-800/50 shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{t.tutor}</p>
                                       <select
                      value={persona}
                      onChange={(e) => {
                        const nextPersona = e.target.value;
                        setPersona(nextPersona);
                        const selected = personalities.find(p => p.name === nextPersona || p.id === nextPersona || p.translations?.EN?.name === nextPersona);
                        if (selected) {
                          localStorage.setItem('op_active_tutor_personality', selected.id);
                          window.dispatchEvent(new CustomEvent('op_active_tutor_changed'));
                        }
                      }}
                      className="bg-transparent text-sm font-bold text-white border-none focus:outline-none focus:ring-0 cursor-pointer p-0 pr-6"
                    >
                      {personalities.length > 0 ? (
                        personalities.map(p => (
                          <option key={p.id} value={p.name} className="bg-slate-900 text-white text-xs">
                            {p.translations?.[lang]?.name || p.name}
                          </option>
                        ))
                      ) : (
                        <option value="Socratic Coach" className="bg-slate-900 text-white text-xs">Socratic Coach</option>
                      )}
                    </select>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {!isLoggedIn ? (
              <div className="flex-1 flex flex-col justify-center items-center p-8 text-center space-y-6 bg-slate-950/20">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-bounce">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    {lang === 'FR' ? `Tuteur ${getPersonaName(persona)} IA` : `${getPersonaName(persona)} AI Tutor`}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[320px]">
                    {lang === 'FR' 
                      ? "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !" 
                      : "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!"}
                  </p>
                </div>
                <div className="w-full space-y-2.5 pt-4">
                  <button 
                    onClick={() => handleAuthClick('signup')}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
                  >
                    {lang === 'FR' ? "S'inscrire Gratuitement" : "Sign Up to Unlock"}
                  </button>
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="w-full py-3.5 bg-slate-800 border border-slate-750 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    {lang === 'FR' ? "Se Connecter" : "Log In"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Offline Connection Loss banner */}
                <AnimatePresence>
                  {isOffline && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 py-3.5 bg-amber-500/10 border-b border-amber-500/25 text-amber-500 flex items-center justify-between text-[9px] font-black uppercase tracking-widest gap-3 shrink-0 overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                          <Loader2 className="w-3 h-3 animate-spin stroke-[3]" />
                        </div>
                        <span className="leading-tight">
                          {lang === 'FR' 
                            ? 'Difficultés de connexion détectées... reconnexion automatique' 
                            : 'Connection difficulties detected... retrying automatically'}
                        </span>
                      </div>
                      <div className="bg-amber-500/20 px-2.5 py-1 rounded-lg text-[7px] font-black uppercase animate-pulse shrink-0 text-amber-400 border border-amber-500/30">
                        {lang === 'FR' ? 'Patienter' : 'Please Wait'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800/50 text-slate-300 rounded-tl-none' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-none'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 grid grid-cols-2 gap-2 bg-slate-950/20 border-t border-slate-800/50">
                   {QUICK_ACTIONS.map(qa => (
                     <button key={qa.label} disabled={isOffline} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed">
                       {qa.icon} {qa.label}
                     </button>
                   ))}
                </div>

                <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
                  <div className="relative">
                    <input type="text" disabled={isOffline} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isOffline ? (lang === 'FR' ? "Connexion indisponible..." : "Connection unavailable...") : t.placeholder} className="w-full bg-slate-800/40 border border-slate-700/30 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed" />
                    <button disabled={isOffline} onClick={() => handleSend()} className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all disabled:bg-blue-600/30 disabled:cursor-not-allowed"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center relative border border-white/10 group cursor-pointer"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
};

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, showReadingModeSelector = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, showReadingModeSelector?: boolean, onLangChange?: (lang: string) => void }) => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeCourseData, setActiveCourseData] = useState<any | null>(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('op_enrolled_courses');
    if (saved) {
      try {
        setEnrolledIds(JSON.parse(saved));
      } catch (e) {}
    }

    dbService.getAllCourses().then(({ data }) => {
      if (data) {
        setCourses(data);
        if (typeof window !== 'undefined' && isCoursePage) {
          const parts = window.location.pathname.split('/').filter(Boolean);
          const slug = parts[2];
          if (slug) {
            const matched = data.find((c: any) => c.slug === slug || c.slug?.toLowerCase() === slug.toLowerCase());
            if (matched) {
              setActiveCourseData(matched);
            }
          }
        }
      }
    });
  }, [isCoursePage]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'lang' | 'user' | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; firstName: string; lastName: string; } | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [readingMode, setReadingMode] = useState('dark');

  // Static flag map for well-known language codes
  const LANG_FLAG_MAP: Record<string, { flag: string; label: string }> = {
    EN: { flag: '🇺🇸', label: 'English' },
    FR: { flag: '🇫🇷', label: 'Français' },
    ES: { flag: '🇪🇸', label: 'Español' },
    DE: { flag: '🇩🇪', label: 'Deutsch' },
    ZH: { flag: '🇨🇳', label: '中文' },
    IT: { flag: '🇮🇹', label: 'Italiano' },
    PT: { flag: '🇧🇷', label: 'Português' },
    AR: { flag: '🇸🇦', label: 'العربية' },
    JA: { flag: '🇯🇵', label: '日本語' },
    KO: { flag: '🇰🇷', label: '한국어' },
    RU: { flag: '🇷🇺', label: 'Русский' },
  };

  const FALLBACK_LANGUAGES = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
      } else {
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');
    const profile = localStorage.getItem('op_user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Load initial reading mode theme
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);

    const handleGlobalTriggerAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      const mode = customEvent.detail || 'signup';
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          return;
        }
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    };
    window.addEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);

    const fetchLanguages = () => {
      dbService.getAvailableLanguages().then(({ data }) => {
        if (data && data.length > 0) {
          setLanguages(data.map((l: any) => ({
            code: l.code.toUpperCase(),
            flag: LANG_FLAG_MAP[l.code.toUpperCase()]?.flag || l.flag || '🌐',
            label: LANG_FLAG_MAP[l.code.toUpperCase()]?.label || l.label || l.name || l.code.toUpperCase(),
          })));
        }
      }).catch(() => { /* keep fallback */ });
    };

    fetchLanguages();
    window.addEventListener('op_languages_changed', fetchLanguages);

    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
      window.removeEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);
      window.removeEventListener('op_languages_changed', fetchLanguages);
    };
  }, []);

  const handleThemeSelect = (modeKey: string) => {
    setReadingMode(modeKey);
    localStorage.setItem('op_reading_mode', modeKey);
    
    // Update op_user_profile inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredTheme = modeKey;
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    // Call dynamic page setting if defined
    if ((window as any).setReadingMode) {
      (window as any).setReadingMode(modeKey);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('op_reading_mode_changed', { detail: modeKey }));
  };

  const handleLanguageSelect = async (code: string) => {
    setLang(code as any);
    localStorage.setItem('openprimer_lang', code);
    document.cookie = `openprimer_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update op_user_profile preferredLang inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredLang = code.toLowerCase();
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    if (onLangChange) onLangChange(code);

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const parts = pathname.split('/').filter(Boolean);
      const isCoursePath = parts.includes('L1') || parts.includes('L2') || parts.includes('L3');

      if (isCoursePath) {
        const langLower = code.toLowerCase();
        try {
          // Check if this course page is available in the target language
          const res = await fetch(`/api/content?slug=${parts.join(',')}&lang=${langLower}`);
          if (res.ok) {
            window.location.reload();
            return;
          }
        } catch (e) {
          console.error("Error verifying language availability:", e);
        }

        // If translation is missing:
        const session = localStorage.getItem('op_session');
        const loggedIn = session === 'true';

        if (loggedIn) {
          // Redirect to curriculum page
          window.location.href = '/profile/curriculum';
        } else {
          // Redirect to catalog page
          window.location.href = '/catalog';
        }
        return;
      }
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t.copy);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-[1000] px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {isCoursePage && toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition-all mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-3 group">
          <OpenPrimerIcon className="w-9 h-9" />
          <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang}</span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {languages.map(l => (
                   <button key={l.code} onClick={() => handleLanguageSelect(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.code ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang === l.code && <CheckCircle className="w-3 h-3" />}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mr-2">
          {['Default', 'Paper', 'Focus'].map(mode => {
            const modeKey = mode === 'Default' ? 'dark' : mode.toLowerCase();
            const active = readingMode === modeKey || (modeKey === 'dark' && readingMode === 'default');
            const modeLabel = mode === 'Default' ? t.mode_default : mode === 'Paper' ? t.mode_paper : t.mode_focus;
            return (
              <button 
                key={mode}
                onClick={() => handleThemeSelect(modeKey)}
                className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                {modeLabel}
              </button>
            );
          })}
        </div>

        {isCoursePage && activeCourseData && (
          <button 
            onClick={() => setSelectedEnrollCourse(activeCourseData)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-450 hover:border-blue-500/50 transition-all flex items-center gap-2 group cursor-pointer"
            title={lang === 'FR' ? "Afficher la fiche de présentation" : "Display Presentation Sheet"}
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{lang === 'FR' ? "Fiche du cours" : "Course Sheet"}</span>
          </button>
        )}

        {isCoursePage && (
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-2 group"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{t.report}</span>
          </button>
        )}

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>


        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        {isLoggedIn ? (
          <div className="relative" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <AnimatePresence>
              {activeDropdown === 'user' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2">
                   <div className="px-4 py-4 border-b border-slate-800/50 mb-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">Logged in as</p>
                     <p className="text-xs font-bold text-white truncate">
                       {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Silvere Martin'}
                     </p>
                     <p className="text-[10px] text-slate-500 truncate">
                       {userProfile ? userProfile.email : 'silvere@openprimer.org'}
                     </p>
                   </div>
                     <Link href="/profile/curriculum" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <GraduationCap className="w-4 h-4" /> {t.my_curriculum}
                    </Link>
                    
                    <Link href="/catalog" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <Brain className="w-4 h-4" /> {t.catalog}
                    </Link>
                    
                    <Link href="/profile/settings" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <Settings className="w-4 h-4" /> {t.settings}
                    </Link>

                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <ShieldAlert className="w-4 h-4" /> {t.admin}
                    </Link>
                    
                    <div className="h-px bg-slate-800/50 my-1" />
                    
                    <button onClick={() => { localStorage.setItem('op_session', 'false'); setIsLoggedIn(false); triggerToast(t.signout); window.location.reload(); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                      <LogOut className="w-4 h-4" /> {t.signout}
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleAuthClick('login')} 
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              {t.login}
            </button>
            <button 
              onClick={() => handleAuthClick('signup')} 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all cursor-pointer"
            >
              {t.signup || 'Sign In'}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReportModalOpen && (
          <div 
            onClick={() => { setIsReportModalOpen(false); setReportComment(''); }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> {lang === 'FR' ? "Signaler une erreur" : "Report an issue"}
                </h3>
                <button 
                  onClick={() => { setIsReportModalOpen(false); setReportComment(''); }} 
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {lang === 'FR' 
                    ? "Aidez notre IA à affiner le cursus. Décrivez l'erreur pédagogique, de traduction ou scientifique sur cette page." 
                    : "Help our AI refine the curriculum. Describe the mathematical, lexical, or pedagogical issue on this page."}
                </p>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {lang === 'FR' ? "Commentaire (Optionnel)" : "Comment (Optional)"}
                  </label>
                  <textarea 
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    rows={4}
                    placeholder={lang === 'FR' ? "ex: Le calcul de la force de frottement à la ligne 12 est erroné..." : "e.g., The derivation in line 12 is missing a minus sign..."}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none text-white placeholder:text-slate-700" 
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setIsReportModalOpen(false); setReportComment(''); }} 
                    className="flex-1 py-4 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400"
                  >
                    {lang === 'FR' ? "Annuler" : "Cancel"}
                  </button>
                  <button 
                    onClick={async () => {
                      setSubmittingReport(true);
                      const pathParts = window.location.pathname.split('/');
                      const courseName = pathParts[3] ? pathParts[3].replace(/_/g, ' ') : "General";
                      await dbService.submitReport(courseName, window.location.pathname, reportComment);
                      setSubmittingReport(false);
                      setIsReportModalOpen(false);
                      setReportComment('');
                      triggerToast(lang === 'FR' ? "Rapport soumis avec succès" : "Report submitted successfully");
                    }}
                    disabled={submittingReport}
                    className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 disabled:bg-slate-800"
                  >
                    {submittingReport 
                      ? (lang === 'FR' ? "Envoi..." : "Sending...") 
                      : (lang === 'FR' ? "Soumettre le Rapport" : "Submit Report")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          {/* Syllabus Enrollment Drawer Modal */}
      <AnimatePresence>
        {selectedEnrollCourse && (
          <div 
            onClick={() => setSelectedEnrollCourse(null)} 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
            >
              <button 
                onClick={() => setSelectedEnrollCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{selectedEnrollCourse.subject}</p>
                  <h2 className="text-2xl font-black text-white">
                    {(() => {
                      const isEn = lang.toUpperCase() === 'EN';
                      const slug = selectedEnrollCourse.slug;
                      const id = selectedEnrollCourse.id;
                      if (slug === 'Classical_Mechanics' || slug === 'classical-mechanics' || id === 1) {
                        return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
                      }
                      if (slug === 'Physique_Test_L2' || slug === 'quantum-physics' || id === 2) {
                        return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
                      }
                      if (slug === 'Biologie_Test' || slug === 'cell-biology' || id === 3) {
                        return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
                      }
                      if (slug === 'Biologie_Test_L1' || slug === 'molecular-genetics' || id === 4) {
                        return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
                      }
                      if (slug === 'Droit_Test' || slug === 'constitutional-law' || id === 5) {
                        return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
                      }
                      if (slug === 'Droit_Test_L2' || id === 6) {
                        return isEn ? "Law: Criminal Law (L2)" : "Droit : Droit Pénal (L2)";
                      }
                      return selectedEnrollCourse.title;
                    })()}
                  </h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-violet-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Mastery Weight</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.ects || 6} pts</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-blue-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Duration</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.hours || 150} hrs</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-emerald-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Level</p>
                  <p className="text-xs font-black text-white">{String(selectedEnrollCourse.level).toUpperCase()}</p>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedEnrollCourse && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.prerequisites && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.length > 0 && (
                <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3">
                    {lang === 'FR' ? "Prérequis Académiques" : "Academic Prerequisites"}
                  </p>
                  <div className="flex flex-col gap-2 text-left">
                    {COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.map((pre, idx) => {
                      const matchedCourse = courses.find(c => c.title.toLowerCase().includes(pre.toLowerCase()) || pre.toLowerCase().includes(c.title.toLowerCase()));
                      const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
                      const clickable = !!matchedCourse;
                      
                      const handleClick = () => {
                        if (matchedCourse) {
                          setSelectedEnrollCourse(matchedCourse);
                        }
                      };

                      return (
                        <div 
                          key={idx} 
                          onClick={clickable ? handleClick : undefined}
                          title={clickable ? (lang === 'FR' ? `Voir la fiche de : ${matchedCourse.title}` : `View details for: ${matchedCourse.title}`) : undefined}
                          className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                            clickable 
                              ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                              : ''
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                            {pre}
                            {clickable && <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            isSatisfied 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {isSatisfied 
                              ? (lang === 'FR' ? "✓ Débloqué" : "✓ Unlocked") 
                              : (lang === 'FR' ? "⚠️ Requis" : "⚠️ Required")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Syllabus Units */}
              <div className="space-y-6 mb-10 text-left">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2">Syllabus Overview</p>
                {(COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.units || []).map((unit, uIdx) => (
                  <div key={uIdx} className="space-y-3">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-4 h-px bg-blue-500/30" /> {unit.title}
                    </h4>
                    <div className="grid gap-2 pl-6">
                      {unit.modules.map((mod, mIdx) => (
                        <div key={mIdx} className="px-4 py-2 bg-slate-950/20 border border-slate-850 rounded-xl text-xs text-slate-300">
                          {mod}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
// --- COMPONENT: INSTITUTIONAL FOOTER ---
export const Footer = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-24 pb-12 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              {t.footer_desc}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className="text-sm text-slate-600 hover:text-white transition-colors">{t.philosophy}</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-white transition-colors">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className="text-sm text-slate-600 hover:text-blue-400 transition-colors">{t.catalog}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.terms}</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
            {t.copyright}
          </div>
          <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
             <span className="text-xs font-bold text-white">🇪🇺</span>
             <span className="text-xs font-bold text-white">🇨🇳</span>
             <span className="text-xs font-bold text-white">🇺🇸</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- COMPONENT: ADMIN CONSOLE FOOTER ---
export const AdminFooter = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-6 px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
          © 2026 OpenPrimer Foundation
        </div>
      </div>
    </footer>
  );
};
