<script lang="ts">
    import type { EntriesRouteResponse, TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";
    import { fetchSearchWords, fetchTokens, fetchTokensOCR, fetchVoice, getDefaultSelectedWord, playVoice } from "../services";
    import { page } from "$app/state";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
    import { LocalStorageKey } from "$lib/localStorage";
    import { entriesMockData, tokensMockData } from "../../../mock/search";
    import UpperCard from "./UpperCard.svelte";
    import LowerCard from "./LowerCard.svelte";
    import { getContext, onMount, untrack } from "svelte";
    import { SEARCH_TOOLBAR_CONTEXT, type SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";
    import FrontPage from "./FrontPage.svelte";
    import Loading from "../../Loading.svelte";
    import ImageCard from "./ImageCard.svelte";
    import { goto } from "$app/navigation";
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import { DICT_OPTIONS } from "$lib/constant/options";

    // OPTIMIZE: check if the last image/text and translation is the same as the new one, if it is then no request
    // BUG: race condition if user clicking or searching too fast
    // BUG: after changing language, user can't enter the same sentence again for some reason

  const SearchToolbarContext = getContext<SearchToolbarContextInterface>(SEARCH_TOOLBAR_CONTEXT);
  const MAX_VOICE_CACHES_LENGTH = 20;
  let AudioContext: AudioContext;
  const voiceCache = new Map<string, AudioBuffer>();
  
  
  let uppercardIsLoading = $state<boolean>(false);
  let lowercardIsLoading = $state<boolean>(false);

  let sentence = $derived<string>(page.params.sentence ?? "");
  let hasImage = $derived<boolean>(SearchToolbarContext.image ? true : false)
  let isFrontpage = $derived<boolean>(sentence === "" && !hasImage);
  let tokens = $state<TokensRouteResponse | null>(null);
  let entries = $state<EntriesRouteResponse | null>(null);

  let selectedWord = $state("");
  let selectedIndex = $derived<string>(tokens?.tokens[0] ? "0" : "");

  let currentPage = $state<number>(1);
  let pageLimit = $state<number>(DICT_OPTIONS.MAX_RESULTS_PER_PAGE);

  // // DEV: MOCK DATA
  // $effect(() => {
  //   const tmp = sentence;
  //   $inspect(tmp);
  //   if(tmp !== "") {
  //     tokens = tokensMockData;
  //     entries = entriesMockData;
  //   }
  // })


  onMount(() => {
    AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    localStorage.getItem(LocalStorageKey.SearchTranslationLang) as TranslationLanguage 
    ?? 
    TranslationLanguage.English

    selectedWord = getDefaultSelectedWord(tokens!);

    return (() => {
      if(AudioContext) {
        AudioContext.close();
        voiceCache.clear();
      }
    })
  });

  // OCR listening
  $effect(() => {
    const image = SearchToolbarContext.image;

    if(image === null) {
      return;
    }
    
    untrack(async () => {
      goto("/search");
      SearchToolbarContext.query = "";
      
      uppercardIsLoading = true;
      try {
        const tokensResult = await fetchTokensOCR(image, SearchToolbarContext.translation);
        tokens = tokensResult;
        selectedWord = getDefaultSelectedWord(tokens);
      }
      finally {
        uppercardIsLoading = false;
      }
    });
  });
  
  // sentence/search listening
  $effect(() => {
    const currentSentence = sentence;

    if (currentSentence === "") {
        tokens = null;
        return;
    }
    
    untrack(async () => {
      uppercardIsLoading = true;
      try {
        const tokensResult = await fetchTokens(currentSentence, SearchToolbarContext.translation);
        tokens = tokensResult;
        selectedWord = getDefaultSelectedWord(tokens);
        SearchToolbarContext.image = null;
      }
      finally {
        uppercardIsLoading = false;
      }
    });
  });


  // entry listening
  $effect(() => {
    const word = selectedWord;

    if(word === "") {
      return;
    }

    untrack(async () => {
      lowercardIsLoading = true;
      currentPage = 1;
      try {
        const entryResult = await fetchSearchWords(word, SearchToolbarContext.translation, currentPage, pageLimit)
        entries = entryResult;
      }
      finally {
        lowercardIsLoading = false;
      }

    });
  });

  // pagination listening
  async function handlePageChange(newPage: number) {
    if (!selectedWord || !entries) return;
    
    currentPage = newPage;
    lowercardIsLoading = true;
    try {
      const entryResult = await fetchSearchWords(selectedWord, SearchToolbarContext.translation, newPage, pageLimit);
      entries = entryResult;
    }
    finally {
      lowercardIsLoading = false;
    }
  }

  
  function handleVoiceClick(text: string, reading: string | undefined)
  : void 
  {
    if(!AudioContext) {
      throw new Error("Speech unavailable")
    }

    // check the page cache
    let decodedVoiceBuffer = voiceCache.get(text);
    if(decodedVoiceBuffer) {
      playVoice(AudioContext, decodedVoiceBuffer);

    }
    else {
      fetchVoice(text, reading)
      .then(async (voiceArrayBuffer) => {
        decodedVoiceBuffer = await AudioContext.decodeAudioData(voiceArrayBuffer);
        playVoice(AudioContext, decodedVoiceBuffer);
        voiceCache.set(text, decodedVoiceBuffer)
      })
    }
  }

</script>

<div class="w-full max-w-4xl flex flex-col space-y-5">

{#if isFrontpage}
    <FrontPage />

{:else if uppercardIsLoading}
    <Loading />

{:else}
    {#if hasImage}
        <ImageCard image={SearchToolbarContext.image!} />
    {/if}

    {#if tokens}
        <UpperCard
            tokens={tokens}
            bind:selectedWord
            bind:selectedIndex
            handleVoiceClick={handleVoiceClick}
        />
    {/if}

    {#if lowercardIsLoading}
        <Loading />
    {:else if entries}
        <LowerCard entries={entries} handleVoiceClick={handleVoiceClick} />
        
        {#if entries.result.length > 0}
            <Pagination.Root count={entries.total} perPage={pageLimit} bind:page={currentPage}>
            {#snippet children({ pages })}
                <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous 
                        class="cursor-pointer"
                        onclick={() => {
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                    />
                </Pagination.Item>
                {#each pages as page (page.key)}
                    {#if page.type === "ellipsis"}
                    <Pagination.Item>
                        <Pagination.Ellipsis />
                    </Pagination.Item>
                    {:else}
                    <Pagination.Item>
                        <Pagination.Link 
                            class="cursor-pointer"
                            {page} 
                            isActive={currentPage === page.value}
                            onclick={() => handlePageChange(page.value)}
                        >
                        {page.value}
                        </Pagination.Link>
                    </Pagination.Item>
                    {/if}
                {/each}
                <Pagination.Item>
                    <Pagination.Next 
                        class="cursor-pointer"
                        onclick={() => {
                            // @ts-ignore
                            const totalPages = Math.ceil(entries?.total / pageLimit);
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                    />
                </Pagination.Item>
                </Pagination.Content>
            {/snippet}
            </Pagination.Root>
        {/if}
    {/if}
{/if}

</div>

