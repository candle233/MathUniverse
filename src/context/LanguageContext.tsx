'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, TranslationDict } from '@/i18n/types';
import { zh } from '@/i18n/locales/zh';
import { en } from '@/i18n/locales/en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  isZh: boolean;
  isEn: boolean;
}

const STORAGE_LOCALE_KEY = 'mathuniverse:user-locale';

const dictionaries: Record<Locale, TranslationDict> = {
  zh,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');

  useEffect(() => {
    // 1. Check localStorage first
    try {
      const stored = window.localStorage.getItem(STORAGE_LOCALE_KEY) as Locale | null;
      if (stored === 'zh' || stored === 'en') {
        setLocaleState(stored);
        document.documentElement.lang = stored === 'zh' ? 'zh-CN' : 'en';
        return;
      }
      // 2. Check browser default language
      const navLang = navigator.language || '';
      if (navLang.startsWith('en')) {
        setLocaleState('en');
        document.documentElement.lang = 'en';
      } else {
        setLocaleState('zh');
        document.documentElement.lang = 'zh-CN';
      }
    } catch {
      setLocaleState('zh');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      window.localStorage.setItem(STORAGE_LOCALE_KEY, newLocale);
      document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en';
      window.dispatchEvent(new Event('mathuniverse:locale-changed'));
    } catch (err) {
      console.warn('Failed to save locale to localStorage', err);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  // Helper to resolve nested keys like "hero.title" or "nav.graph"
  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    const dict = dictionaries[locale] || dictionaries.zh;
    const fallbackDict = dictionaries.zh;

    let result: any = dict;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    // Fallback to Chinese dictionary if key is missing in target locale
    if (result === undefined) {
      let fallbackResult: any = fallbackDict;
      for (const k of keys) {
        if (fallbackResult && typeof fallbackResult === 'object' && k in fallbackResult) {
          fallbackResult = fallbackResult[k];
        } else {
          fallbackResult = path;
          break;
        }
      }
      result = fallbackResult;
    }

    if (typeof result !== 'string') {
      return path;
    }

    // Param interpolation: {count}, {name}
    if (params) {
      return result.replace(/\{(\w+)\}/g, (_, match) => {
        return match in params ? String(params[match]) : `{${match}}`;
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        isZh: locale === 'zh',
        isEn: locale === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe fallback for SSR or unit tests
    return {
      locale: 'zh',
      setLocale: () => {},
      toggleLocale: () => {},
      t: (path: string) => path,
      isZh: true,
      isEn: false,
    };
  }
  return context;
}
