import { Hono, type Input } from "hono";
import { string } from "core/utils/index.js";
import * as ocr from "modules/ocr/index.js";
import * as utils from "./utils.js";
import * as services from "./service.js";
import * as repository from "./repository.js";
import { TranslationLanguage, WordType, type TokenFeatures } from "./type.js";
import type { TokensRouteResponse, EntriesRouteResponse, AzureTranslationOKResponse } from "./apiType.js";
import { BadRequestError } from "src/core/errors/httpErrors.js";
import { DICT_OPTIONS } from "src/config.js";

const routes = new Hono();


routes.get("/tokens", async (c) => {
    const paramQuery = string.trimOrUndefined(c.req.query("query"));
    const paramTranslation = string.trimOrUndefined(c.req.query("translation"));

    utils.validateTranslationLanguage(paramTranslation);

    const MAX_QUERY_LENGTH = DICT_OPTIONS.MAX_QUERY_LENGTH
    if(!paramQuery) {
        return c.json<TokensRouteResponse>({ 
            query: "", 
            queryTranslation: paramTranslation, 
            quickTranslation: "", 
            tokens: [] 
        });
    }
    if(paramQuery.length > MAX_QUERY_LENGTH) {
        throw new BadRequestError("Query characters length exceeded ( " + MAX_QUERY_LENGTH + " characters)");
    }

    const tokens = services.tokenize(paramQuery);
    for(const token of tokens) {
        (token as TokenFeatures).isUseful = utils.isUsefulToken(token);
    }

    let quickTranslation = ""
    try {
        quickTranslation = (await utils.sendToAzureTranslator(
            paramTranslation, 
            [ { text: paramQuery } ]
        ))[0]?.translations[0]?.text ?? "";
    }
    catch(err) { console.warn("Azure translation failed, skipping", err); }


    return c.json<TokensRouteResponse>({
        query: paramQuery,
        queryTranslation: paramTranslation,
        quickTranslation: quickTranslation,
        tokens: tokens,
    });
});


routes.get("/entries", async (c) => {
    const paramQuery = string.trimOrUndefined(c.req.query("query"));
    const paramTranslation = string.trimOrUndefined(c.req.query("translation"));
    
    if(!paramQuery) {
        return c.json<EntriesRouteResponse>({ 
            query: "", 
            queryTranslation: TranslationLanguage.English, 
            result: { documents: [], total: 0 } 
        });
    }
    
    utils.validateQuery(paramQuery);
    utils.validateTranslationLanguage(paramTranslation);
    
    const words = await repository.getWord(paramQuery, utils.getWordType(paramQuery));
        
    if( // en don't need to be translate
        (words.documents.length > 0) &&
        (paramTranslation === TranslationLanguage.Thai)
    ) {
        try {
            await services.transformRedisResult(paramTranslation, words); // <-- !!! this mutate the object !!!
        }
        catch(err) { console.warn("Azure translation failed, skipping", err); }
    }

    return c.json<EntriesRouteResponse>({
        query: paramQuery,
        queryTranslation: paramTranslation,
        result: words
    });
});


export { routes };