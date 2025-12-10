
export interface Entry {
    ent_seq: string;
    k_ele: {
        keb: string;
        score: number;
    }[];
    r_ele: {
        reb: string;
        score: number;
    }[];
    sense: {
        pos: string[]
        gloss: {
            lang: string;
            text: string[];
        }[];
    }[];
    ent_score: number;
}