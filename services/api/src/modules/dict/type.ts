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

    // [
    // {
    //     word_id: 415760, word_type: 'KNOWN', word_position: 1, surface_form: 'すもも', pos: '名詞', pos_detail_1: '一般', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'すもも', reading: 'スモモ', pronunciation: 'スモモ'
    // },
    // {
    //     word_id: 93220, word_type: 'KNOWN', word_position: 4, surface_form: 'も', pos: '助詞', pos_detail_1: '係助詞', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'も', reading: 'モ', pronunciation: 'モ'
    // },
    // {
    //     word_id: 1614710, word_type: 'KNOWN', word_position: 5, surface_form: 'もも', pos: '名詞', pos_detail_1: '一般', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'もも', reading: 'モモ', pronunciation: 'モモ'
    // }, { word_id: 93220, word_type: 'KNOWN', word_position: 7, surface_form: 'も', pos: '助詞', pos_detail_1: '係助詞', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'も', reading: 'モ', pronunciation: 'モ' }, { word_id: 1614710, word_type: 'KNOWN', word_position: 8, surface_form: 'もも', pos: '名詞', pos_detail_1: '一般', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'もも', reading: 'モモ', pronunciation: 'モモ' }, {
    //     word_id: 93100, word_type: 'KNOWN', word_position: 10, surface_form: 'の', pos: '助詞', pos_detail_1: '連体化', pos_detail_2: '*', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'の', reading: 'ノ', pronunciation: 'ノ'
    // },
    // {
    //     word_id: 62510, word_type: 'KNOWN', word_position: 11, surface_form: 'うち', pos: '名詞', pos_detail_1: '非自立', pos_detail_2: '副詞可能', pos_detail_3: '*', conjugated_type: '*', conjugated_form: '*', basic_form: 'うち', reading: 'ウチ', pronunciation: 'ウチ'
    // }
    // ]

    // MARK START DESU
// | Field             | Meaning                                                                                                |
// | ----------------- | ------------------------------------------------------------------------------------------------------ |
// | `word_id`         | Internal dictionary ID for the word. Useful for lookup, not usually needed in NLP tasks.               |
// | `word_type`       | `'KNOWN'` = word exists in dictionary, `'UNKNOWN'` = word not in dictionary.                           |
// | `word_position`   | The **character index** in the sentence where this word starts (1-based).                              |
// | `surface_form`    | The **exact substring** from the original sentence.                                                    |
// | `pos`             | Part of speech (e.g., `名詞` = noun, `助詞` = particle, `動詞` = verb, etc.).                                |
// | `pos_detail_1`    | First subcategory of POS, more granular (e.g., `一般` = general noun).                                   |
// | `pos_detail_2`    | Second subcategory, often `*` if not used.                                                             |
// | `pos_detail_3`    | Third subcategory, often `*`.                                                                          |
// | `conjugated_type` | For verbs/adjectives: type of conjugation (e.g., `五段` = godan, `一段` = ichidan). `*` if not applicable. |
// | `conjugated_form` | For verbs/adjectives: current conjugated form (`基本形`, `連用形`, etc.). `*` if not applicable.             |
// | `basic_form`      | The **dictionary form** of the word (e.g., `走る` instead of `走った`).                                     |
// | `reading`         | The **katakana reading** of the word (useful for furigana or pronunciation).                           |
// | `pronunciation`   | The pronunciation (usually same as `reading`, sometimes slightly different in some dictionaries).      |
    // MARK END DESU
type Kuromoji_WordType = "KNOWN" | "UNKNOWN";

export interface KuromojiResult {
    word_id: number;
    word_type: Kuromoji_WordType;
    word_position: number;
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading: string;
    pronunciation: string;
}