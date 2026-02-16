import type { CardRow } from "$lib/types/server/core/supabase/type";


export const cardExtraHeaderOrder: Array<keyof CardRow> = [
    "status",
    "due",
    "interval",
    "easefactor",
    "repetition",
    "updatedat",
    "createdat"
] as const;

export const cardExtraHeaderName: Partial<Record<keyof CardRow, string>> = {
    status: "Status",
    due: "Due Date",
    interval: "Interval (day)",
    easefactor: "Ease Factor",
    repetition: "Repetition",
    updatedat: "Last Modified",
    createdat: "Created"
} as const;