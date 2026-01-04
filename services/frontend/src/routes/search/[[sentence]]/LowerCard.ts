import type { FtSearchResult } from "$lib/types/server/core/redisstack/type";
import type { Entry } from "$lib/types/server/modules/dict/type/model";

export function getEntryMetadata(entry: Entry) {
    return {
        kanji: entry.k_ele[0]?.keb,
        reading: entry.r_ele[0]?.reb,
        meaning: entry.sense,
        // isCommon: item.k_ele[0].length > 0
    }
}