<script lang="ts">
    import Searchbar from "$lib/components/Searchbar.svelte";
    import { searchbarSubmit } from "./SearchToolbar";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
    import { onMount } from "svelte";
    import { LocalStorageKey } from "$lib/localStorage";
    import { page } from "$app/state";
    import type { SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";
    import AttachImageButton from "./[[sentence]]/AttachImageButton.svelte";
    import VoiceInputButton from "./[[sentence]]/VoiceInputButton.svelte";
    import TranslationLanguageDropdown from "./[[sentence]]/TranslationLanguageDropdown.svelte";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";
    import { useSidebar } from "$lib/components/ui/sidebar";
    import { Button } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { InfoIcon, SearchIcon, XIcon } from "@lucide/svelte";
    import { lang } from "$lib/i18n";

    interface Props {
        toolbarContext: SearchToolbarContextInterface;
        searchbarClass?: string;
        isFirstPage?: boolean;
    }

    const  { toolbarContext, searchbarClass = "", isFirstPage = false }: Props = $props();
    const sidebar = useSidebar();

    let isListening = $state(false);
    let isProcessing = $state(false);
    let isMobileSearchOpen = $state(false);

    // Translation Language Dropdown 
    onMount(() => {
        const saved = localStorage.getItem(LocalStorageKey.SearchTranslationLang);
        if(saved === TranslationLanguage.English || saved === TranslationLanguage.Thai) {
            toolbarContext.translation = saved
        }
        else {
            toolbarContext.translation = TranslationLanguage.English
        }

        toolbarContext.query = page.params.sentence ?? "";
    });

    $effect(() => {
        localStorage.setItem(LocalStorageKey.SearchTranslationLang, toolbarContext.translation);
    });
    //////////////////////////////

    function handleSubmit(e: Event) {
        e.preventDefault();

        if(toolbarContext.query === ""){
            return;
        }

        searchbarSubmit(toolbarContext.query, toolbarContext);
        toolbarContext.query = "";
        isMobileSearchOpen = false;
    }

    function handleVoiceResult(result: TokensRouteResponse) {
        searchbarSubmit(result.param, toolbarContext);
        isMobileSearchOpen = false;
    }

    function closeMobileSearch() {
        isMobileSearchOpen = false;
        toolbarContext.query = "";
    }
</script>

{#if !isFirstPage}
    {#if isMobileSearchOpen && sidebar.isMobile}
        <!-- Mobile search modal overlay -->
        <div 
            class="fixed inset-0 bg-black/50 z-50" 
            role="presentation"
            onclick={closeMobileSearch}
            onkeydown={(e) => e.key === "Escape" && closeMobileSearch()}
        ></div>
        <div class="fixed top-0 left-0 right-0 z-50 bg-background border-b p-2 flex gap-2">
            <form class="flex space-x-2 flex-1" onsubmit={(e: Event) => { handleSubmit(e) }}>
                <Searchbar
                    bind:query={toolbarContext.query}
                    placeholder={isListening ? $lang.search.placeholderListening : isProcessing ? $lang.search.placeholderProcessing : $lang.search.placeholder}
                />

                <TranslationLanguageDropdown bind:translationLang={toolbarContext.translation}/>
            </form>
            <Button
                variant="ghost"
                size="icon"
                onclick={closeMobileSearch}
            >
                <XIcon size={20} />
            </Button>
        </div>
    {:else}
        <!-- Desktop view or mobile icon -->
        <form class="flex space-x-2 px-2 {sidebar.isMobile ? 'w-full' : ''}" onsubmit={(e: Event) => { handleSubmit(e) }}>
            <AttachImageButton bind:image={toolbarContext.image} />

            <VoiceInputButton
                bind:query={toolbarContext.query}
                bind:isListening
                bind:isProcessing
                translationLang={toolbarContext.translation}
                onSubmit={handleVoiceResult}
            />

            {#if !sidebar.isMobile}
                <Searchbar
                    bind:query={toolbarContext.query}
                    placeholder={isListening ? "Listening..." : isProcessing ? "Processing..." : "Search..."}
                    class={searchbarClass}
                />

                <TranslationLanguageDropdown bind:translationLang={toolbarContext.translation}/>
            {:else}
                <!-- Mobile search icon button -->
                <Button
                    variant="outline"
                    size="icon"
                    onclick={() => isMobileSearchOpen = true}
                >
                    <SearchIcon size={20} />
                </Button>
            {/if}
        </form>
    {/if}
{:else}
    {@render FirstPage()}
{/if}


{#snippet FirstPage()}
    <div>
        <div class={!sidebar.isMobile ? "max-w-sm" : ""}>
            <div class="flex gap-2 mb-5">
                <div class="w-full">
                    <AttachImageButton 
                        bind:image={toolbarContext.image}
                        isFirstPage={true}
                    />
                </div>
                <Tooltip.Root>
                    <Tooltip.Trigger class="flex items-center">
                        <InfoIcon size={20}></InfoIcon>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>{$lang.search.attachImage.tooltip}</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>

            <div class="flex gap-2 mb-5">
                <div class="w-full">
                    <VoiceInputButton
                        bind:query={toolbarContext.query}
                        bind:isListening
                        bind:isProcessing
                        translationLang={toolbarContext.translation}
                        onSubmit={handleVoiceResult}
                        isFirstPage={true}
                    />
                </div>
                <Tooltip.Root>
                    <Tooltip.Trigger class="flex items-center">
                        <InfoIcon size={20}></InfoIcon>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>{$lang.search.voiceInput.tooltip}</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
        </div>

        <form onsubmit={(e: Event) => { handleSubmit(e) }} class="space-y-2">
            <div>
                <Searchbar
                    bind:query={toolbarContext.query}
                    placeholder={isListening ? $lang.search.placeholderListening : isProcessing ? $lang.search.placeholderProcessing : $lang.search.placeholder}
                    class={searchbarClass}
                />
            </div>

            <div class="flex w-full justify-end">
                <TranslationLanguageDropdown 
                    bind:translationLang={toolbarContext.translation}
                    isFirstPage={true}
                />
            </div>
        </form>
    </div>
{/snippet}