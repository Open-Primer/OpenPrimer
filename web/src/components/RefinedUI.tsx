"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain, Loader2, Lock, Mic, MicOff
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
    popular_curricula: "Popular Curricula",
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
    quality: "Institutional Quality", quality_desc: "Every module on OpenPrimer is designed according to rigorous academic workload standards.",
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
    curricula: "Curricula", total_courses: "Total Courses",
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
    passwords_dont_match: "Passwords do not match.", all_fields_required: "Please fill in all required fields.", invalid_name: "Please enter a valid name (2-60 characters, letters/spaces/hyphens only).", invalid_email: "Please enter a valid email address.", email_placeholder: "john.doe@email.com",
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
    mailbox_sim_title: "MAILBOX SIMULATOR", forgot_question: "Forgot?", email_required_error: "Please enter your email and password.",
    study_streak: "Study Streak", mastery_points: "Mastery Points", courses_mastered: "Courses Mastered",
    empty_curriculum_title: "Your curriculum is empty",
    empty_curriculum_desc: "Explore our premium catalog and kick off your first self-directed learning quest today.",
    empty_curriculum_btn: "Explore Catalog",
    active_language: "Active Language: English",
    catalog_translation_guide: "CATALOG TRANSLATION GUIDE",
    translation_guide_text: "💡 Change the language in the top navigation bar to discover courses in other languages.",
    voice_not_supported: "Speech recognition is not supported in this browser. Please use Chrome.",
    tutor_unlock_title_prefix: "", tutor_unlock_title_suffix: " AI Tutor",
    tutor_unlock_desc: "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!",
    signup_free: "Sign Up to Unlock", connect: "Log In",
    connection_difficulties: "Connection difficulties detected... retrying automatically",
    please_wait: "Please Wait",
    voice_active: "VOICE CAPTURE ACTIVE...", voice_stop: "Stop",
    voice_enable: "Active voice coaching input",
    offline_placeholder: "Connection unavailable...",
    course_sheet_title: "Display Presentation Sheet", course_sheet: "Course Sheet",
    report_issue: "Report an issue",
    report_desc: "Help our AI refine the curriculum. Describe the mathematical, lexical, or pedagogical issue on this page.",
    report_comment: "Comment (Optional)",
    report_placeholder: "e.g., The derivation in line 12 is missing a minus sign...",
    cancel: "Cancel", report_submit: "Submit Report", report_sending: "Sending...",
    report_success: "Report submitted successfully",
    prerequisites: "Academic Prerequisites",
    prerequisite_view_prefix: "View details for: ",
    prerequisite_unlocked: "✓ Unlocked", prerequisite_required: "⚠️ Required",
    confirm: "Confirm",
    achievements_gallery: "Achievements Gallery",
    no_achievements_earned: "No achievements unlocked yet. Complete courses and quizzes to earn your first badges!",
    unlocked: "Unlocked",
    active_multi_course_curriculum: "ACTIVE MULTI-COURSE CURRICULUM",
    global_curriculum_progression: "Global Curriculum Progression",
    curriculum_integration_desc: "This roadmap integrates {count} academic courses. You complete the curriculum by mastering each milestone.",
    milestones_and_modules: "Milestones & Course Modules",
    milestone_step: "Milestone {step}",
    jump_in: "Jump In",
    disenroll_confirm_title_sub: "DISENROLLMENT CONFIRMATION",
    disenroll_confirm_title: "Abandon Module?",
    disenroll_confirm_desc: "Are you absolutely sure you want to abandon \"{title}\"? Your local progress on this module will be reset, but your global mastery points and achievements remain fully secure.",
    select_ai_tutor: "Select an AI Tutor",
    tutor_modal_desc: "Choose the pedagogical voice that matches your style",
    tutor_modal_footer: "💡 Come back here at any time to change your tutor and adapt your learning support.",
    academic_rendering_error: "Academic Rendering Error",
    academic_rendering_error_desc: "An error occurred during the compilation or MDX rendering of this course module.",
    day: "day",
    days: "days",
    streak_impressive: "🏆 Impressive streak!",
    streak_keep_up: "⚡ Keep it up!",
    streak_empty: "Come back daily to build a streak!",
    mastery_master: "🏆 Master",
    mastery_expert: "⭐ Expert",
    mastery_scholar: "📚 Scholar",
    mastery_apprentice: "🌱 Apprentice",
    badge_reader: "📖 Dedicated reader",
    badge_progress: "✨ Great progress",
    badge_counts: "Every minute counts!",
    in_progress_of: "in progress • of",
    enrolled: "enrolled",
    completed: "completed",
    remove_favorites: "Remove from favorites",
    save_course: "Save this course",
    presentation_sheet: "Presentation sheet",
    abandon: "Abandon",
    time_spent: "Time spent:",
    expected_time: "Expected:",
    manage_curriculum: "Manage Curriculum",
    continue_course: "Continue Course",
    recommended_next_steps: "Recommended Next Steps",
    recommended_next_steps_desc: "Based on your academic progression and recent completions",
    recommended_by_tutor: "Recommended by {tutor}",
    add_to_curriculum: "Add to Curriculum",
    active: "Active"
  },
  FR: { 
    my_progress: "Mon Progrès", admin: "Console Admin", settings: "Paramètres",
    popular_curricula: "Curriculums Populaires",
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
    quality: "Qualité Institutionnelle", quality_desc: "Chaque module sur OpenPrimer est conçu selon des normes rigoureuses de volume d'étude.",
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
    curricula: "Cursus", total_courses: "Cours Totaux",
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
    passwords_dont_match: "Les mots de passe ne correspondent pas.", all_fields_required: "Veuillez remplir tous les champs requis.", invalid_name: "Veuillez entrer un nom valide (2 à 60 caractères, lettres/espaces/tirets uniquement).", invalid_email: "Veuillez entrer une adresse email valide.", email_placeholder: "jean.dupont@email.com",
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
    mailbox_sim_title: "SIMULATEUR DE BOÎTE MAIL", forgot_question: "Oublié ?", email_required_error: "Veuillez renseigner votre email et votre mot de passe.",
    study_streak: "Série d'étude", mastery_points: "Points de Maîtrise", courses_mastered: "Cours Terminés",
    empty_curriculum_title: "Votre curriculum est vide",
    empty_curriculum_desc: "Parcourez notre catalogue premium et commencez votre premier parcours de formation auto-dirigé dès aujourd'hui.",
    empty_curriculum_btn: "Parcourir le catalogue",
    active_language: "Langue active : Français",
    catalog_translation_guide: "GUIDE DE TRADUCTION DU CATALOGUE",
    translation_guide_text: "💡 Changez la langue dans la barre de navigation supérieure pour découvrir des cours dans d'autres langues.",
    voice_not_supported: "L'entrée vocale n'est pas supportée sur ce navigateur. Veuillez utiliser Chrome.",
    tutor_unlock_title_prefix: "Tuteur ", tutor_unlock_title_suffix: " IA",
    tutor_unlock_desc: "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !",
    signup_free: "S'inscrire Gratuitement", connect: "Se Connecter",
    connection_difficulties: "Difficultés de connexion détectées... reconnexion automatique",
    please_wait: "Patienter",
    voice_active: "ÉCOUTE ACTIVE...", voice_stop: "Arrêter",
    voice_enable: "Activer l'entrée vocale",
    offline_placeholder: "Connexion indisponible...",
    course_sheet_title: "Afficher la fiche de présentation", course_sheet: "Fiche du cours",
    report_issue: "Signaler une erreur",
    report_desc: "Aidez notre IA à affiner le cursus. Décrivez l'erreur pédagogique, de traduction ou scientifique sur cette page.",
    report_comment: "Commentaire (Optionnel)",
    report_placeholder: "ex: Le calcul de la force de frottement à la ligne 12 est erroné...",
    cancel: "Annuler", report_submit: "Soumettre le Rapport", report_sending: "Envoi...",
    report_success: "Rapport soumis avec succès",
    prerequisites: "Prérequis Académiques",
    prerequisite_view_prefix: "Voir la fiche de : ",
    prerequisite_unlocked: "✓ Débloqué", prerequisite_required: "⚠️ Requis",
    confirm: "Confirmer",
    achievements_gallery: "Galerie des Succès",
    no_achievements_earned: "Aucun succès déverrouillé pour le moment. Terminez des cours et des quiz pour obtenir vos premiers badges !",
    unlocked: "Déverrouillé",
    active_multi_course_curriculum: "CURRICULUM MULTI-COURS EN COURS",
    global_curriculum_progression: "Progression Globale du Curriculum",
    curriculum_integration_desc: "Ce parcours intègre {count} cours complémentaires. Vous validez l'ensemble du curriculum en terminant chaque étape.",
    milestones_and_modules: "Modules et Étapes",
    milestone_step: "Étape {step}",
    jump_in: "Accéder",
    disenroll_confirm_title_sub: "CONFIRMATION DE DÉSINSCRIPTION",
    disenroll_confirm_title: "Abandonner le module ?",
    disenroll_confirm_desc: "Êtes-vous absolument sûr de vouloir abandonner \"{title}\" ? Votre progression locale sur ce module sera réinitialisée, mais vos points de maîtrise globaux et succès restent pleinement préservés.",
    select_ai_tutor: "Sélectionner un Tuteur IA",
    tutor_modal_desc: "Choisissez le style pédagogique adapté à vos besoins",
    tutor_modal_footer: "💡 Revenez ici à tout moment pour changer de tuteur et adapter votre accompagnement.",
    academic_rendering_error: "Erreur de Rendu Académique",
    academic_rendering_error_desc: "Une erreur s'est produite lors de la compilation ou du rendu MDX de ce module de cours.",
    day: "jour",
    days: "jours",
    streak_impressive: "🏆 Série impressionnante !",
    streak_keep_up: "⚡ Continue comme ça !",
    streak_empty: "Reviens chaque jour pour une série !",
    mastery_master: "🏆 Maître",
    mastery_expert: "⭐ Expert",
    mastery_scholar: "📚 Érudit",
    mastery_apprentice: "🌱 Apprenti",
    badge_reader: "📖 Lecteur assidu",
    badge_progress: "✨ Belle progression",
    badge_counts: "Chaque minute compte !",
    in_progress_of: "en cours • sur",
    enrolled: "inscrits",
    completed: "complété",
    remove_favorites: "Supprimer des favoris",
    save_course: "Sauvegarder ce cours",
    presentation_sheet: "Fiche de présentation",
    abandon: "Abandonner",
    time_spent: "Temps passé :",
    expected_time: "Attendu :",
    manage_curriculum: "Gérer le Curriculum",
    continue_course: "Continuer le cours",
    recommended_next_steps: "Poursuites Possibles",
    recommended_next_steps_desc: "Basé sur votre progression académique et vos succès récents",
    recommended_by_tutor: "Recommandé par {tutor}",
    add_to_curriculum: "Ajouter au Curriculum",
    active: "Actif"
  },
  ES: { 
    my_progress: "Mi Progreso", admin: "Consola Admin", settings: "Ajustes",
    popular_curricula: "Planes de Estudio Populares",
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
    quality: "Calidad Institucional", quality_desc: "Cada módulo en OpenPrimer está diseñado de acuerdo con rigurosos estándares de volumen de estudio.",
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
    curricula: "Planes de Estudio", total_courses: "Cursos Totales",
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
    passwords_dont_match: "Las contraseñas no coinciden.", all_fields_required: "Por favor, rellene todos los campos requeridos.", invalid_name: "Por favor, introduzca un nombre válido (2-60 caracteres, solo letras/espacios/guiones).", invalid_email: "Por favor, introduzca una dirección de correo electrónico válida.", email_placeholder: "juan.perez@email.com",
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
    mailbox_sim_title: "SIMULADOR DE BANDEJA DE ENTRADA", forgot_question: "¿Olvidó?", email_required_error: "Por favor, introduzca su correo electrónico y contraseña.",
    study_streak: "Racha de estudio", mastery_points: "Puntos de Maestría", courses_mastered: "Cursos Dominados",
    empty_curriculum_title: "Tu plan de estudios está vacío",
    empty_curriculum_desc: "Explora nuestro catálogo premium y comienza hoy mismo tu primera búsqueda de aprendizaje autodirigido.",
    empty_curriculum_btn: "Explorar catálogo",
    active_language: "Idioma activo : Español",
    catalog_translation_guide: "GUÍA DE TRADUCCIÓN DEL CATÁLOGO",
    translation_guide_text: "💡 Cambie el idioma en la barra de navegación superior para descubrir cursos en otros idiomas.",
    voice_not_supported: "El reconocimiento de voz no está disponible en este navegador. Utilice Chrome.",
    tutor_unlock_title_prefix: "Tutor IA ", tutor_unlock_title_suffix: "",
    tutor_unlock_desc: "Una cuenta gratuita está disponible para seguir el currículo completo, guardar tu progreso de forma permanente y beneficiarte de un tutor IA personal excepcional.",
    signup_free: "Registrarse Gratis", connect: "Iniciar Sesión",
    connection_difficulties: "Dificultades de conexión detectadas... reintentando automáticamente",
    please_wait: "Espere",
    voice_active: "CAPTURA DE VOZ ACTIVA...", voice_stop: "Detener",
    voice_enable: "Activar entrada de voz",
    offline_placeholder: "Conexión no disponible...",
    course_sheet_title: "Mostrar ficha de presentación", course_sheet: "Ficha del curso",
    report_issue: "Reportar un problema",
    report_desc: "Ayuda a nuestra IA a mejorar el currículo. Describe el problema matemático, léxico o pedagógico en esta página.",
    report_comment: "Comentario (Opcional)",
    report_placeholder: "ej: La derivación en la línea 12 le falta un signo menos...",
    cancel: "Cancelar", report_submit: "Enviar Informe", report_sending: "Enviando...",
    report_success: "Informe enviado correctamente",
    prerequisites: "Prerrequisitos Académicos",
    prerequisite_view_prefix: "Ver detalles de: ",
    prerequisite_unlocked: "✓ Desbloqueado", prerequisite_required: "⚠️ Requerido",
    confirm: "Confirmar",
    achievements_gallery: "Galería de Logros",
    no_achievements_earned: "Aún no has desbloqueado ningún logro. ¡Completa cursos y cuestionarios para ganar tus primeras insignias!",
    unlocked: "Desbloqueado",
    active_multi_course_curriculum: "PLAN DE ESTUDIO MULTI-CURSO ACTIVO",
    global_curriculum_progression: "Progresión Global del Plan de Estudios",
    curriculum_integration_desc: "Este plan de estudios integra {count} cursos complementarios. Completa el currículo al dominar cada hito.",
    milestones_and_modules: "Hitos y Módulos de Curso",
    milestone_step: "Hito {step}",
    jump_in: "Acceder",
    disenroll_confirm_title_sub: "CONFIRMACIÓN DE DESINSCRIPCIÓN",
    disenroll_confirm_title: "¿Abandonar el módulo?",
    disenroll_confirm_desc: "¿Está absolutamente seguro de que desea abandonar \"{title}\"? Su progreso local en este hito se restablecerá, pero sus puntos de maestría globales y logros se conservarán.",
    select_ai_tutor: "Seleccionar un Tutor IA",
    tutor_modal_desc: "Elija el estilo pedagógico adaptado a sus necesidades",
    tutor_modal_footer: "💡 Regrese aquí en cualquier momento para cambiar de tutor y adaptar su acompañamiento.",
    academic_rendering_error: "Error de Renderizado Académico",
    academic_rendering_error_desc: "Ocurrió un error durante la compilación o el renderizado MDX de este módulo de curso.",
    day: "día",
    days: "días",
    streak_impressive: "🏆 ¡Racha impresionante!",
    streak_keep_up: "⚡ ¡Sigue así!",
    streak_empty: "¡Vuelve a diario para crear una racha!",
    mastery_master: "🏆 Maestro",
    mastery_expert: "⭐ Experto",
    mastery_scholar: "📚 Erudito",
    mastery_apprentice: "🌱 Aprendiz",
    badge_reader: "📖 Lector dedicado",
    badge_progress: "✨ Gran progreso",
    badge_counts: "¡Cada minuto cuenta!",
    in_progress_of: "en curso • de",
    enrolled: "inscritos",
    completed: "completado",
    remove_favorites: "Quitar de favoritos",
    save_course: "Guardar este curso",
    presentation_sheet: "Ficha de presentación",
    abandon: "Abandonar",
    time_spent: "Tiempo transcurrido:",
    expected_time: "Esperado:",
    manage_curriculum: "Gestionar Currículum",
    continue_course: "Continuar Curso",
    recommended_next_steps: "Próximos Pasos Recomendados",
    recommended_next_steps_desc: "Basado en tu progresión académica y finalizaciones recientes",
    recommended_by_tutor: "Recomendado por {tutor}",
    add_to_curriculum: "Añadir al Currículum",
    active: "Activo"
  },
  DE: { 
    my_progress: "Mein Fortschritt", admin: "Admin-Konsole", settings: "Einstellungen",
    popular_curricula: "Beliebte Lehrpläne",
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
    quality: "Institutionelle Qualität", quality_desc: "Jedes Modul auf OpenPrimer ist nach strengen Studienvolumenstandards konzipiert.",
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
    curricula: "Lehrpläne", total_courses: "Gesamte Kurse",
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
    passwords_dont_match: "Passwörter stimmen nicht überein.", all_fields_required: "Bitte füllen Sie alle erforderlichen Felder aus.", invalid_name: "Bitte geben Sie einen gültigen Namen ein (2-60 Zeichen, nur Buchstaben/Leerzeichen/Bindestriche).", invalid_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", email_placeholder: "hans.mueller@email.com",
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
    mailbox_sim_title: "POSTEINGANGS-SIMULATOR", forgot_question: "Vergessen?", email_required_error: "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.",
    study_streak: "Lernserie", mastery_points: "Meisterpunkte", courses_mastered: "Gemeisterte Kurse",
    empty_curriculum_title: "Ihr Lehrplan ist leer",
    empty_curriculum_desc: "Erkunden Sie unseren Premium-Katalog und starten Sie noch heute Ihre erste selbstgesteuerte Lernreise.",
    empty_curriculum_btn: "Katalog erkunden",
    active_language: "Aktive Sprache : Deutsch",
    catalog_translation_guide: "KATALOG-ÜBERSETZUNGSLEITFADEN",
    translation_guide_text: "💡 Ändern Sie die Sprache in der oberen Navigationsleiste, um Kurse in anderen Sprachen zu entdecken.",
    confirm: "Bestätigen",
    achievements_gallery: "Errungenschaften-Galerie",
    no_achievements_earned: "Noch keine Errungenschaften freigeschaltet. Schließen Sie Kurse und Quizze ab, um Ihre ersten Abzeichen zu verdienen!",
    unlocked: "Freigeschaltet",
    active_multi_course_curriculum: "AKTIVER MEHRKURS-LEHRPLAN",
    global_curriculum_progression: "Lehrplan-Gesamtfortschritt",
    curriculum_integration_desc: "Dieser Lehrplan integriert {count} akademische Kurse. Sie schließen den Lehrplan ab, indem Sie jeden Meilenstein meistern.",
    milestones_and_modules: "Meilensteine & Kursmodule",
    milestone_step: "Schritt {step}",
    jump_in: "Eintreten",
    disenroll_confirm_title_sub: "BESTÄTIGUNG DER ABMELDUNG",
    disenroll_confirm_title: "Modul abbrechen?",
    disenroll_confirm_desc: "Sind Sie absolut sicher, dass Sie \"{title}\" abbrechen möchten? Ihr lokaler Fortschritt in diesem Modul wird zurückgesetzt, aber Ihre globalen Meisterpunkte und Errungenschaften bleiben vollständig erhalten.",
    select_ai_tutor: "KI-Tutor auswählen",
    tutor_modal_desc: "Wählen Sie den pädagogischen Stil, der zu Ihnen passt",
    tutor_modal_footer: "💡 Sie können jederzeit hierher zurückkehren, um den Tutor zu wechseln und Ihre Unterstützung anzupassen.",
    academic_rendering_error: "Akademischer Rendering-Fehler",
    academic_rendering_error_desc: "Während der Kompilierung oder des MDX-Renderings dieses Kursmoduls ist ein Fehler aufgetreten.",
    day: "Tag",
    days: "Tage",
    streak_impressive: "🏆 Beeindruckende Serie!",
    streak_keep_up: "⚡ Weiter so!",
    streak_empty: "Kommen Sie täglich wieder, um eine Serie aufzubauen!",
    mastery_master: "🏆 Meister",
    mastery_expert: "⭐ Experte",
    mastery_scholar: "📚 Gelehrter",
    mastery_apprentice: "🌱 Lehrling",
    badge_reader: "📖 Engagierter Leser",
    badge_progress: "✨ Toller Fortschritt",
    badge_counts: "Jede Minute zählt!",
    in_progress_of: "in Bearbeitung • von",
    enrolled: "eingeschrieben",
    completed: "abgeschlossen",
    remove_favorites: "Aus Lesezeichen entfernen",
    save_course: "Diesen Kurs speichern",
    presentation_sheet: "Präsentationsblatt",
    abandon: "Abbrechen",
    time_spent: "Zeitaufwand:",
    expected_time: "Erwartet:",
    manage_curriculum: "Lehrplan verwalten",
    continue_course: "Kurs fortsetzen",
    recommended_next_steps: "Empfohlene nächste Schritte",
    recommended_next_steps_desc: "Basierend auf Ihrem akademischen Fortschritt und den letzten Abschlüssen",
    recommended_by_tutor: "Empfohlen von {tutor}",
    add_to_curriculum: "Zum Lehrplan hinzufügen",
    active: "Aktiv"
  },
  ZH: { 
    my_progress: "我的进度", admin: "管理控制台", settings: "账户设置",
    popular_curricula: "热门课程计划",
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
    quality: "机构质量", quality_desc: "OpenPrimer 上的每个模块都按照严格的学习量标准设计。",
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
    curricula: "学术大纲", total_courses: "全部课程",
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
    passwords_dont_match: "密码不匹配。", all_fields_required: "请填写所有必填字段。", invalid_name: "请输入有效的名字（2-60个字符，仅限字母/空格/连字符）。", invalid_email: "请输入有效的电子邮件地址。", email_placeholder: "zhang.san@email.com",
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
    mailbox_sim_title: "邮箱模拟器", forgot_question: "忘记？", email_required_error: "请输入您的电子邮件和密码。",
    study_streak: "学习连续天数", mastery_points: "掌控点数", courses_mastered: "已完成的课程",
    empty_curriculum_title: "您的学习体系是空的",
    empty_curriculum_desc: "探索我们的优质课程目录，今天就开启您的首个自主学习之旅。",
    empty_curriculum_btn: "探索课程目录",
    active_language: "当前语言：中文",
    catalog_translation_guide: "课程目录语言切换指南",
    translation_guide_text: "💡 在顶部导航栏中切换语言，即可探索其他语言的课程目录。",
    voice_not_supported: "此浏览器不支持语音识别。请使用 Chrome。",
    tutor_unlock_title_prefix: "", tutor_unlock_title_suffix: " AI 导师",
    tutor_unlock_desc: "免费账户可让您跟随完整课程课表、永久保存学习进度，并享受卓越个人 AI 导师的所有功能！",
    signup_free: "免费注册解锁", connect: "登录",
    connection_difficulties: "检测到连接问题，正在自动重连...",
    please_wait: "请稍候",
    voice_active: "语音捕捉激活中...", voice_stop: "停止",
    voice_enable: "激活语音辅导输入",
    offline_placeholder: "连接不可用...",
    course_sheet_title: "显示课程介绍单", course_sheet: "课程单",
    report_issue: "报告错误",
    report_desc: "帮助我们的 AI 优化课程内容。请描述本页的教学、翻译或科学错误。",
    report_comment: "评论（可选）",
    report_placeholder: "例：第12行摩擦力计算错误...",
    cancel: "取消", report_submit: "提交报告", report_sending: "提交中...",
    report_success: "报告成功提交",
    prerequisites: "学术先决条件",
    prerequisite_view_prefix: "查看详情：",
    prerequisite_unlocked: "✓ 已解锁", prerequisite_required: "⚠️ 必需",
    confirm: "确认",
    achievements_gallery: "成就荣誉展厅",
    no_achievements_earned: "尚未解锁任何成就。完成课程和测验以获得您的第一批徽章！",
    unlocked: "已解锁",
    active_multi_course_curriculum: "当前多课程学习计划",
    global_curriculum_progression: "学习计划总体进度",
    curriculum_integration_desc: "本学习计划整合了 {count} 门学术课程。您需要通过掌握每个里程碑来完成全部课程。",
    milestones_and_modules: "里程碑与课程模块",
    milestone_step: "里程碑 {step}",
    jump_in: "进入学习",
    disenroll_confirm_title_sub: "取消注册确认",
    disenroll_confirm_title: "放弃模块学习？",
    disenroll_confirm_desc: "您确定要放弃学习 \"{title}\" 吗？您在该模块的本地进度将被重置，但您的全局掌握点数和成就荣誉仍将被完整保留。",
    select_ai_tutor: "选择 AI 导师",
    tutor_modal_desc: "选择最契合您学习风格的辅导声音",
    tutor_modal_footer: "💡 随时可以回到此处更换导师，以调整您的学习辅导模式。",
    academic_rendering_error: "学术内容渲染错误",
    academic_rendering_error_desc: "在此课程模块的编译或 MDX 渲染过程中发生错误。",
    day: "天",
    days: "天",
    streak_impressive: "🏆 令人惊叹的连续学习天数！",
    streak_keep_up: "⚡ 继续保持！",
    streak_empty: "每天回来学习以保持连续天数！",
    mastery_master: "🏆 大师",
    mastery_expert: "⭐ 专家",
    mastery_scholar: "📚 学者",
    mastery_apprentice: "🌱 学徒",
    badge_reader: "📖 专心致志的读者",
    badge_progress: "✨ 极大进步",
    badge_counts: "每一分钟都至关重要！",
    in_progress_of: "进行中 • 共",
    enrolled: "门",
    completed: "已完成",
    remove_favorites: "从收藏夹中移除",
    save_course: "收藏此课程",
    presentation_sheet: "展示单",
    abandon: "放弃",
    time_spent: "已学时长:",
    expected_time: "预计时长:",
    manage_curriculum: "管理课程表",
    continue_course: "继续学习",
    recommended_next_steps: "推荐的下一步课程",
    recommended_next_steps_desc: "基于您的学术进展和最近完成的课程",
    recommended_by_tutor: "导师 {tutor} 推荐",
    add_to_curriculum: "添加到课程表",
    active: "生效"
  }
};

// Clear legacy local storage translation caches to prevent stale overrides
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('openprimer_ui_strings_')) {
        window.localStorage.removeItem(key);
      }
    }
  } catch (e) {}
}

export const UI_STRINGS = new Proxy(STATIC_UI_STRINGS, {
  get(target, prop: string) {
    return target[prop.toUpperCase() as keyof typeof target] || target.EN;
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
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
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
        proof: 'Rigorous Proof Master',
        diamond_age: 'Illustrated Primer Coach'
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = lang.toLowerCase() === 'fr' ? 'fr-FR' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(prev => prev ? prev + " " + transcript : transcript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition error:", e);
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t.voice_not_supported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getPersonaName = (pName: string) => {
    const selected = personalities.find(p => p.name === pName || p.id === pName);
    if (selected && selected.translations?.[lang.toUpperCase()]) {
      return selected.translations[lang.toUpperCase()].name;
    }
    return pName;
  };

  useEffect(() => {
    const updateAuth = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
    };
    updateAuth();
    window.addEventListener('storage', updateAuth);
    window.addEventListener('op_auth_state_changed', updateAuth);
    window.addEventListener('op_auth_state_change', updateAuth);
    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('op_auth_state_changed', updateAuth);
      window.removeEventListener('op_auth_state_change', updateAuth);
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
    const key = `op_tutor_hist_${courseSlug}_${lang.toUpperCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: t.welcome }]);
    }
  }, [courseSlug, lang, t.welcome]);

  useEffect(() => {
    if (messages.length > 1) {
      const key = `op_tutor_hist_${courseSlug}_${lang.toUpperCase()}`;
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
            content: t.tutor_error
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
                            {p.translations?.[lang.toUpperCase()]?.name || p.name}
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
                    {t.tutor_unlock_title_prefix}{getPersonaName(persona)}{t.tutor_unlock_title_suffix}
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
                    {t.signup_free}
                  </button>
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="w-full py-3.5 bg-slate-800 border border-slate-750 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl transition-all hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    {t.connect}
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
                        {t.please_wait}
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
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      disabled={isOffline} 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                      placeholder={isOffline ? t.offline_placeholder : t.placeholder} 
                      className="w-full bg-slate-800/40 border border-slate-700/30 rounded-2xl py-4 pl-6 pr-28 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed" 
                    />
                    
                    {isListening && (
                      <div className="absolute inset-0 bg-slate-900/95 border border-blue-500/40 rounded-2xl flex items-center justify-between px-6 backdrop-blur-xl animate-fade-in z-20">
                        <style>{`
                          @keyframes wave-oscillate {
                            0%, 100% { transform: scaleY(0.2); }
                            50% { transform: scaleY(1.0); }
                          }
                          .osc-bar {
                            transform-origin: center;
                            animation: wave-oscillate var(--d, 1s) ease-in-out infinite;
                          }
                        `}</style>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            {t.voice_active}
                          </span>
                        </div>
                        
                        {/* Premium SVG Oscilloscope */}
                        <div className="flex items-center gap-1.5 h-6">
                          <div className="w-[3px] bg-blue-500 rounded-full h-5 osc-bar" style={{ '--d': '0.7s' } as any} />
                          <div className="w-[3px] bg-indigo-500 rounded-full h-5 osc-bar" style={{ '--d': '0.5s' } as any} />
                          <div className="w-[3px] bg-violet-500 rounded-full h-5 osc-bar" style={{ '--d': '0.9s' } as any} />
                          <div className="w-[3px] bg-fuchsia-500 rounded-full h-5 osc-bar" style={{ '--d': '0.6s' } as any} />
                          <div className="w-[3px] bg-pink-500 rounded-full h-5 osc-bar" style={{ '--d': '0.8s' } as any} />
                          <div className="w-[3px] bg-rose-500 rounded-full h-5 osc-bar" style={{ '--d': '0.4s' } as any} />
                          <div className="w-[3px] bg-red-500 rounded-full h-5 osc-bar" style={{ '--d': '0.7s' } as any} />
                        </div>

                        <button 
                          type="button"
                          onClick={toggleListening}
                          className="px-4 py-2 bg-red-650 hover:bg-red-600 border border-red-500/40 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] text-white transition-all shadow-md cursor-pointer"
                        >
                          {t.voice_stop}
                        </button>
                      </div>
                    )}

                    <button 
                      type="button"
                      disabled={isOffline} 
                      onClick={toggleListening} 
                      className={`absolute right-16 top-3 p-2 rounded-xl border transition-all ${isListening ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'} disabled:opacity-40 disabled:cursor-not-allowed`}
                      title={t.voice_enable}
                      aria-label="Active voice coaching input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={isOffline} 
                      onClick={() => handleSend()} 
                      className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all disabled:bg-blue-600/30 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const [userProfile, setUserProfile] = useState<{ email: string; firstName: string; lastName: string; role?: string; } | null>(null);
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
  
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

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

    const handleAuthStateChange = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
      const profile = localStorage.getItem('op_user_profile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        setUserProfile(null);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthStateChange);
    window.addEventListener('op_auth_state_changed', handleAuthStateChange);
    window.addEventListener('op_accessibility_preferences_changed', handleAuthStateChange);

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
      window.removeEventListener('op_auth_state_change', handleAuthStateChange);
      window.removeEventListener('op_auth_state_changed', handleAuthStateChange);
      window.removeEventListener('op_accessibility_preferences_changed', handleAuthStateChange);
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

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
    } catch (e) {
      console.error("SignOut error:", e);
    }
    localStorage.removeItem('op_session');
    localStorage.removeItem('op_user_profile');
    setIsLoggedIn(false);
    triggerToast(t.signout);
    
    if (typeof window !== 'undefined') {
      const privilegedPaths = ['/profile', '/admin'];
      const isPrivileged = privilegedPaths.some(p => window.location.pathname.startsWith(p));
      if (isPrivileged) {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
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
            <span className="text-lg">{languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.label || lang.toUpperCase()}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {languages.map(l => (
                   <button key={l.code} onClick={() => handleLanguageSelect(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang.toUpperCase() === l.code.toUpperCase() ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang.toUpperCase() === l.code.toUpperCase() && <CheckCircle className="w-3 h-3" />}
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
            title={t.course_sheet_title}
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{t.course_sheet}</span>
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
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">{t.logged_in_as}</p>
                     <p className="text-xs font-bold text-white truncate">
                        {(() => {
                           if (!userProfile) return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                           const profile = userProfile as any;
                           if (profile.name && typeof profile.name === 'string' && profile.name.trim()) {
                             return profile.name.trim();
                           }
                           const parts = [];
                           if (profile.firstName && typeof profile.firstName === 'string' && profile.firstName.trim()) {
                             parts.push(profile.firstName.trim());
                           }
                           if (profile.lastName && typeof profile.lastName === 'string' && profile.lastName.trim()) {
                             parts.push(profile.lastName.trim());
                           }
                           if (parts.length > 0) {
                             return parts.join(' ').trim();
                           }
                           return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                         })()}
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

                    {(userProfile?.role === 'admin' || userProfile?.email === 'vanguard.mysterious@gmail.com') && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                        <ShieldAlert className="w-4 h-4" /> {t.admin}
                      </Link>
                    )}
                    
                    <div className="h-px bg-slate-800/50 my-1" />
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
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
                  <AlertTriangle className="w-5 h-5 text-red-500" /> {t.report_issue}
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
                  {t.report_desc}
                </p>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {t.report_comment}
                  </label>
                  <textarea 
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    rows={4}
                    placeholder={t.report_placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none text-white placeholder:text-slate-700" 
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setIsReportModalOpen(false); setReportComment(''); }} 
                    className="flex-1 py-4 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400"
                  >
                    {t.cancel}
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
                      triggerToast(t.report_success);
                    }}
                    disabled={submittingReport}
                    className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 disabled:bg-slate-800"
                  >
                    {submittingReport 
                      ? t.report_sending
                      : t.report_submit}
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
                  <p className="text-xs font-black text-white">{(COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.ects || 6) * 100} {lang.toUpperCase() === 'FR' ? 'crédits' : 'credits'}</p>
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
                    {t.prerequisites}
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
                          title={clickable ? `${t.prerequisite_view_prefix}${matchedCourse.title}` : undefined}
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
                              ? t.prerequisite_unlocked
                              : t.prerequisite_required}
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

  const [readingMode, setReadingMode] = React.useState('dark');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
      setReadingMode(savedMode);
    }

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);
    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
    };
  }, []);

  const isPaper = readingMode === 'paper';
  const isFocus = readingMode === 'focus';
  
  const bgClass = isPaper 
    ? "bg-[#fcfaf2] border-t border-[#eae0cb]" 
    : isFocus 
      ? "bg-black border-t border-[#111111]" 
      : "bg-slate-950 border-t border-slate-900";
      
  const textTitleClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#555555]" 
      : "text-slate-400";
      
  const textDescClass = isPaper 
    ? "text-[#6c5c4e]" 
    : isFocus 
      ? "text-[#666666]" 
      : "text-slate-500";
      
  const textLinkClass = isPaper 
    ? "text-[#8a7664] hover:text-[#2d241e]" 
    : isFocus 
      ? "text-[#555555] hover:text-white" 
      : "text-slate-600 hover:text-white";
      
  const borderBottomClass = isPaper 
    ? "border-[#eae0cb]" 
    : isFocus 
      ? "border-[#111111]" 
      : "border-slate-900/50";
      
  const textCopyrightClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#444444]" 
      : "text-slate-800";

  return (
    <footer className={`${bgClass} pt-24 pb-12 px-8 overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className={`text-sm ${textDescClass} leading-relaxed italic`}>
              {t.footer_desc}
            </p>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className={`text-sm ${textLinkClass} transition-colors`}>{t.philosophy}</Link></li>
              <li><Link href="/contact" className={`text-sm ${textLinkClass} transition-colors`}>{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className={`text-sm ${textLinkClass} transition-colors`}>{t.catalog}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className={`text-sm ${textLinkClass} transition-colors`}>{t.terms}</Link></li>
              <li><Link href="/privacy" className={`text-sm ${textLinkClass} transition-colors`}>{t.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className={`pt-12 border-t ${borderBottomClass} flex flex-col md:flex-row justify-between items-center gap-8`}>
          <div className={`text-[9px] font-black ${textCopyrightClass} uppercase tracking-[0.4em]`}>
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
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
          {t.copyright}
        </div>
        <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
           <span className="text-xs font-bold text-white">🇪🇺</span>
           <span className="text-xs font-bold text-white">🇨🇳</span>
           <span className="text-xs font-bold text-white">🇺🇸</span>
        </div>
      </div>
    </footer>
  );
};
