// Types for Request and Response in route.ts
import type { IpadicFeatures } from "kuromoji";
import type { FtSearchResult } from "core/redisstack/index.js";
import type { Entry, TokenFeatures, TranslationLanguage } from "./model.js";
import * as Ocr from "modules/ocr/index.js";
import type { PaginatedResponse } from "modules/deck/type/dto.js";
import type { AzureTTSVoiceName, AzureTTSVoiceNameEN } from "./azureTTS.js";


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
    page?: number;
    limit?: number;
}
export interface EntriesRouteHandler {
    param: string | undefined;
    query: EntriesRouteHandlerQuery;
}

export interface EntriesRouteResponse 
extends PaginatedResponse<Entry> {
    param: string;
    language: TranslationLanguage;
    total: number;
}

////////////////////////////////////////////// VOICES
export type VoiceRouteHandlerQuery = {
    voicename: AzureTTSVoiceName
}

export interface VoiceRouteHandler {
    sentence: string
    query: VoiceRouteHandlerQuery
}

export interface VoiceRouteResponse {

}






// AZURE
export interface AzureErrorResponse {
    error: {
        code: number,
        message: string
    }
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

export interface AzureTranslationErrorResponse 
extends AzureErrorResponse 
{}

////////////////////////////////////////////// AZURE TEXT TO SPEECH
export type AzureTTSRequest = { text: string, voicename: string };

export interface AzureTTSRequestOKResponse {

};

export interface AzureTTSAccessTokenErrorRespone
extends AzureErrorResponse 
{};

export interface AzureTTSRequestErrorResponse
extends AzureErrorResponse
{};