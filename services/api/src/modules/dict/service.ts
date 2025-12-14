import type { IpadicFeatures } from "kuromoji";
import * as utils from "./utils.js"; 
import { TranslationLanguage, WordType, type Entry } from "./type.js";
import type { FtSearchResult } from "src/core/redisstack/type.js";
import type { AzureTranslationRequest } from "./apiType.js";

const tokenizer = await utils.initializeTokenizer();

function tokenize(text: string): IpadicFeatures[] {
    return tokenizer.tokenize(text);
}

/**
 * @note This function **mutates the input *searchResult* object directly**. Do not call on copies if you expect immutability.
 * @param toLang ISO639-1 codes ("en", "ja", "th", etc...)
 * @param searchResult result from searching with FT.SEARCH in RediSEARCH, **this param will get mutated**
 * @returns {void}
 */
// NOTE: check country-two char code or whatever it called is a great idea
async function transformRedisResult(toLang: TranslationLanguage, searchResult: FtSearchResult<Entry>)
: Promise<void> 
{
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

    const translationResult = await utils.sendToAzureTranslator(toLang, translationTexts);

    let j = 0;  // <-- post-increment
    for(const document of searchResult.documents) {
        for (const sense of document.value.sense ?? []) {
            for (const gloss of sense.gloss ?? []) {
                gloss.lang = toLang;
                for (let i = 0; i < gloss.text.length; ++i) {
                    gloss.text[i] = translationResult[j++]!.translations[0]!.text;
                }
            }
        }
    }

    return;
}


export {
    tokenize,
    transformRedisResult
}