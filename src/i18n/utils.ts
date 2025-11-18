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

/**
 * 言語を束縛したロケール付きパス生成関数を返す
 * 例: const localePath = useLocalePath(lang); localePath("about") -> "/en/about"
 */
export function useLocalePath(lang: Language) {
  return function localePath(path: string): string {
    return getLocalePath(lang, path);
  };
}

/**
 * 言語に合わせて日付文字列をフォーマットする
 * @param date ISO形式などDateが解釈できる文字列
 * @param lang 言語
 */
export function formatDateByLang(date: string, lang: Language) {
  return new Date(date).toLocaleDateString(lang === "en" ? "en-US" : "ja-JP");
}

/**
 * 現在の言語を維持したURLを生成
 * @param lang 言語
 * @param path パス（先頭のスラッシュなし）例: "about", "components/button"
 * @returns ロケールを含むパス 例: "/about", "/en/about"
 */
function getLocalePath(lang: Language, path: string): string {
  // パスの先頭のスラッシュを削除
  const cleanPath = path.replace(/^\//, "");

  if (lang === "ja") {
    // 日本語はプレフィックスなし
    // 空文字列の場合はトップページ
    return cleanPath === "" ? "/" : `/${cleanPath}`;
  }

  // その他の言語はプレフィックスあり
  // 空文字列の場合は /en などの言語トップページ
  return cleanPath === "" ? `/${lang}` : `/${lang}/${cleanPath}`;
}
