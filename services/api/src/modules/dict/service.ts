import type { IpadicFeatures } from "kuromoji";
import * as utils from "./util.js"; 
import { TranslationLanguage, type Entry, type TokenFeatures } from "./type/model.js";
import type { FtSearchResult } from "src/core/redisstack/type.js";
import type { AzureTranslationRequest, VoiceRouteResponse } from "./type/dto.js";
import * as repository from "./repository.js";
import type { AzureTTSVoiceName } from "./type/azureTTS.js";
import type { InternalError } from "src/errors/internalError.js";

const tokenizer = await utils.initializeTokenizer();
let reservedAccessToken: string = '';

async function processTokenization(paramQuery: string)
: Promise<Array<TokenFeatures>> 
{
    const tokens = tokenizer.tokenize(paramQuery);

    for(const token of tokens) {
        (token as TokenFeatures).isUseful = utils.isUsefulToken(token);
    }

    return tokens as Array<TokenFeatures>;
}

async function processQuickTranslation(paramQuery: string, paramTranslation: TranslationLanguage)
: Promise<string> 
{
    try {
        return (await utils.sendToAzureTranslator(
            paramTranslation, 
            [ { text: paramQuery } ]
        ))[0]?.translations[0]?.text ?? "";
    }
    catch(err) { console.warn("Azure translation failed, skipping", err); }
    
    return "";
}


/**
 * @note This function **mutates the input *searchResult* object directly**.
 * @param paramTranslation ISO639-1 codes ("en", "ja", "th", etc...)
 * @param searchResult result from searching with FT.SEARCH in RediSEARCH, **this param will get mutated**
 * @sideeffect mutates **searchResult**
 * @returns {void}
 */
// NOTE: check country-two char code or whatever it called is a great idea
async function processRedisResultTranslation(
    paramTranslation: TranslationLanguage, 
    searchResult: FtSearchResult<Entry>
): Promise<void> 
{
    if( // en don't need to be translate
        (searchResult.documents.length > 0) &&
        (paramTranslation === TranslationLanguage.Thai)
    ) {
        const translationTexts: Array<AzureTranslationRequest> = [];

        for(const document of searchResult.documents) {
            for (const sense of document.value.sense ?? []) {
                for (const gloss of sense.gloss ?? []) {
                    for (const text of gloss.text ?? []) {
                        translationTexts.push({ text: text });
                    }
                }
            }
        }

        try {
            const translationResult = await utils.sendToAzureTranslator(paramTranslation, translationTexts);

            let j = 0;
            for(const document of searchResult.documents) {
                for (const sense of document.value.sense ?? []) {
                    for (const gloss of sense.gloss ?? []) {
                        gloss.lang = paramTranslation;
                        for (let i = 0; i < gloss.text.length; ++i) {
                            gloss.text[i] = translationResult[j++]!.translations[0]!.text;
                        }
                    }
                }
            }
        }
        catch(err) { console.warn("Azure translation failed, skipping", err); }

        return;
    }
}


// NOTE: a bit of condition race for accesstoken, not really breaking
async function processVoiceGeneration(
    sentence: string, 
    paramReading: string,
    paramVoicename: AzureTTSVoiceName
): Promise<VoiceRouteResponse>
{
    let accesstoken: string = "";
    let isRedisAvailable: boolean = true;

    try {
        accesstoken = await repository.getAzureTTSAccessToken() ?? '';
    }
    catch(err) {
        console.error("Cannot connect to Redis, skipping global access token")
        isRedisAvailable = false;
        accesstoken = reservedAccessToken;
    }

    const katakanaReading = utils.convertToKatakana(paramReading)


    let voiceBuffer: ArrayBuffer;
    try {
        voiceBuffer = await utils.sendToAzureTextToSpeech(accesstoken, sentence, katakanaReading, paramVoicename)
    }
    catch(err) {
        // failed because accessToken expired -> retry with new token
        if((err as InternalError)?.status === 401) {
            accesstoken = await utils.fetchNewAzureTTSAccessToken();
            // if redis available store in Redis, else store in this server memory 
            if(isRedisAvailable) {
                repository.setAzureTTSAccessToken(accesstoken); // not await!!!
            }
            else {
                reservedAccessToken = accesstoken;
            }

            voiceBuffer = await utils.sendToAzureTextToSpeech(accesstoken, sentence, katakanaReading, paramVoicename)
        }
        else {
            throw err;
        }
    }

    return voiceBuffer;
}


export {
    processTokenization,
    processRedisResultTranslation,
    processQuickTranslation,
    processVoiceGeneration
}