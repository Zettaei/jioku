import * as util from "./util.js";
import * as service from  "./service.js";
import * as repository from "./repository.js";
import * as Ocr from "modules/ocr/index.js";
import { DICT_OPTIONS } from "src/config.js";
import type { EntriesRouteHandler, EntriesRouteResponse, TokensOcrRouteHandler, TokensRouteHandler, TokensRouteResponse } from "./type/dto.js";
import { BadRequestError } from "src/core/errors/httpError.js";
import { TranslationLanguage } from "./type/model.js";


async function tokensRouteHandler(req: TokensRouteHandler): Promise<TokensRouteResponse> {
    const param = req.param;
    const queryTranslation = req.query.translation ?? TranslationLanguage.English;

    util.validateTranslationLanguage(queryTranslation);
    
    const MAX_QUERY_LENGTH = DICT_OPTIONS.MAX_QUERY_LENGTH
    if(!param) {
        return { 
            param: "",  
            quickTranslation: {
                language: queryTranslation,
                text: ""
            },
            tokens: [] 
        };
    }
    if(param.length > MAX_QUERY_LENGTH) {
        throw new BadRequestError("Query characters length exceeded ( " + MAX_QUERY_LENGTH + " characters)");
    }

    const tokens = await service.processTokenization(param);
    
    const quickTranslation = await service.processQuickTranslation(param, queryTranslation);

    return {
        param: param,
        quickTranslation: {
            language: queryTranslation,
            text: quickTranslation
        },
        tokens: tokens
    }
}


async function tokensOcrRouteHandler(req: TokensOcrRouteHandler): Promise<TokensRouteResponse> {
    const ocrImage = req.ocr.image;
    const ocrQuery = req.ocr.query;
    const tokensTranslation = req.tokens.query.translation ?? TranslationLanguage.English;

    const ocrResult = await Ocr.handler.ocrRouteHandler({
        image: ocrImage,
        query: ocrQuery
    });

    let ocrText = "";
    for (const ea of ocrResult.result.result) {
        ocrText += ea.text;
    }

    const tokensResult = await tokensRouteHandler({
        param: ocrText,
        query: { 
            translation: tokensTranslation
        }
    });

    return tokensResult;
}


async function entriesRouteHandler(req: EntriesRouteHandler): Promise<EntriesRouteResponse> {
    const param = req.param;
    const queryTranslation = req.query.translation ?? TranslationLanguage.English;

    if(!param) {
        return { 
            param: "", 
            language: TranslationLanguage.English, 
            result: { documents: [], total: 0 } 
        };
    }
    
    util.validateQuery(param);
    util.validateTranslationLanguage(queryTranslation);
    
    const searchResult = await repository.getWord(param, util.getWordType(param));
        
    await service.processRedisResultTranslation(queryTranslation, searchResult);

    return { 
        param: param, 
        language: queryTranslation, 
        result: searchResult 
    };
}


export {
    tokensRouteHandler,
    tokensOcrRouteHandler,
    entriesRouteHandler
}