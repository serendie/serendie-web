import { ui } from "./ui";

export type Language = keyof typeof ui;
export type TranslationKey = keyof (typeof ui)[Language];

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Language;
  return "ja";
}

export function useTranslations(lang: Language) {
  return function t(key: TranslationKey): string {
    return ui[lang][key] || ui["ja"][key];
  };
}
