export const AzureTTSVoiceName = {
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
export type AzureTTSVoiceName = typeof AzureTTSVoiceName[keyof typeof AzureTTSVoiceName];
