import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // اللغات المدعومة
  locales: ['en', 'ar'],

  // اللغة الافتراضية
  defaultLocale: 'en',

  // دوماً نضيف البريفكس بالـ URL
  localePrefix: 'always',

  // تمكين اكتشاف اللغة تلقائياً من الكوكي أو الـ accept-language
  localeDetection: true,

  // كوكي لتذكر لغة المستخدم، مدة سنة
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365
  },

  // توليد روابط alternate تلقائياً للـ SEO
  alternateLinks: true
});
