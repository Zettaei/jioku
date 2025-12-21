
export const CardStatusType = { new: 0, review: 1, retry: 2, suspend: 3 };
export type CardStatusType = typeof CardStatusType[keyof typeof CardStatusType];