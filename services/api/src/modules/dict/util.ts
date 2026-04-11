import kuromoji, { type IpadicFeatures, type Tokenizer } from "kuromoji"
import path from "path";
import { spawn } from "child_process";
import { existsSync } from "fs";
import ffmpegPath from "ffmpeg-static";
import { TranslationLanguage, WordType } from "./type/model.js";
import { isJapanese, isKana } from "wanakana";
import type { AzureTranslationErrorResponse, AzureTranslationOKResponse, AzureTranslationRequest, AzureTTSAccessTokenErrorRespone, AzureTTSRequestOKResponse, AzureSTTOKResponse } from "./type/dto.js";
import { InternalError } from "src/errors/internalError.js";
import { DICT_OPTIONS, ENV_VARS } from "src/config.js";
import { BadRequestError, UnauthorizedError } from "src/errors/httpError.js";
import { AzureTTSVoiceName } from "./type/azureTTS.js";;
import os from 'os';

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


async function sendToAzureTextToSpeech(accesstoken: string, sentence: string, reading: string, voicename: AzureTTSVoiceName) 
: Promise<ArrayBuffer>
{
    // !!! vvv if this get updated be sure to update Content-Type in response of route.ts as well
    const AZURE_VOICE_OUTPUT_FORMAT = "ogg-24khz-16bit-mono-opus"

    const item = reading !== '' ?
        `<phoneme alphabet="sapi" ph="${reading}">${sentence}</phoneme>`
        :
        sentence

    const body = 
    `<speak version='1.0' xml:lang='ja-JP'>
        <voice xml:lang='ja-JP' name='${voicename}'>
            ${item}
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


async function fetchNewAzureSpeechAccessToken()
: Promise<string>
{
    const response = await fetch(`${ENV_VARS.AZURE_SPEECH_TOKEN_URL.value}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Ocp-Apim-Subscription-Key": ENV_VARS.AZURE_SPEECH_KEY.value,
        }
    });

    if (!response.ok) {
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

/**
 * convert to katakana arithmetically
 * @note supposed to be use for sending reading to Azure Speech, but may as well use for other things.
 */
function convertToKatakana(text: string)
: string
{
    let result = "";

    for(let i = 0; i < text.length; ++i) {
        const code = text.charCodeAt(i);
        // 0x3041 = 'ぁ' (small あ) / 0x3096 = 'ゖ' (small け)　- ?????????
        if(code >= 0x3041 && code <= 0x3096) {
            // +96 (0x60) to make it katakana
            result += String.fromCharCode(code + 96);
        }
        else {
            result += text[i]
        }
    }

    return result;
}


async function convertAudioToWav(inputBuffer: Buffer)
: Promise<Buffer>
{
    return new Promise((resolve, reject) => {
        const staticPath = ffmpegPath as unknown as string | null;
        
        // Check if the static binary actually exists
        const useStatic = staticPath && existsSync(staticPath);
        const ffmpegBin = useStatic ? staticPath : "ffmpeg";

        const ffmpeg = spawn(ffmpegBin, [
            '-i', 'pipe:0',
            '-f', 'wav',
            '-ac', '1',
            '-ar', '16000',
            '-acodec', 'pcm_s16le',
            'pipe:1'
        ]);

        const chunks: Buffer[] = [];
        const errorChunks: Buffer[] = [];

        ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));
        
        ffmpeg.stderr.on('data', (chunk) => errorChunks.push(chunk));

        ffmpeg.on('error', (err) => {
            reject(new InternalError("Failed to start ffmpeg process", err.message));
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve(Buffer.concat(chunks));
            } else {
                const errorMsg = Buffer.concat(errorChunks).toString();
                reject(new InternalError(`ffmpeg exited with code ${code}: ${errorMsg}`));
            }
        });

        // Write buffer and handle potential pipe errors
        ffmpeg.stdin.on('error', (err) => {
            // Ignore EPIPE errors here, as the 'close' event will handle the failure
            if ((err as any).code !== 'EPIPE') console.error("stdin error", err);
        });

        ffmpeg.stdin.end(inputBuffer);
    });
}


async function sendToAzureSpeechToText(accesstoken: string, wavBuffer: Buffer, lang: "jp" | "en" = "en")
: Promise<string>
{
    const response = await fetch(`${ENV_VARS.AZURE_STT_URL.value}?language=${lang === "jp" ? "ja-JP" : "en-US"}`, {
        method: 'POST',
        headers: {
            "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
            "Authorization": `Bearer ${accesstoken}`
        },
        body: wavBuffer
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new UnauthorizedError("Invalid or Missing Access Token");
        }

        throw new InternalError(
            "Failed request from Azure Speech-to-Text code: " + response.status,
            response.statusText,
            {
                status: response.status,
                headers: response.headers
            }
        );
    }

    const data = await response.json() as AzureSTTOKResponse;
    return data.DisplayText ?? "";
}


export {
    initializeTokenizer,
    isUsefulToken,
    getWordType,
    sendToAzureTranslator,
    fetchNewAzureSpeechAccessToken,
    sendToAzureTextToSpeech,
    convertAudioToWav,
    sendToAzureSpeechToText,
    validateTranslationLanguage,
    validateQuery,
    validateVoicename,
    convertToKatakana
}