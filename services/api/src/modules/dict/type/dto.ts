// Types for Request and Response in route.ts
import type { IpadicFeatures } from "kuromoji";
import type { FtSearchResult } from "core/redisstack/index.js";
import type { Entry, TokenFeatures, TranslationLanguage } from "./model.js";
import * as Ocr from "modules/ocr/index.js";


////////////////////////////////////////////// TOKENS
export type TokensRouteHandlerQuery = {
    translation: TranslationLanguage | undefined;
}

export interface TokensRouteHandler {
    param: string | undefined;
    query: TokensRouteHandlerQuery;
}

export interface TokensRouteResponse {
    param: string;
    quickTranslation: {
        text: string,
        language: TranslationLanguage
    } 
    tokens: Array<TokenFeatures>;
}


////////////////////////////////////////////// TOKENS-OCR
export interface TokensOcrRouteHandler {
    tokens: { 
        query: TokensRouteHandlerQuery
    };
    ocr: Ocr.dto.OcrRouteHandler;
}


////////////////////////////////////////////// ENTRIES
export type EntriesRouteHandlerQuery = {
    translation: TranslationLanguage | undefined;
}
export interface EntriesRouteHandler {
    param: string | undefined;
    query: EntriesRouteHandlerQuery;
}

export interface EntriesRouteResponse {
    param: string;
    language: TranslationLanguage;
    result: FtSearchResult<Entry>;
}


////////////////////////////////////////////// AZURE TRANSLATOR
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