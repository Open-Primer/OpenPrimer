"use client";
 
import React, { useState, useEffect } from 'react';
import { dbService, UserProfile, UserRole } from '@/lib/db';
import { Search, UserCog, Shield, ShieldCheck, Mail, Calendar, ChevronRight, Ban, Trash2, Check, X, AlertCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export const USERS_STRINGS = {
  EN: {
    title: "Identity Control",
    subtitle: "Manage platform security and administrative roles.",
    add_student: "Add Student",
    search_placeholder: "Search students...",
    col_identity: "Identity",
    col_privileges: "Privileges",
    col_progress: "Progress",
    col_status: "Status",
    col_access: "Access Control",
    admin_role: "Admin",
    student_role: "Student",
    status_blocked: "Blocked",
    status_active: "Active",
    confirm_title: "Confirm Action",
    confirm_msg: "Are you sure you want to perform this action? This action may be irreversible.",
    cancel: "Cancel",
    execute: "Execute",
    add_title: "Add New Student",
    full_name: "Full Name",
    email_address: "Email Address",
    password: "Password",
    system_role: "System Role",
    lang_pref: "Language Preference",
    visual_theme: "Visual Theme",
    create_profile: "Create Student Profile",
    error_required: "Name and Email are strictly required fields.",
    error_email: "Please supply a valid corporate or academic email address.",
    error_password: "Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.",
    student_opt: "🎓 Student Profile (Default)",
    admin_opt: "🛡️ Administrator privileges",
    theme_default: "✨ Default (Dark)",
    theme_paper: "📜 Paper (Sepia)",
    theme_focus: "👁️ Focus (Black)"
  },
  FR: {
    title: "Contrôle d'Identité",
    subtitle: "Gerez la sécurité de la plateforme et les rôles administratifs.",
    add_student: "Ajouter un Étudiant",
    search_placeholder: "Rechercher des étudiants...",
    col_identity: "Identité",
    col_privileges: "Privilèges",
    col_progress: "Progression",
    col_status: "Statut",
    col_access: "Contrôle d'Accès",
    admin_role: "Admin",
    student_role: "Étudiant",
    status_blocked: "Bloqué",
    status_active: "Actif",
    confirm_title: "Confirmer l'Action",
    confirm_msg: "Êtes-vous sûr de vouloir effectuer cette action ? Cette action peut être irréversible.",
    cancel: "Annuler",
    execute: "Exécuter",
    add_title: "Ajouter un Nouvel Étudiant",
    full_name: "Nom Complet",
    email_address: "Adresse Email",
    password: "Mot de passe",
    system_role: "Rôle Système",
    lang_pref: "Préférence de Langue",
    visual_theme: "Thème Visuel",
    create_profile: "Créer le Profil Étudiant",
    error_required: "Le nom et l'email sont strictement requis.",
    error_email: "Veuillez fournir une adresse email valide.",
    error_password: "Le mot de passe doit contenir au moins 12 caractères, incluant une lettre majuscule, une lettre minuscule, un nombre et un caractère spécial.",
    student_opt: "🎓 Profil Étudiant (Par défaut)",
    admin_opt: "🛡️ Privilèges Administrateur",
    theme_default: "✨ Par défaut (Sombre)",
    theme_paper: "📜 Papier (Sépia)",
    theme_focus: "👁️ Focus (Noir)"
  },
  ES: {
    title: "Control de Identidad",
    subtitle: "Gestione la seguridad de la plataforma y los roles administrativos.",
    add_student: "Añadir Estudiante",
    search_placeholder: "Buscar estudiantes...",
    col_identity: "Identidad",
    col_privileges: "Privilegios",
    col_progress: "Progreso",
    col_status: "Estado",
    col_access: "Control de Acceso",
    admin_role: "Administrador",
    student_role: "Estudiante",
    status_blocked: "Bloqueado",
    status_active: "Activo",
    confirm_title: "Confirmar Acción",
    confirm_msg: "¿Está seguro de que desea realizar esta acción? Esta acción puede ser irreversible.",
    cancel: "Cancelar",
    execute: "Ejecutar",
    add_title: "Añadir Nuevo Estudiante",
    full_name: "Nombre Completo",
    email_address: "Dirección de Correo",
    password: "Contraseña",
    system_role: "Rol del Sistema",
    lang_pref: "Preferencia de Idioma",
    visual_theme: "Tema Visual",
    create_profile: "Crear Perfil de Estudiante",
    error_required: "El nombre y el correo electrónico son campos estrictamente requeridos.",
    error_email: "Por favor proporcione una dirección de correo válida.",
    error_password: "La contraseña debe tener al menos 12 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
    student_opt: "🎓 Perfil de Estudiante (Predeterminado)",
    admin_opt: "🛡️ Privilegios de Administrador",
    theme_default: "✨ Predeterminado (Oscuro)",
    theme_paper: "📜 Papel (Sepia)",
    theme_focus: "👁️ Enfoque (Negro)"
  },
  DE: {
    title: "Identitätskontrolle",
    subtitle: "Verwalten Sie die Plattformsicherheit und administrative Rollen.",
    add_student: "Student hinzufügen",
    search_placeholder: "Studenten suchen...",
    col_identity: "Identität",
    col_privileges: "Privilegien",
    col_progress: "Fortschritt",
    col_status: "Status",
    col_access: "Zugriffskontrolle",
    admin_role: "Admin",
    student_role: "Student",
    status_blocked: "Blockiert",
    status_active: "Aktiv",
    confirm_title: "Aktion bestätigen",
    confirm_msg: "Sind Sie sicher, dass Sie diese Aktion ausführen möchten? Diese Aktion kann unwiderruflich sein.",
    cancel: "Abbrechen",
    execute: "Ausführen",
    add_title: "Neuen Studenten hinzufügen",
    full_name: "Vollständiger Name",
    email_address: "E-Mail-Adresse",
    password: "Passwort",
    system_role: "Systemrolle",
    lang_pref: "Bevorzugte Sprache",
    visual_theme: "Visuelles Thema",
    create_profile: "Studentenprofil erstellen",
    error_required: "Name und E-Mail-Adresse sind Pflichtfelder.",
    error_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    error_password: "Das Passwort muss mindestens 12 Zeichen lang sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    student_opt: "🎓 Studentenprofil (Standard)",
    admin_opt: "🛡️ Administratorrechte",
    theme_default: "✨ Standard (Dunkel)",
    theme_paper: "📜 Papier (Sepia)",
    theme_focus: "👁️ Fokus (Schwarz)"
  },
  ZH: {
    title: "身份与权限控制",
    subtitle: "管理平台安全架构和管理员权限角色。",
    add_student: "添加学生",
    search_placeholder: "搜索学生账号...",
    col_identity: "身份信息",
    col_privileges: "特权角色",
    col_progress: "学习进度",
    col_status: "账号状态",
    col_access: "访问控制",
    admin_role: "管理员",
    student_role: "学生",
    status_blocked: "已封禁",
    status_active: "活跃",
    confirm_title: "确认执行操作",
    confirm_msg: "您确定要执行此操作吗？该操作可能是不可逆的。",
    cancel: "取消",
    execute: "执行",
    add_title: "注册新学生账号",
    full_name: "姓名",
    email_address: "电子邮箱地址",
    password: "密码",
    system_role: "系统角色",
    lang_pref: "首选语言偏好",
    visual_theme: "界面视觉主题",
    create_profile: "创建学生档案",
    error_required: "姓名和邮箱是必填项！",
    error_email: "请输入有效的公司或学校电子邮箱地址。",
    error_password: "密码长度必须至少为 12 个字符，且必须包含大小写字母、数字及特殊字符。",
    student_opt: "🎓 普通学生账号 (默认)",
    admin_opt: "🛡️ 平台系统管理员权限",
    theme_default: "✨ 默认极黑 (深色)",
    theme_paper: "📜 羊皮纸张 (褐色)",
    theme_focus: "👁️ 专注模式 (纯黑)"
  }
};

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-blue-400 cursor-pointer">▲</span> : <span className="ml-1 text-blue-400 cursor-pointer">▼</span>;
};
 
export default function AdminUsers() {
  const { language: globalLang } = useLanguage();
  const lang = (globalLang || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';
  const t = USERS_STRINGS[lang] || USERS_STRINGS.EN;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSortField, setUserSortField] = useState<string>('name');
  const [userSortDir, setUserSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [confirmingAction, setConfirmingAction] = useState<{ type: 'delete' | 'block' | 'role', userId: string, extra?: any } | null>(null);
  
  // Visual Create User states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newLang, setNewLang] = useState('EN');
  const [newReadingMode, setNewReadingMode] = useState('default');
  const [newUserError, setNewUserError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
 
  useEffect(() => {
    loadUsers();
  }, []);
 
  const loadUsers = async () => {
    const { data } = await dbService.getUsers();
    setUsers(data || []);
  };
 
  const handleAction = async () => {
    if (!confirmingAction) return;
    const { type, userId, extra } = confirmingAction;
 
    if (type === 'delete') await dbService.deleteUser(userId);
    if (type === 'block') await dbService.toggleBlockUser(userId);
    if (type === 'role') await dbService.updateUserRole(userId, extra);
 
    setConfirmingAction(null);
    loadUsers();
  };
 
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError(null);
 
    if (!newName.trim() || !newEmail.trim()) {
      setNewUserError(t.error_required);
      return;
    }
 
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setNewUserError(t.error_email);
      return;
    }

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
      setNewUserError(t.error_password);
      return;
    }
 
    const generatedId = 'u_' + Date.now() + Math.random().toString(36).substr(2, 5);
    await dbService.createUser({
      id: generatedId,
      name: newName,
      email: newEmail,
      role: newRole,
      preferredLang: newLang,
      readingMode: newReadingMode,
      password: newPassword
    });
 
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setShowNewPassword(false);
    setNewRole('student');
    setNewLang('EN');
    setNewReadingMode('default');
    loadUsers();
  };
 
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );
 
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[userSortField as keyof typeof a];
    let valB = b[userSortField as keyof typeof b];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;
    if (valA < valB) return userSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return userSortDir === 'asc' ? 1 : -1;
    return 0;
  });
 
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <UserCog className="w-8 h-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsAddUserOpen(true)}
            id="add-student-btn"
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> {t.add_student}
          </button>
          <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder={t.search_placeholder} 
               className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium" 
             />
          </div>
        </div>
      </div>
 
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'name') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('name');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_identity} {renderSortIndicator('name', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'role') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('role');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_privileges} {renderSortIndicator('role', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'level') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('level');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_progress} {renderSortIndicator('level', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none" onClick={() => {
                if (userSortField === 'isBlocked') {
                  setUserSortDir(userSortDir === 'asc' ? 'desc' : 'asc');
                } else {
                  setUserSortField('isBlocked');
                  setUserSortDir('asc');
                }
              }}>
                {t.col_status} {renderSortIndicator('isBlocked', userSortField, userSortDir)}
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">{t.col_access}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sortedUsers.map((user) => (
              <tr key={user.id} className={`group transition-colors ${user.isBlocked ? 'bg-red-500/5' : 'hover:bg-slate-800/30'}`} data-testid={`user-row-${user.id}`}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${user.isBlocked ? 'text-red-400' : 'text-foreground'}`} data-testid={`user-name-${user.id}`}>{user.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-600 font-medium">{user.email}</p>
                        <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.preferredLang || 'EN'}</span>
                        <span className="text-[8px] bg-slate-800/60 text-slate-400 border border-slate-700/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">{user.readingMode || 'default'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button 
                    onClick={() => setConfirmingAction({ type: 'role', userId: user.id, extra: user.role === 'admin' ? 'student' : 'admin' })}
                    className="flex items-center gap-2"
                   >
                     {user.role === 'admin' ? (
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-500/20">
                         <ShieldCheck className="w-3 h-3" /> {t.admin_role}
                       </span>
                     ) : (
                       <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">{t.student_role}</span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-black text-slate-300">
                      {(() => {
                        const totalMins = Math.round(user.kp / 10);
                        const hrs = Math.floor(totalMins / 60);
                        const mins = totalMins % 60;
                        return `${hrs}h ${mins}m`;
                      })()}
                    </p>
                    <p className="text-[10px] text-slate-600 font-bold">{user.kp.toLocaleString()} KP</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button 
                    onClick={async () => {
                      await dbService.toggleBlockUser(user.id);
                      loadUsers();
                    }}
                    className="flex items-center gap-2 outline-none cursor-pointer block-user-toggle"
                    data-testid={`block-btn-${user.id}`}
                    title={user.isBlocked 
                      ? (lang === 'FR' ? "Cliquer pour activer" : lang === 'ES' ? "Haga clic para activar" : lang === 'DE' ? "Klicken Sie zum Aktivieren" : lang === 'ZH' ? "点击启用账号" : "Click to Activate") 
                      : (lang === 'FR' ? "Cliquer pour bloquer" : lang === 'ES' ? "Haga clic para bloquear" : lang === 'DE' ? "Klicken Sie zum Blockieren" : lang === 'ZH' ? "点击封禁账号" : "Click to Block")}
                   >
                     {user.isBlocked ? (
                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-red-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Ban className="w-3 h-3" /> {t.status_blocked}
                        </span>
                     ) : (
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-emerald-500/20 transition-colors" data-testid={`status-label-${user.id}`}>
                          <Check className="w-3 h-3" /> {t.status_active}
                        </span>
                     )}
                   </button>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                     <button 
                      onClick={() => setConfirmingAction({ type: 'delete', userId: user.id })}
                      className="p-2 rounded-xl bg-slate-800 text-slate-500 hover:text-white hover:bg-red-650 transition-all delete-user-btn cursor-pointer"
                      data-testid={`delete-btn-${user.id}`}
                      title={lang === 'FR' ? "Supprimer l'utilisateur" : lang === 'ES' ? "Eliminar usuario" : lang === 'DE' ? "Benutzer löschen" : lang === 'ZH' ? "删除用户账号" : "Delete User"}
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {confirmingAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmingAction(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black mb-2 text-center text-white">{t.confirm_title}</h3>
              <p className="text-slate-500 text-center text-xs mb-8">
                {t.confirm_msg}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setConfirmingAction(null)} className="py-4 rounded-2xl bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest cursor-pointer">{t.cancel}</button>
                <button onClick={handleAction} id="confirm-execute-btn" className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">{t.execute}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* ADD STUDENT MODAL */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddUserOpen(false)} className="absolute inset-0 bg-slate-955/75 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">{t.add_title}</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
 
              <form onSubmit={handleCreateUser} className="space-y-6">
                {newUserError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{newUserError}</span>
                  </div>
                )}
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.full_name} <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text"
                    id="student-name-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jean Dupont"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-semibold"
                  />
                </div>
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.email_address} <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="email"
                    id="student-email-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jean.dupont@openprimer.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                  />
                </div>
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.password} <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      required
                      type={showNewPassword ? 'text' : 'password'}
                      id="student-password-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-16 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest outline-none focus:outline-none cursor-pointer"
                    >
                      {showNewPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
 
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.system_role}</label>
                  <select 
                    id="student-role-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                  >
                    <option value="student" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>{t.student_opt}</option>
                    <option value="admin" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>{t.admin_opt}</option>
                  </select>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.lang_pref}</label>
                    <select 
                      id="student-lang-select"
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="EN" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇺🇸 English (EN)</option>
                      <option value="FR" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇫🇷 Français (FR)</option>
                      <option value="ES" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇪🇸 Español (ES)</option>
                      <option value="DE" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇩🇪 Deutsch (DE)</option>
                      <option value="ZH" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>🇨🇳 中文 (ZH)</option>
                    </select>
                  </div>
 
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-3">{t.visual_theme}</label>
                    <select 
                      id="student-theme-select"
                      value={newReadingMode}
                      onChange={(e) => setNewReadingMode(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all font-bold cursor-pointer"
                    >
                      <option value="default" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>{t.theme_default}</option>
                      <option value="paper" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>{t.theme_paper}</option>
                      <option value="focus" style={{ backgroundColor: '#090d16', color: '#ffffff' }}>{t.theme_focus}</option>
                    </select>
                  </div>
                </div>
 
                <button 
                  type="submit"
                  id="submit-student-btn"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/10 cursor-pointer active:scale-95 transition-all mt-4"
                >
                  {t.create_profile}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
