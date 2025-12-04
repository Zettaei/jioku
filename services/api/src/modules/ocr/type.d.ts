interface OcrResult 
{
    filename: string;
    result: OcrItem[];
}


interface OcrItem 
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
