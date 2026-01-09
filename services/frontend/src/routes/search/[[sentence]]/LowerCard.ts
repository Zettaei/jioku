import { HightlightBoxType } from "$lib/types/search";
import type { FtSearchResult } from "$lib/types/server/core/redisstack/type";
import type { Entry } from "$lib/types/server/modules/dict/type/model";

// TODO: update type for some of these error
export function getEntryMetadata(entry: Entry) 
{
    let highlight: Record<HightlightBoxType, HightlightBoxType | undefined> = {
        common: undefined
    }

    entry.r_ele.map((r_ele) => {

        if(!highlight.common && r_ele.re_pri) { 
            if(r_ele.re_pri.length > 0) highlight.common = HightlightBoxType.common;
        }

        return null;
    })

    return {
        kanji: entry.k_ele[0]?.keb,
        reading: entry.r_ele[0]?.reb,
        // meaning: entry.sense.map((sense) => sense.gloss.map((gloss) => gloss.text[0])),
        highlight
    }
}


export function getPosName(pos: string) {
    // TODO: convert the pos to its name
    return pos;
}