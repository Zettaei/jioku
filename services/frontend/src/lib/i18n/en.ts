export interface Lang {
  nav: {
    search: string;
    deck: string;
    settings: string;
    login: string;
    appTitle: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    placeholderListening: string;
    placeholderProcessing: string;
    attachImage: { label: string; tooltip: string };
    voiceInput: { label: string; tooltip: string; stopRecording: string; searchByVoice: string };
    translation: { label: string };
    history: { title: string; clearAll: string; confirmTitle: string; confirmMessage: string };
  };
  card: {
    quickTranslation: string;
    searchKeywords: string;
    resultFound: string;
    alternatives: string;
    reading: string;
    meaning: string;
  };
  common: { yes: string; no: string };
}

// NOTE: Language only added for Dict/Search page I think

export const en: Lang = {
  nav: {
    search: "Search",
    deck: "Deck",
    settings: "Settings",
    login: "Log In",
    appTitle: "J I O K U",
  },

  search: {
    title: "DICTIONARY",
    subtitle: "Search dictionary with Text, Image, or Voice",
    placeholder: "Search...",
    placeholderListening: "Listening...",
    placeholderProcessing: "Processing...",

    attachImage: {
      label: "Attach Image",
      tooltip: "Text from image, Supports PNG, JPG, WEBP, and BMP.",
    },

    voiceInput: {
      label: "Speech to Text",
      tooltip: "Extract Japanese from speech, Microphone required.",
      stopRecording: "Stop recording",
      searchByVoice: "Search by voice",
    },

    translation: {
      label: "Translate into",
    },

    history: {
      title: "KEYWORD SEARCH HISTORY",
      clearAll: "Clear All",
      confirmTitle: "Clear Search History",
      confirmMessage:
        "Are you sure you want to clear all search history? This action cannot be undone.",
    },
  },

  card: {
    quickTranslation: "QUICK TRANSLATION:",
    searchKeywords: "SEARCH KEYWORDS:",
    resultFound: "RESULT FOUND",
    alternatives: "Alternatives",
    reading: "Reading",
    meaning: "Meaning",
  },

  common: {
    yes: "Yes",
    no: "No",
  },
};
