import * as util from "./util.js";
import * as service from  "./service.js";
import * as repository from "./repository.js";
import * as Ocr from "modules/ocr/index.js";
import { DICT_OPTIONS } from "src/config.js";
import type { EntriesRouteHandler, EntriesRouteResponse, TokensOcrRouteHandler, TokensRouteHandler, TokensRouteResponse, VoiceRouteHandler, VoiceRouteResponse } from "./type/dto.js";
import { BadRequestError } from "src/errors/httpError.js";
import { TranslationLanguage } from "./type/model.js";
import { AzureTTSVoiceName } from "./type/azureTTS.js";


async function tokensRouteHandler(req: TokensRouteHandler)
: Promise<TokensRouteResponse> 
{
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


async function tokensOcrRouteHandler(req: TokensOcrRouteHandler)
: Promise<TokensRouteResponse> 
{
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


async function entriesRouteHandler(req: EntriesRouteHandler)
: Promise<EntriesRouteResponse> 
{
    const param = req.param;
    const queryTranslation = req.query.translation ?? TranslationLanguage.English;
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? DICT_OPTIONS.RESULT_LIMIT;
    const from = (page - 1) * limit;

    if(!param) {
        return { 
            param: "", 
            language: TranslationLanguage.English,
            result: [],
            total: 0,
            pagination: { page: 1, limit, hasNext: false }
        };
    }
    
    util.validateQuery(param);
    util.validateTranslationLanguage(queryTranslation);
    
    const searchResult = await repository.getWord(param, util.getWordType(param), from, limit);
    
    // Transform FtSearchResult to array of entries and calculate hasNext
    const entries = searchResult.documents.map(doc => doc.value);
    const hasNext = searchResult.total > from + limit;
        
    await service.processRedisResultTranslation(queryTranslation, { documents: entries.map(entry => ({ id: "", value: entry })), total: searchResult.total });

    return { 
        param: param, 
        language: queryTranslation,
        result: entries,
        total: searchResult.total,
        pagination: { page, limit, hasNext }
    };
}

async function voiceRouteHandler(req: VoiceRouteHandler) 
: Promise<VoiceRouteResponse>
{
    const sentence = req.sentence ?? '';
    // vv default to Nanami if undefined
    const voicenameQuery = req.query.voicename ?? AzureTTSVoiceName.nanami;
    const readingQuery = req.query.reading ?? '';

    util.validateVoicename(voicenameQuery);

    const voiceResult = await service.processVoiceGeneration(sentence, readingQuery, voicenameQuery);

    return voiceResult;
}


export {
    tokensRouteHandler,
    tokensOcrRouteHandler,
    entriesRouteHandler,
    voiceRouteHandler
}