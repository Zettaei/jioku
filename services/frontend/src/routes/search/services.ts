import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
import { ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { EntriesRouteResponse, TokensRouteResponse, VoiceRouteResponse } from "$lib/types/server/modules/dict/type/dto";
import { AzureTTSVoiceName } from "$lib/types/server/modules/dict/type/azureTTS";


export function getDefaultSelectedWord(tokens: TokensRouteResponse)
: string 
{
    const tmpDefault = tokens?.tokens[0];
      if (!tmpDefault) return "";

      return tmpDefault.basic_form !== '*' ? tmpDefault.basic_form : tmpDefault.surface_form;
}

export async function fetchTokens(text: string = "", translationLang: TranslationLanguage)
: Promise<TokensRouteResponse> 
{
    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/dict/tokens/${encodeURI(text)}?translation=${encodeURI(translationLang)}`,
            // {
            //     credentials: "include",
            // }
        )

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json() as TokensRouteResponse;

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function fetchSearchWords(word: string = "", translationLang: TranslationLanguage, page: number = 1, limit: number = 10)
: Promise<EntriesRouteResponse> 
{
    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/dict/entries/${encodeURI(word)}?translation=${encodeURI(translationLang)}&page=${page}&limit=${limit}`
        );

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json() as EntriesRouteResponse;

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function fetchTokensOCR(image: File, translationLang: TranslationLanguage)
: Promise<TokensRouteResponse> 
{
    const form = new FormData();
    form.set("file", image);

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/dict/tokens/ocr?translation=${translationLang}`,
            {
                method: "POST",
                body: form
            }
        )

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json() as TokensRouteResponse;

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function fetchVoice(text: string = "", reading: string | undefined)
: Promise<VoiceRouteResponse> 
{
    const readingParam = reading ? `?reading=${reading}` : '';
    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/dict/voice/${text}${readingParam}`,
            {
                method: "GET",
            }
        )

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.arrayBuffer();

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}

export async function playVoice(AudioContext: AudioContext, decodeAudioBuffer: AudioBuffer) {
    const source = AudioContext.createBufferSource();
    source.buffer = decodeAudioBuffer;
    source.connect(AudioContext.destination);

    source.start(0)
}