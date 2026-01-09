import type { IpadicFeatures } from "kuromoji";

export type EntryScoreType = "kanji_score" | "reading_score" | "ent_score";
export type EntryIndexType = "kanji" | "reading" | "meaning";

export interface Entry 
{
    ent_seq: string;
    k_ele: Array<{
        keb: string;
        score: number;
        ke_inf: Array<string> | undefined;
        ke_pri: Array<string> | undefined;
    }>;
    r_ele: Array<{
        reb: string;
        score: number;
        re_pri: Array<string> | undefined;
    }>;
    sense: Array<{
        pos: Array<string>;
        gloss: Array<{
            lang: string;
            text: Array<string>;
        }>;
    }>;
    ent_score: number;
}

export type TokenFeatures = IpadicFeatures & { isUseful: boolean };

/**
 * @note just language that currently supported by this project, **not necessarily mean it can't only use these**
 */
export const TranslationLanguage = { English: "en", Thai: "th" } as const;
export type TranslationLanguage = typeof TranslationLanguage[keyof typeof TranslationLanguage];

// avoid enums in typescript
export const WordType = { kanji: 0, kana: 1, meaning: 2 } as const;
export type WordType = typeof WordType[keyof typeof WordType];
