import type { TranslationLanguage } from "./server/modules/dict/type/model";

export const TranslationLanguageFullname: Record<TranslationLanguage, string> = {
    en: "English",
    th: "ไทย"
} as const;
export type TranslationLanguageFullname = typeof TranslationLanguageFullname[keyof typeof TranslationLanguageFullname];