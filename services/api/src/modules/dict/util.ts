import kuromoji, { type IpadicFeatures, type Tokenizer } from "kuromoji"
import path from "path";
import { TranslationLanguage, WordType } from "./type/model.js";
import { isJapanese, isKana } from "wanakana";
import type { AzureTranslationErrorResponse, AzureTranslationOKResponse, AzureTranslationRequest, AzureTTSAccessTokenErrorRespone, AzureTTSRequestOKResponse } from "./type/dto.js";
import { InternalError } from "src/core/errors/internalError.js";
import { DICT_OPTIONS, ENV_VARS } from "src/config.js";
import { BadRequestError, UnauthorizedError } from "src/core/errors/httpError.js";
import { AzureTTSVoiceName } from "./type/azureTTS.js";

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


async function sendToAzureTextToSpeech(accesstoken: string, sentence: string, voicename: AzureTTSVoiceName) 
: Promise<ArrayBuffer>
{
    // !!! vvv if this get updated be sure to update Content-Type in response of route.ts as well
    const AZURE_VOICE_OUTPUT_FORMAT = "ogg-24khz-16bit-mono-opus"

    const body = 
    `<speak version='1.0' xml:lang='ja-JP'>
        <voice xml:lang='ja-JP' name='${voicename}'>
            ${sentence}
        </voice>
    </speak>`;

    const response = await fetch(`${ENV_VARS.AZURE_TTS_URL.value}`,{
        method: "POST",
        headers: {
            "X-Microsoft-OutputFormat": AZURE_VOICE_OUTPUT_FORMAT,
            "Content-Type": "application/ssml+xml; charset=utf-8",
            "Authorization": `Bearer ${accesstoken}`
        },
        body: body
    });


    if(!response.ok) {
        if(response.status === 401) {
            throw new UnauthorizedError("Invalid or Missing Access Token");
        }

        throw new InternalError(
            "Failed request from Azure Speech Services code: " + response.status, 
            response.statusText, 
            {
                status: response.status,
                headers: response.headers
            }
        );
    }

    const data = await response.arrayBuffer();
    return data;
}


async function fetchNewAzureTTSAccessToken()
: Promise<string> {

    const response = await fetch(`${ENV_VARS.AZURE_TTS_TOKEN_URL.value}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Ocp-Apim-Subscription-Key": ENV_VARS.AZURE_TTS_KEY.value,
        }
    });

    if(!response.ok) {
        throw new InternalError(
            "Failed request from Azure Speech Services code: " + response.status, 
            response.statusText, 
            {
                status: response.status,
                headers: response.headers
            }
        );
    }

    const data = (await response.text()).trim();
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

function validateVoicename(voicename: string | undefined)
: asserts voicename is AzureTTSVoiceName 
{
    if(!voicename || !Object.values<string>(AzureTTSVoiceName).includes(voicename)) {
        throw new BadRequestError("Incorrect voice name");
    }  
}


export {
    initializeTokenizer,
    isUsefulToken,
    getWordType,
    sendToAzureTranslator,
    fetchNewAzureTTSAccessToken,
    sendToAzureTextToSpeech,
    validateTranslationLanguage,
    validateQuery,
    validateVoicename
}