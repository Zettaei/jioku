
export const CardStatusType = { new: 0, review: 1, retry: 2, suspend: 3 };
export type CardStatusType = typeof CardStatusType[keyof typeof CardStatusType];

export type CardsStatusDistribution = {
    due: number;
    new: number;
    retry: number;
};

export type CardsMaturityDistribution = {
        young: number;
        master: number;
        mature: number;
        unseen: number;
        learning: number;
};

export type CardsDueDistribution = Array<{
    date: string;
    count: number;
}>;
    
export type CardsOverdueTotal = number;
    
export type ReviewRetentionRate = {
    to: string;
    from: string;
    failed: number;
    passed: number;
};
    
export type CardsTotal = number;