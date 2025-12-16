import { Hono } from "hono";
import { string } from "core/utils/index.js";
import { TranslationLanguage } from "./type/model.js";
import { type TokensRouteResponse, type EntriesRouteResponse, type TokensOcrRouteHandler } from "./type/dto.js";
import { entriesRouteHandler, tokensOcrRouteHandler, tokensRouteHandler } from "./handler.js";

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
    
    const result = await entriesRouteHandler({
        param,
        query: {
            translation: queryTranslation
        }
    })

    return c.json<EntriesRouteResponse>(result);
});


export { routes };