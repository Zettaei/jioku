// @ts-ignore
import kuromoji from "kuromoji"
import path from "path";
import type { KuromojiResult } from "./type.js";

// TODO: change DICT_PATH too
// NOTE: test with "npx tsx {this file}.ts"
const DICT_PATH = path.join("..", "..", "..", "node_modules", "kuromoji", "dict");

async function initializeTokenizer(): Promise<{ tokenize: (text: string) => KuromojiResult[] }> {
    return await new Promise<any>((resolve, reject) => {
        kuromoji.builder({ dicPath: DICT_PATH }).build(function (err: any, tokenizer: any) {
            if(err) reject(err);
            resolve(tokenizer);
        });
    })
}

// const a = await initializeTokenizer();
// const b = a.tokenize("a");
// console.log(b[0].basic_form);