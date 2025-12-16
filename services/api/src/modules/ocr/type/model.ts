
export interface OcrResult 
{
    filename: string;
    result: Array<OcrItem>;
}


export interface OcrItem 
{
    text: string;
    score: number;
    poly: [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ];
}
