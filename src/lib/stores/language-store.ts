import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLanguage } from '@/lib/translations';

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-store',
    }
  )
); 