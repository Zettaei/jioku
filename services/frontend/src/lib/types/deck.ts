import type { DeckRow } from "./server/core/supabase/type";

export type DeckEditableData = Omit<DeckRow, "id" | "createdat" | "updatedat" | "users_id" | "today_dues" >

export interface DeckExtraSetting {
    newLimit: number | undefined
}