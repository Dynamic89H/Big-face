import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { STRINGS, LANGS, type Lang, type StringKey } from './strings';

export { LANGS };
export type { Lang };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => undefined, t: (k) => STRINGS.en[k] });

function detect(): Lang {
  try {
    const saved = localStorage.getItem('bigface-lang') as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) return saved;
    const nav = navigator.language.slice(0, 2);
    if (nav === 'es' || nav === 'fr' || nav === 'pt') return nav;
  } catch {
    /* ignore */
  }
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('bigface-lang', l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: StringKey) => STRINGS[lang][key] ?? STRINGS.en[key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
