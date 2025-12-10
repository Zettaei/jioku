// @ts-ignore
import kuromoji from "kuromoji"
import path from "path";

// TODO: change DICT_PATH too
// NOTE: test with "npx tsx {this file}.ts"
const DICT_PATH = path.join("X:", "PRIVATE", "WORKS", "CITE_DPU", "FINAL PROJECT", "app", "services", "api", "node_modules", "kuromoji", "dict")

kuromoji.builder({ dicPath: DICT_PATH }).build(function (err, tokenizer) {
    // tokenizer is ready
    var path = tokenizer.tokenize("すもももももももものうち");
    console.log(path);
});



function analyzeText() {
    
}