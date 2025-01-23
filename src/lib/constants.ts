export const SUPPORTED_LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'zh', name: 'Chinese', nativeName: '中文' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['id']; 