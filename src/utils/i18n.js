/**
 * i18n.js — English / Khmer translation module (no Context needed).
 *
 * Usage:
 *   import { t, useLang, setLang } from './i18n';
 *   const { lang, setLang, t } = useLang();   // inside React component
 *   t('save')                                  // outside component
 */
import { useState, useEffect } from 'react';

const LANG_KEY   = 'lms_lang';
const _listeners = new Set();
let   _lang      = localStorage.getItem(LANG_KEY) || 'en';

const TR = {
  en: {
    // ── Navigation ──────────────────────────────────────────────────────────
    home:          'Home',
    dashboard:     'Dashboard',
    accounts:      'Accounts',
    catalog:       'Catalog',
    reports:       'Reports',
    notifications: 'Notifications',
    settings:      'Settings',
    profile:       'Profile',
    logout:        'Log out',
    budget:        'Budget',
    fines:         'Fines',
    members:       'Members',
    books:         'Books',
    // ── Settings ─────────────────────────────────────────────────────────────
    appearance:     'Appearance',
    theme:          'Theme',
    light_mode:     'Light Mode',
    dark_mode:      'Dark Mode',
    system_default: 'System Default',
    language:       'Language',
    english:        'English',
    khmer:          'ភាសាខ្មែរ (Khmer)',
    preferences:    'Manage your personal preferences.',
    settings_saved: 'Settings saved.',
    // ── Profile ───────────────────────────────────────────────────────────────
    edit_profile:     'Edit Profile',
    full_name:        'Full Name',
    email:            'Email',
    phone:            'Phone Number',
    upload_photo:     'Upload Photo',
    change_photo:     'Change Photo',
    remove_photo:     'Remove Photo',
    change_password:  'Change Password',
    current_password: 'Current Password',
    new_password:     'New Password',
    confirm_password: 'Confirm New Password',
    save_changes:     'Save Changes',
    cancel:           'Cancel',
    // ── Common ────────────────────────────────────────────────────────────────
    save:    'Save',
    delete:  'Delete',
    edit:    'Edit',
    search:  'Search',
    create:  'Create',
    active:  'Active',
    suspended: 'Suspended',
    loading: 'Loading…',
    // ── Borrow ───────────────────────────────────────────────────────────────
    borrow:    'Borrow',
    return:    'Return',
    due_date:  'Due Date',
    borrowed:  'Borrowed',
    overdue:   'Overdue',
    returned:  'Returned',
    // ── Auth ─────────────────────────────────────────────────────────────────
    sign_in:     'Sign In',
    sign_up:     'Sign Up',
    forgot_pw:   'Forgot Password?',
    welcome_back:'Welcome back',
    // ── Account ──────────────────────────────────────────────────────────────
    role:    'Role',
    status:  'Status',
    created: 'Created',
    actions: 'Actions',
  },
  km: {
    // ── Navigation ──────────────────────────────────────────────────────────
    home:          'ទំព័រដើម',
    dashboard:     'ផ្ទាំងគ្រប់គ្រង',
    accounts:      'គណនី',
    catalog:       'បញ្ជីសៀវភៅ',
    reports:       'របាយការណ៍',
    notifications: 'ការជូនដំណឹង',
    settings:      'ការកំណត់',
    profile:       'ប្រវត្តិរូប',
    logout:        'ចាកចេញ',
    budget:        'ថវិកា',
    fines:         'ការផាកពិន័យ',
    members:       'សមាជិក',
    books:         'សៀវភៅ',
    // ── Settings ─────────────────────────────────────────────────────────────
    appearance:     'រូបរាង',
    theme:          'ការបង្ហាញ',
    light_mode:     'របៀបភ្លឺ',
    dark_mode:      'របៀបងងឹត',
    system_default: 'លំនាំដើមប្រព័ន្ធ',
    language:       'ភាសា',
    english:        'English',
    khmer:          'ភាសាខ្មែរ',
    preferences:    'គ្រប់គ្រងចំណង់ចំណូលចិត្តផ្ទាល់ខ្លួន។',
    settings_saved: 'ការកំណត់ត្រូវបានរក្សាទុក។',
    // ── Profile ───────────────────────────────────────────────────────────────
    edit_profile:     'កែប្រែប្រវត្តិរូប',
    full_name:        'ឈ្មោះពេញ',
    email:            'អ៊ីម៉ែល',
    phone:            'លេខទូរស័ព្ទ',
    upload_photo:     'បញ្ចូលរូបថត',
    change_photo:     'ផ្លាស់ប្ដូររូបថត',
    remove_photo:     'លុបរូបថត',
    change_password:  'ផ្លាស់ប្ដូរពាក្យសម្ងាត់',
    current_password: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
    new_password:     'ពាក្យសម្ងាត់ថ្មី',
    confirm_password: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី',
    save_changes:     'រក្សាទុកការផ្លាស់ប្ដូរ',
    cancel:           'បោះបង់',
    // ── Common ────────────────────────────────────────────────────────────────
    save:    'រក្សាទុក',
    delete:  'លុប',
    edit:    'កែប្រែ',
    search:  'ស្វែងរក',
    create:  'បង្កើត',
    active:  'សកម្ម',
    suspended: 'ផ្អាក',
    loading: 'កំពុងផ្ទុក…',
    // ── Borrow ───────────────────────────────────────────────────────────────
    borrow:   'ខ្ចី',
    return:   'ប្រគល់',
    due_date: 'ថ្ងៃកំណត់',
    borrowed: 'ខ្ចីហើយ',
    overdue:  'ហួសសម័យ',
    returned: 'បានប្រគល់',
    // ── Auth ─────────────────────────────────────────────────────────────────
    sign_in:      'ចូល',
    sign_up:      'ចុះឈ្មោះ',
    forgot_pw:    'ភ្លេចពាក្យសម្ងាត់?',
    welcome_back: 'សូមស្វាគមន៍មកវិញ',
    // ── Account ──────────────────────────────────────────────────────────────
    role:    'តួនាទី',
    status:  'ស្ថានភាព',
    created: 'បានបង្កើត',
    actions: 'សកម្មភាព',
  },
};

export function getLang()  { return _lang; }

export function setLang(lang) {
  _lang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.setAttribute('data-lang', lang);
  _listeners.forEach(fn => fn(lang));
}

// Apply on module load
document.documentElement.setAttribute('data-lang', _lang);

/** Translate a key using the current language. Falls back to English, then the key itself. */
export function t(key) {
  return TR[_lang]?.[key] ?? TR.en[key] ?? key;
}

/** React hook — component re-renders whenever the language changes. */
export function useLang() {
  const [lang, setLocal] = useState(_lang);
  useEffect(() => {
    const fn = l => setLocal(l);
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  }, []);
  return { lang, setLang, t };
}
