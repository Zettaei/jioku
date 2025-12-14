import { getRedisClient, type FtSearchResult } from "core/redisstack/index.js";
import { WordType, type Entry, type EntryIndexType, type EntryScoreType } from "./type.js";
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
    const redis = await getRedisClient()!;

    const searchKey = escapeRedisSearch(word);
    const indexKey = convertToIndexKey(wordType);
    const scoreKey = convertToScoreKey(wordType);

    const result = await redis.ft.search(
        DICT_OPTIONS.INDEX_KEYNAME,
        '@'+ indexKey + ':(' + searchKey + ')', 
        {
            LIMIT: {
                from,
                size             
            },
            SORTBY: {
                BY: scoreKey,
                DIRECTION: "ASC",
            }
        }
    ) as unknown as FtSearchResult<Entry>;      // <-- dangerous type shi, make sure the type correct before casting

    return result;
}

export {
    getWord
}