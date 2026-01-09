import type { EntriesRouteResponse, TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";

export const tokensMockData: TokensRouteResponse = JSON.parse(`{
    "param": "dog wdaz 何も食べられないです。",
    "quickTranslation": {
        "language": "en",
        "text": "Dog wdaz can't eat anything."
    },
    "tokens": [
        {
            "word_id": 120,
            "word_type": "UNKNOWN",
            "word_position": 1,
            "surface_form": "dog",
            "pos": "名詞",
            "pos_detail_1": "固有名詞",
            "pos_detail_2": "組織",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "*",
            "isUseful": true
        },
        {
            "word_id": 10,
            "word_type": "UNKNOWN",
            "word_position": 4,
            "surface_form": " ",
            "pos": "記号",
            "pos_detail_1": "空白",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "*",
            "isUseful": false
        },
        {
            "word_id": 120,
            "word_type": "UNKNOWN",
            "word_position": 5,
            "surface_form": "wdaz",
            "pos": "名詞",
            "pos_detail_1": "固有名詞",
            "pos_detail_2": "組織",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "*",
            "isUseful": true
        },
        {
            "word_id": 10,
            "word_type": "UNKNOWN",
            "word_position": 9,
            "surface_form": " ",
            "pos": "記号",
            "pos_detail_1": "空白",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "*",
            "isUseful": false
        },
        {
            "word_id": 43260,
            "word_type": "KNOWN",
            "word_position": 10,
            "surface_form": "何",
            "pos": "名詞",
            "pos_detail_1": "代名詞",
            "pos_detail_2": "一般",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "何",
            "reading": "ナニ",
            "pronunciation": "ナニ",
            "isUseful": true
        },
        {
            "word_id": 93220,
            "word_type": "KNOWN",
            "word_position": 11,
            "surface_form": "も",
            "pos": "助詞",
            "pos_detail_1": "係助詞",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "も",
            "reading": "モ",
            "pronunciation": "モ",
            "isUseful": false
        },
        {
            "word_id": 3037590,
            "word_type": "KNOWN",
            "word_position": 12,
            "surface_form": "食べ",
            "pos": "動詞",
            "pos_detail_1": "自立",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "一段",
            "conjugated_form": "未然形",
            "basic_form": "食べる",
            "reading": "タベ",
            "pronunciation": "タベ",
            "isUseful": true
        },
        {
            "word_id": 2599270,
            "word_type": "KNOWN",
            "word_position": 14,
            "surface_form": "られ",
            "pos": "動詞",
            "pos_detail_1": "接尾",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "一段",
            "conjugated_form": "未然形",
            "basic_form": "られる",
            "reading": "ラレ",
            "pronunciation": "ラレ",
            "isUseful": true
        },
        {
            "word_id": 23470,
            "word_type": "KNOWN",
            "word_position": 16,
            "surface_form": "ない",
            "pos": "助動詞",
            "pos_detail_1": "*",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "特殊・ナイ",
            "conjugated_form": "基本形",
            "basic_form": "ない",
            "reading": "ナイ",
            "pronunciation": "ナイ",
            "isUseful": false
        },
        {
            "word_id": 23760,
            "word_type": "KNOWN",
            "word_position": 18,
            "surface_form": "です",
            "pos": "助動詞",
            "pos_detail_1": "*",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "特殊・デス",
            "conjugated_form": "基本形",
            "basic_form": "です",
            "reading": "デス",
            "pronunciation": "デス",
            "isUseful": false
        },
        {
            "word_id": 90940,
            "word_type": "KNOWN",
            "word_position": 20,
            "surface_form": "。",
            "pos": "記号",
            "pos_detail_1": "句点",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "。",
            "reading": "。",
            "pronunciation": "。",
            "isUseful": false
        }
    ]
}`);


export const entriesMockData: EntriesRouteResponse = JSON.parse(`{
    "param": "dog",
    "language": "en",
    "result": [
        {
            "ent_score": 500043403,
            "ent_seq": "1258330",
            "k_ele": [
                {
                    "keb": "犬",
                    "ke_pri": [
                        "ichi1",
                        "news1",
                        "nf03"
                    ],
                    "score": 1043403
                },
                {
                    "keb": "狗",
                    "score": 1043403
                }
            ],
            "r_ele": [
                {
                    "reb": "いぬ",
                    "re_pri": [
                        "ichi1",
                        "news1",
                        "nf03"
                    ],
                    "score": 2043403
                },
                {
                    "reb": "イヌ",
                    "re_nokanji": [
                        null
                    ],
                    "score": 2043403
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "dog (Canis (lupus) familiaris)"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "squealer",
                                "rat",
                                "snitch",
                                "informer",
                                "informant",
                                "spy"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "loser",
                                "asshole"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&n-pref;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "counterfeit",
                                "inferior",
                                "useless",
                                "wasteful"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500043411,
            "ent_seq": "1247510",
            "k_ele": [
                {
                    "keb": "群れ",
                    "ke_pri": [
                        "ichi1",
                        "news1",
                        "nf11"
                    ],
                    "score": 2043411
                }
            ],
            "r_ele": [
                {
                    "reb": "むれ",
                    "re_pri": [
                        "ichi1",
                        "news1",
                        "nf11"
                    ],
                    "score": 2043411
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "group",
                                "crowd",
                                "flock",
                                "herd",
                                "bevy",
                                "school",
                                "swarm",
                                "cluster (e.g. of stars)",
                                "clump",
                                "pack (e.g. of dogs)"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500044428,
            "ent_seq": "1609690",
            "k_ele": [
                {
                    "keb": "食い下がる",
                    "ke_pri": [
                        "ichi1",
                        "news2",
                        "nf28"
                    ],
                    "score": 5044428
                },
                {
                    "keb": "喰い下がる",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 5044428
                },
                {
                    "keb": "食いさがる",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 5044428
                },
                {
                    "keb": "喰いさがる",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 5044428
                },
                {
                    "keb": "食い下る",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 4044428
                },
                {
                    "keb": "食下がる",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 4044428
                },
                {
                    "keb": "くい下がる",
                    "ke_inf": [
                        "&sK;"
                    ],
                    "score": 5044428
                }
            ],
            "r_ele": [
                {
                    "reb": "くいさがる",
                    "re_pri": [
                        "ichi1",
                        "news2",
                        "nf28"
                    ],
                    "score": 5044428
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&v5r;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to hang on to",
                                "to hang from",
                                "to cling to"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&v5r;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to hound",
                                "to keep after (someone)",
                                "to refuse to back down",
                                "to persist",
                                "to tenaciously face (someone)",
                                "to doggedly oppose"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&v5r;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to grab the front of the opponent's mawashi, place one's head against their chest, and lower one's hips"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500044432,
            "ent_seq": "1186710",
            "k_ele": [
                {
                    "keb": "化ける",
                    "ke_pri": [
                        "ichi1",
                        "news2",
                        "nf32"
                    ],
                    "score": 3044432
                }
            ],
            "r_ele": [
                {
                    "reb": "ばける",
                    "re_pri": [
                        "ichi1",
                        "news2",
                        "nf32"
                    ],
                    "score": 3044432
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&v1;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to take the form of (esp. in ref. to a spirit, fox, raccoon dog, etc.)",
                                "to assume the shape of",
                                "to turn oneself into",
                                "to transform oneself into"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&v1;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to disguise oneself as"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&v1;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to change radically",
                                "to metamorphose"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&v1;",
                        "&vi;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "to improve unexpectedly and dramatically (esp. of an actor, artist, rikishi, etc.)"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500044432,
            "ent_seq": "1579300",
            "k_ele": [
                {
                    "keb": "鮭",
                    "ke_pri": [
                        "news2",
                        "nf32",
                        "spec1"
                    ],
                    "score": 1044432
                }
            ],
            "r_ele": [
                {
                    "reb": "さけ",
                    "re_pri": [
                        "news2",
                        "nf32",
                        "spec1"
                    ],
                    "score": 2044432
                },
                {
                    "reb": "しゃけ",
                    "score": 3044432
                },
                {
                    "reb": "サケ",
                    "re_nokanji": [
                        null
                    ],
                    "re_pri": [
                        "spec1"
                    ],
                    "score": 2044432
                },
                {
                    "reb": "シャケ",
                    "re_nokanji": [
                        null
                    ],
                    "score": 3044432
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "salmon (Salmonidae spp.)"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "chum salmon (Oncorhynchus keta)",
                                "dog salmon"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500044433,
            "ent_seq": "1416770",
            "k_ele": [
                {
                    "keb": "狸",
                    "ke_pri": [
                        "news2",
                        "nf33",
                        "spec1"
                    ],
                    "score": 1044433
                },
                {
                    "keb": "貍",
                    "ke_inf": [
                        "&rK;"
                    ],
                    "score": 1044433
                }
            ],
            "r_ele": [
                {
                    "reb": "たぬき",
                    "re_pri": [
                        "news2",
                        "nf33",
                        "spec1"
                    ],
                    "score": 3044433
                },
                {
                    "reb": "タヌキ",
                    "re_nokanji": [
                        null
                    ],
                    "re_pri": [
                        "spec1"
                    ],
                    "score": 3044433
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "tanuki (Nyctereutes procyonoides)",
                                "raccoon dog"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "sly dog",
                                "sly old fox",
                                "sly fox",
                                "cunning devil",
                                "sly person"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500045431,
            "ent_seq": "1589650",
            "k_ele": [
                {
                    "keb": "飼い犬",
                    "ke_pri": [
                        "news2",
                        "nf31",
                        "spec2"
                    ],
                    "score": 3045431
                },
                {
                    "keb": "飼犬",
                    "score": 2045431
                }
            ],
            "r_ele": [
                {
                    "reb": "かいいぬ",
                    "re_pri": [
                        "news2",
                        "nf31",
                        "spec2"
                    ],
                    "score": 4045431
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "pet dog"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500045432,
            "ent_seq": "1217660",
            "k_ele": [
                {
                    "keb": "頑強",
                    "ke_pri": [
                        "news2",
                        "nf32",
                        "spec2"
                    ],
                    "score": 2045432
                }
            ],
            "r_ele": [
                {
                    "reb": "がんきょう",
                    "re_pri": [
                        "news2",
                        "nf32",
                        "spec2"
                    ],
                    "score": 5045432
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&adj-na;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "stubborn",
                                "dogged",
                                "persistent",
                                "tenacious"
                            ]
                        }
                    ]
                },
                {
                    "pos": [
                        "&adj-na;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "tough",
                                "sturdy",
                                "hardy",
                                "strong"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500045435,
            "ent_seq": "1537350",
            "k_ele": [
                {
                    "keb": "野犬",
                    "ke_pri": [
                        "news2",
                        "nf35",
                        "spec2"
                    ],
                    "score": 2045435
                }
            ],
            "r_ele": [
                {
                    "reb": "やけん",
                    "re_pri": [
                        "news2",
                        "nf35",
                        "spec2"
                    ],
                    "score": 3045435
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "stray dog",
                                "ownerless dog"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500045441,
            "ent_seq": "1258340",
            "k_ele": [
                {
                    "keb": "犬猿の仲",
                    "ke_pri": [
                        "news2",
                        "nf41",
                        "spec2"
                    ],
                    "score": 4045441
                }
            ],
            "r_ele": [
                {
                    "reb": "けんえんのなか",
                    "re_pri": [
                        "news2",
                        "nf41",
                        "spec2"
                    ],
                    "score": 7045441
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&exp;",
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "like cats and dogs",
                                "(on) very bad terms",
                                "relationship of dogs and monkeys"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "ent_score": 500045442,
            "ent_seq": "1554430",
            "k_ele": [
                {
                    "keb": "猟犬",
                    "ke_pri": [
                        "news2",
                        "nf42",
                        "spec2"
                    ],
                    "score": 2045442
                }
            ],
            "r_ele": [
                {
                    "reb": "りょうけん",
                    "re_pri": [
                        "news2",
                        "nf42",
                        "spec2"
                    ],
                    "score": 5045442
                },
                {
                    "reb": "かりいぬ",
                    "score": 4045442
                }
            ],
            "sense": [
                {
                    "pos": [
                        "&n;"
                    ],
                    "gloss": [
                        {
                            "lang": "eng",
                            "text": [
                                "hound",
                                "hunting dog",
                                "gun dog"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "total": 345,
    "pagination": {
        "page": 1,
        "limit": 10,
        "hasNext": true
    }
}`);

