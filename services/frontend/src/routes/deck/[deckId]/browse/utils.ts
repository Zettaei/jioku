import type { cardExtraHeaderName } from "$lib/constant/cardExtraRows";
import { userStore } from "$lib/stores/auth";
import { get } from "svelte/store";
import type { Json } from "$lib/types/server/core/supabase/generatedType";
import type { CardRow } from "$lib/types/server/core/supabase/type";
import { CardStatusType } from "$lib/types/server/modules/deck/type/model";


export function isJsonObject( value: unknown)
: value is { [key: string]: Json | undefined } 
{
    return (typeof value === "object") && (value !== null && !Array.isArray(value));
}


export function convertTimeToUser(timeText: string, withTime: boolean = true)
: string
{
    const utcDate = new Date(timeText);

    if (isNaN(utcDate.getTime())) {
        return "";
    }

    return utcDate.toLocaleString("en-GB", {
        timeZone: get(userStore)?.timezone ?? "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: withTime ? "short" : undefined,
    });
}


export function getCardExtraValue(card: any, header: keyof typeof cardExtraHeaderName)
: string | number 
{
    const value = card[header];
    const timeFields: Array<keyof CardRow> = ['updatedat', 'createdat'];

    if(header === "status") {
        if(CardStatusType.new === value) return "New"
        else if(CardStatusType.review === value) return "Due"
        else if(CardStatusType.retry === value) return "Retry"
        else if(CardStatusType.suspend === value) return "Suspend"
        else return "?"
    }
    
    if(header === "easefactor") {
        return value/10;
    }

    if(header === "due") {
        return convertTimeToUser(value, false)
    }

    if (timeFields.includes(header) && value) {
        return convertTimeToUser(value);
    }
    
    return value;
}