import { InternalError } from "src/core/errors/internalError.js";
import { CardStatusType } from "../type/model.js";

interface SM2Input {
    quality: number;  // 0-5 rating
    easefactor: number;
    interval: number;
    repetition: number;
}

interface SM2Output {
    status: number,
    easefactor: number;
    interval: number;
    repetition: number;
    due: string;
}

function calculateSuperMemo2(input: SM2Input): SM2Output {
    const { quality, easefactor, interval, repetition } = input;

    // Validate quality (0-5)
    if (quality < 0 || quality > 5) {
        throw new InternalError('SuperMemo2 algorithm failed, quality must be between 0 and 5');
    }

    // Calculate new easefactor
    let newEasefactor = easefactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    if (newEasefactor < 1.3) {
        newEasefactor = 1.3;
    }


    let newInterval: number;
    let newRepetition: number;
    let newStatus: number;

    if (quality < 3) {
        // Failed - reset
        newInterval = 1;
        newRepetition = 1;
        newStatus = CardStatusType.retry;
        
    } else {
        // Passed
        if (repetition === 1) {
            newInterval = 1;
        } else if (repetition === 2) {
            newInterval = 3;
        } else {
            newInterval = Math.round(interval * newEasefactor);
        }
        newRepetition = repetition + 1;
        newStatus = CardStatusType.review;
    }


    // Next due date
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + newInterval);

    return {
        status: newStatus,
        easefactor: newEasefactor,
        interval: newInterval,
        repetition: newRepetition,
        due: nextDueDate.toISOString()
    };
}

export { calculateSuperMemo2, type SM2Input, type SM2Output };