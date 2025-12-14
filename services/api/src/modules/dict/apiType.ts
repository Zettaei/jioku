// Types for Request and Response in route.ts
import type { IpadicFeatures } from "kuromoji";
import type { FtSearchResult } from "core/redisstack/index.js";
import type { Entry, TranslationLanguage } from "./type.js";


export interface TokensRouteResponse {
    query: string;
    queryTranslation: TranslationLanguage;
    quickTranslation: string;
    tokens: Array<IpadicFeatures>;
}

export interface EntriesRouteResponse {
    query: string;
    queryTranslation: TranslationLanguage;
    result: FtSearchResult<Entry>;
}

export type AzureTranslationRequest = { text: string };

export interface AzureTranslationOKResponse {
    // detectedLanguage: {    
    //     language: string,
    //     score: number
    // },
    translations: Array<{
        text: string;
        to: string;
    }>
}

export interface AzureTranslationErrorResponse {
    error: {
        code: number,
        message: string
    }
}