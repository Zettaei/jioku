import type { IpadicFeatures } from "kuromoji";
import * as utils from "./util.js"; 
import { TranslationLanguage, type Entry, type TokenFeatures } from "./type/model.js";
import type { FtSearchResult } from "src/core/redisstack/type.js";
import type { AzureTranslationRequest, VoiceRouteResponse } from "./type/dto.js";

const tokenizer = await utils.initializeTokenizer();

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


async function processVoiceGeneration(
    paramSentence: string, 
    voicename: string
): Promise<VoiceRouteResponse>
{
    const voice = await 
    // TODO:
}


export {
    processTokenization,
    processRedisResultTranslation,
    processQuickTranslation
}