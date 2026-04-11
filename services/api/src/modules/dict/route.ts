import { Hono } from "hono";
import { string } from "core/utils/index.js";
import { TranslationLanguage } from "./type/model.js";
import { type TokensRouteResponse, type EntriesRouteResponse, type AzureTTSRequestOKResponse, type SpeechToTextRouteResponse } from "./type/dto.js";
import { entriesRouteHandler, tokensOcrRouteHandler, tokensSpeechToTextRouteHandler, tokensRouteHandler, voiceRouteHandler, speechToTextRouteHandler } from "./handler.js";
import { DICT_OPTIONS } from "src/config.js";

const routes = new Hono();


routes.get("/tokens/:param", async (c) => {
    const param = string.trimOrUndefined(c.req.param("param"));
    const queryTranslation = string.trimOrUndefined(c.req.query("translation")) as TranslationLanguage | undefined;

    const result = await tokensRouteHandler({
        param,
        query: {
            translation: queryTranslation
        }
    });

    return c.json<TokensRouteResponse>(result);
});


routes.post("/tokens/ocr", async (c) => {
    const queryTranslation = string.trimOrUndefined(c.req.query("translation")) as TranslationLanguage | undefined;
    const file = (await c.req.parseBody())["file"];
    const force = (c.req.query("force") === "true");          // force doing OCR for this, ignore cache result
    const nocache = (c.req.query("nocache") === "true");      // don't cache this result

    const result = await tokensOcrRouteHandler({
        tokens: { query: { translation: queryTranslation } },
        ocr: {
            image: file,
            query: { force, nocache }
        }
    });

    return c.json<TokensRouteResponse>(result);
});

routes.get("/entries/:param", async (c) => {
    const param = string.trimOrUndefined(c.req.param("param"));
    const queryTranslation = string.trimOrUndefined(c.req.query("translation")) as TranslationLanguage | undefined;
    const page = parseInt(c.req.query("page") ?? "1", 10);
    const limit = parseInt(c.req.query("limit") ?? "10", 10);
    
    const result = await entriesRouteHandler({
        param,
        query: {
            translation: queryTranslation,
            page: isNaN(page) ? 1 : Math.max(1, page),
            limit: isNaN(limit) ? DICT_OPTIONS.RESULT_LIMIT : Math.max(1, limit)
        }
    })

    return c.json<EntriesRouteResponse>(result);
});

// NOTE: might be better to change to streaming method instead of Buffering
routes.get("/voice/:sentence", async (c) => {
    const sentence = string.trimOrUndefined(c.req.param("sentence"));
    const voicename = string.trimOrUndefined(c.req.query("voicename"));
    const reading = string.trimOrUndefined(c.req.query("reading"));

    const result = await voiceRouteHandler({
        sentence,
        query: {
            voicename,
            reading
        }
    });

    // !!! vvv Content-Type in follow the output format in utils.sendToAzureTextToSpeech()
    return c.body<AzureTTSRequestOKResponse, 200>(result, 200, {
        "Content-Type": "audio/ogg; codecs=opus; rate=24000"
    });
});


routes.post("/tokens/speechtotext", async (c) => {
    const queryTranslation = string.trimOrUndefined(c.req.query("translation")) as TranslationLanguage | undefined;
    const arrayBuffer = await c.req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const lang = string.trimOrUndefined(c.req.query("lang")) as "jp" | "en" | undefined;

    if (buffer.length === 0) {
        return c.json({ error: "Empty audio buffer" }, 400);
    }

    const result = await tokensSpeechToTextRouteHandler({
        tokens: { query: { translation: queryTranslation } },
        stt: { audio: buffer, lang }
    });

    return c.json<TokensRouteResponse>(result);
});


routes.post("/speechtotext", async (c) => {

    const arrayBuffer = await c.req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const lang = string.trimOrUndefined(c.req.query("lang")) as "jp" | "en" | undefined;

    if (buffer.length === 0) {
        return c.json({ error: "Empty audio buffer" }, 400);
    }
    
    const result = await speechToTextRouteHandler({
        audio: buffer,
        lang
    });

    return c.json<SpeechToTextRouteResponse>(result);
})


export { routes };