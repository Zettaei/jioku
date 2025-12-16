import kuromoji, { type IpadicFeatures, type Tokenizer } from "kuromoji"
import path from "path";
import { TranslationLanguage, WordType } from "./type/model.js";
import { isJapanese, isKana } from "wanakana";
import type { AzureTranslationErrorResponse, AzureTranslationOKResponse, AzureTranslationRequest } from "./type/dto.js";
import { InternalError } from "src/core/errors/internalError.js";
import { ENV_VARS } from "src/config.js";
import { BadRequestError } from "src/core/errors/httpError.js";

const DICT_PATH = path.join("node_modules", "kuromoji", "dict");

async function initializeTokenizer()
: Promise<Tokenizer<IpadicFeatures>> 
{
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: DICT_PATH }).build(function (err, tokenizer) {
            if(err) return reject(err);
            resolve(tokenizer);
        });
    });
}

function isUsefulToken(token: IpadicFeatures)
: boolean 
{
    switch (token.pos) {
        case "助詞":    // particle
        case "助動詞":  // particle
        case "記号":    // symbol (brackets, parenthesis, etc...)
            return false;

        case "名詞":    // Noun
            // if (token.pos_detail_1 === "非自立") {   // dependant nouns (もの、こと)
            //     return false;
            // }
            return true;

        default:
            return true;
    }
}

function getWordType(word: string)
: WordType 
{    
    let wordType: WordType;
    if(isJapanese(word)) {
        if(isKana(word)) {
            wordType = WordType.kana
        }
        else {
            wordType = WordType.kanji
        }
    } 
    else {
        wordType = WordType.meaning
    }

    return wordType;
}

/**
 * @param toLang ISO639-1 codes ("en", "ja", "th", etc...)
 * @param payload The Object that will be send to Azure Translator
 * @returns {void}
 */
// NOTE: check country-two char code or whatever it called is a great idea
async function sendToAzureTranslator(toLang: TranslationLanguage, payload: Array<AzureTranslationRequest>)
: Promise<Array<AzureTranslationOKResponse>> 
{
    const VERSION: string = "api-version=3.0";
    const PARAMS: string = '&' + "to="+toLang;
    const response = await fetch(`${ENV_VARS.AZURE_TRANSLATOR_URL.value}/translate?${VERSION}${PARAMS}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": ENV_VARS.AZURE_TRANSLATOR_KEY.value,
            "Ocp-Apim-Subscription-Region": ENV_VARS.AZURE_TRANSLATOR_REGION.value,
        },
        body: JSON.stringify(payload)
    });
    

    const body = await response.json();
    if(!response.ok) {
        const err = (body as AzureTranslationErrorResponse).error
        throw new InternalError(
            "Failed request from Azure Translator code: " + err.code, 
            err.message, 
            {
                status: response.status,
                headers: response.headers
            }
        );
    }
    const data = body as Array<AzureTranslationOKResponse>;
    return data;
}

function validateTranslationLanguage(translationLang: string | undefined)
: asserts translationLang is TranslationLanguage 
{
    if(translationLang !== TranslationLanguage.English && translationLang !== TranslationLanguage.Thai) {
        throw new BadRequestError("Unsupported translation language");
    }
}

function validateQuery(paramQuery: string | undefined)
: asserts paramQuery is string 
{
    // vv Accept only Unicode char and normal spacebar, probably
    if(!/^[\p{L}\p{N}\s_'-]+$/u.test(paramQuery ?? "")) {
        throw new BadRequestError("Incorrect character detected");
    }
}


export {
    initializeTokenizer,
    isUsefulToken,
    getWordType,
    sendToAzureTranslator,
    validateTranslationLanguage,
    validateQuery
}