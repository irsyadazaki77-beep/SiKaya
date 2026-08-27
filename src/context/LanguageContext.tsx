import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en' | 'ja' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.simulation': 'Simulasi Investasi',
    'nav.life_simulation': 'Simulasi Hidup',
    'nav.modules': 'Modul Belajar',
    'nav.advisor': 'Chatbot Advisor',
    'nav.faq': 'Tanya Jawab',
    'nav.login': 'Masuk Kelas',
    'nav.start': 'Mulai Belajar',
    'nav.search_placeholder': 'Cari materi/kamus...',
    'nav.search_mobile_placeholder': 'Cari kamus / modul belajar...',
    'nav.banner': '✨ PLATFORM EDUKASI FINANSIAL & SIMULASI INVESTASI #1 UNTUK GEN Z INDONESIA',
    'nav.class': 'KELAS',
    'nav.exit': 'Keluar Kelas',
    'nav.settings_account': 'PENGATURAN & AKUN',
    'nav.dark_mode': 'Mode Gelap (Dark Mode)',
    'nav.active': 'AKTIF',
    'nav.inactive': 'NONAKTIF',
    'nav.my_learning_room': 'Ruang Belajar Saya',
    'nav.main_menu': 'MENU UTAMA',
    'nav.language': 'Bahasa',

    // Common/Home
    'home.hero_badge': '✨ Belajar Finansial Tanpa Takut Rugi',
    'home.hero_title': 'Melek Finansial Sejak Dini,',
    'home.hero_title_highlight': 'Siap Hadapi Masa Depan',
    'home.hero_desc': 'Platform edukasi interaktif terbaik untuk Gen Z belajar mengelola uang, memahami risiko pasar, dan merancang finansial mandiri melalui modul seru dan simulasi interaktif tanpa modal sepeser pun.',
    'home.cta_simulation': 'Coba Simulasi',
    'home.cta_modules': 'Materi Pembelajaran',
    'home.trust_banner': 'MENGGUNAKAN REFERENSI DATA PUBLIK DARI LEMBAGA TERPERCAYA',
    'home.stat.users': 'PENGGUNA AKTIF',
    'home.stat.topics': 'TOPIK FINANSIAL',
    'home.stat.rating': 'KEPUASAN GEN-Z',
    'home.stat.access': 'GRATIS DIAKSES',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.simulation': 'Investment Sim',
    'nav.life_simulation': 'Life Sim',
    'nav.modules': 'Learning Modules',
    'nav.advisor': 'Chatbot Advisor',
    'nav.faq': 'FAQ',
    'nav.login': 'Login',
    'nav.start': 'Start Learning',
    'nav.search_placeholder': 'Search materials/glossary...',
    'nav.search_mobile_placeholder': 'Search glossary / learning modules...',
    'nav.banner': '✨ #1 FINANCIAL EDUCATION & INVESTMENT SIMULATION PLATFORM FOR INDONESIAN GEN Z',
    'nav.class': 'CLASS',
    'nav.exit': 'Logout',
    'nav.settings_account': 'SETTINGS & ACCOUNT',
    'nav.dark_mode': 'Dark Mode',
    'nav.active': 'ACTIVE',
    'nav.inactive': 'INACTIVE',
    'nav.my_learning_room': 'My Learning Room',
    'nav.main_menu': 'MAIN MENU',
    'nav.language': 'Language',

    // Common/Home
    'home.hero_badge': '✨ Learn Finance without Fear of Loss',
    'home.hero_title': 'Financial Literacy from an Early Age,',
    'home.hero_title_highlight': 'Ready to Face the Future',
    'home.hero_desc': 'The best interactive education platform for Gen Z to learn money management, understand market risk, and plan financial independence with exciting modules and interactive simulations with zero risk.',
    'home.cta_simulation': 'Try Simulation',
    'home.cta_modules': 'Learning Modules',
    'home.trust_banner': 'USING PUBLIC DATA REFERENCES FROM TRUSTED INSTITUTIONS',
    'home.stat.users': 'ACTIVE USERS',
    'home.stat.topics': 'FINANCIAL TOPICS',
    'home.stat.rating': 'GEN-Z SATISFACTION',
    'home.stat.access': 'FREE TO ACCESS',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.simulation': '投資シミュレーション',
    'nav.life_simulation': 'ライフシミュレーション',
    'nav.modules': '学習モジュール',
    'nav.advisor': 'AIアドバイザー',
    'nav.faq': 'よくある質問',
    'nav.login': 'ログイン',
    'nav.start': '学習を始める',
    'nav.search_placeholder': '検索...',
    'nav.search_mobile_placeholder': '検索...',
    'nav.banner': '✨ Z世代向け金融教育＆投資シミュレーションプラットフォーム',
    'nav.class': 'クラス',
    'nav.exit': 'ログアウト',
    'nav.settings_account': '設定とアカウント',
    'nav.dark_mode': 'ダークモード',
    'nav.active': 'オン',
    'nav.inactive': 'オフ',
    'nav.my_learning_room': 'マイルーム',
    'nav.main_menu': 'メインメニュー',
    'nav.language': '言語',
    'home.hero_badge': '✨ リスクなしで金融を学ぶ',
    'home.hero_title': '早期からの金融リテラシー、',
    'home.hero_title_highlight': '未来に備える',
    'home.hero_desc': '若者が資金管理、市場リスクの理解、自立した資金計画を学ぶための最高のインタラクティブプラットフォームです。',
    'home.cta_simulation': 'シミュレーション',
    'home.cta_modules': '学習モジュール',
    'home.trust_banner': '信頼できる機関からの公開データ',
    'home.stat.users': 'アクティブユーザー',
    'home.stat.topics': '金融トピック',
    'home.stat.rating': 'ユーザー満足度',
    'home.stat.access': '無料アクセス',
  },
  zh: {
    'nav.home': '首页',
    'nav.simulation': '投资模拟',
    'nav.life_simulation': '生活模拟',
    'nav.modules': '学习模块',
    'nav.advisor': 'AI 顾问',
    'nav.faq': '常见问题',
    'nav.login': '登录',
    'nav.start': '开始学习',
    'nav.search_placeholder': '搜索...',
    'nav.search_mobile_placeholder': '搜索...',
    'nav.banner': '✨ 适合 Z 世代的金融教育与投资模拟平台',
    'nav.class': '班级',
    'nav.exit': '退出',
    'nav.settings_account': '设置和帐户',
    'nav.dark_mode': '深色模式',
    'nav.active': '开启',
    'nav.inactive': '关闭',
    'nav.my_learning_room': '我的学习室',
    'nav.main_menu': '主菜单',
    'nav.language': '语言',
    'home.hero_badge': '✨ 无风险学习金融',
    'home.hero_title': '早期金融素养，',
    'home.hero_title_highlight': '为未来做好准备',
    'home.hero_desc': '最好的互动教育平台，让年轻人学习理财，了解市场风险并无风险地规划财务独立。',
    'home.cta_simulation': '尝试模拟',
    'home.cta_modules': '学习模块',
    'home.trust_banner': '使用来自可信机构的公共数据',
    'home.stat.users': '活跃用户',
    'home.stat.topics': '金融主题',
    'home.stat.rating': '用户满意度',
    'home.stat.access': '免费使用',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'id') return saved;
    return 'id'; // default language
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
