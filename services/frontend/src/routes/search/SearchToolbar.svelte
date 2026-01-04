<script lang="ts">
    import Searchbar from "$lib/components/Searchbar.svelte";
    import { searchbarSubmit } from "./SearchToolbar";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
    import { onMount } from "svelte";
    import { LocalStorageKey } from "$lib/localStorage";
    import { page } from "$app/state";
    import type { SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";
    import AttachImageButton from "./[[sentence]]/AttachImageButton.svelte";
    import TranslationLanguageDropdown from "./[[sentence]]/TranslationLanguageDropdown.svelte";

    interface Props {
        toolbarContext: SearchToolbarContextInterface;
    }

    // @ts-expect-error
    const  { toolbarContext }: Props = $props<Props>();

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

        searchbarSubmit(toolbarContext.query);
        console.log(`${toolbarContext.query} | ${toolbarContext.image} | ${toolbarContext.translation}`)
    }
</script>


<form class="flex space-x-2 px-2" onsubmit={(e: Event) => { handleSubmit(e) }}>
    <AttachImageButton bind:image={toolbarContext.image}/>

    <Searchbar bind:query={toolbarContext.query}/>

    <TranslationLanguageDropdown bind:translationLang={toolbarContext.translation}/>
</form>