const AzureTTSVoiceNameJP = {
    nanami: "ja-JP-NanamiNeural",
    keita: "ja-JP-KeitaNeural",
    aoi: "ja-JP-AoiNeural",
    daichi: "ja-JP-DaichiNeural",
    mayu: "ja-JP-MayuNeural",
    naoki: "ja-JP-NaokiNeural",
    shiori: "ja-JP-ShioriNeural",
    masaruMultilingual: "ja-JP-MasaruMultilingualNeural",
    masaruDragonHD: "ja-JP-Masaru:DragonHDLatestNeural",
    nanamiDragonHD: "ja-JP-Nanami:DragonHDLatestNeural"
} as const;
export type AzureTTSVoiceNameJP = typeof AzureTTSVoiceNameJP[keyof typeof AzureTTSVoiceNameJP];


const AzureTTSVoiceNameEN = {
    aria: "en-US-AriaNeural",
    guy: "en-US-GuyNeural",
    jenny: "en-US-JennyNeural",
    armonie: "en-US-ArmonieNeural"
} as const;
export type AzureTTSVoiceNameEN = typeof AzureTTSVoiceNameEN[keyof typeof AzureTTSVoiceNameEN];
