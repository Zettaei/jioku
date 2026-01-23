import { getRedisClient, type FtSearchResult } from "core/redisstack/index.js";
import { WordType, type Entry, type EntryIndexType, type EntryScoreType } from "./type/model.js";
import { DICT_OPTIONS } from "src/config.js";

function convertToScoreKey(wordType: WordType)
: EntryScoreType 
{
    if(wordType === WordType.kanji) return "kanji_score";
    if(wordType === WordType.kana) return "reading_score";
    return "ent_score";
}

function convertToIndexKey(wordType: WordType)
: EntryIndexType 
{
    if(wordType === WordType.kanji) return "kanji";
    if(wordType === WordType.kana) return "reading";
    return "meaning";
}

/** @return a string that replaced Escape Redisearch special characters: - | @ * " : ( ) [ ] **with '\' infront** */ 
function escapeRedisSearch(query: string)
: string 
{
    return query.replace(/([\-|@*":\[\]\(\)])/g, "\\$1");
}

async function getWord(word: string, wordType: WordType, from: number = 0, size: number = DICT_OPTIONS.RESULT_LIMIT)
: Promise<FtSearchResult<Entry>> 
{
    const redis = await getRedisClient();

    let searchKey = escapeRedisSearch(word);
    if(wordType !== WordType.meaning) {
        searchKey += '*';
    }
    const indexKey = convertToIndexKey(wordType);
    const scoreKey = convertToScoreKey(wordType);

    const result = await redis.ft.search(
        DICT_OPTIONS.INDEX_KEYNAME,
        '@'+ indexKey + ':(' + searchKey + ')', 
        {
            LIMIT: {
                from,
                size: size + 1  // hasMore           
            },
            SORTBY: {
                BY: scoreKey,
                DIRECTION: "ASC",
            }
        }
    ) as unknown as FtSearchResult<Entry>;

    return result;
}

async function getAzureTTSAccessToken()
: Promise<string | null>
{
    const redis = await getRedisClient();
    const result = await redis.get(DICT_OPTIONS.AZURE_ACCESSTOKEN_KEY);
    
    return result?.trim() ?? null;
}

async function setAzureTTSAccessToken(token: string)
: Promise<void>
{
    const redis = await getRedisClient();
    await redis.set(DICT_OPTIONS.AZURE_ACCESSTOKEN_KEY, token, {
        expiration: {
            type: "EX", // seconds
            value: DICT_OPTIONS.AZURE_ACCESSTOKEN_EXPIREIN_SECONDS
        }
    });
    
    return;
}

export {
    getWord,
    getAzureTTSAccessToken,
    setAzureTTSAccessToken
}