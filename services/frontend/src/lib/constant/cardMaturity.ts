
export const cardMaturity = {
    unseen: {
        status: 0,
        minInterval: 0,
        maxInterval: 0
    },
    learning: {
        status: null,
        minInterval: 1,
        maxInterval: 14
    },
    young: {
        status: null,
        minInterval: 15,
        maxInterval: 60
    },
    mature: {
        status: null,
        minInterval: 61,
        maxInterval: 364
    },
    master: {
        status: null,
        minInterval: 61,
        maxInterval: 364
    }
} as const;