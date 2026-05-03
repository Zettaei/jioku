<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import SearchToolbar from "../SearchToolbar.svelte";
    import { SEARCH_TOOLBAR_CONTEXT, type SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";
    import { getContext } from "svelte";
    import { searchKeywordStore } from "$lib/stores/search";
    import { Content, Root } from "$lib/components/ui/accordion";
    import { Button } from "$lib/components/ui/button";
    import Confirmation from "$lib/components/Confirmation.svelte";
    import { ArrowRight, ArrowRightIcon, ClockIcon, TrashIcon, XIcon } from "@lucide/svelte";
    import { goto } from "$app/navigation";
    import { lang } from "$lib/i18n";
    import { bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";

    const SearchToolbarContext = getContext<SearchToolbarContextInterface>(SEARCH_TOOLBAR_CONTEXT);
    
    let showClearConfirm = $state(false);
    
    function handleClearAll() {
        showClearConfirm = true;
    }
    
    function confirmClear() {
        searchKeywordStore.set([]);
    }
</script>


<div class="text-start w-full flex justify-center">
    <div class="w-full">
        <div class="pagetitle mb-4">
            {$lang.search.title}
        </div>

        <div class="mb-16">
            {$lang.search.subtitle}
        </div>
        <div class="mb-20">
            <SearchToolbar 
            isFirstPage={true}
            toolbarContext={SearchToolbarContext}
            />
        </div>
        {@render historyPane()}
    </div>
</div>


{#snippet historyPane()}
    <div>
        <div class="mb-2 flex justify-between items-center">
            <div class="avantgarde font-bold flex">
                <ClockIcon size=20 class="me-2"/>
                <span>{$lang.search.history.title}</span>
            </div>
            <div>
                <Button variant="ghost" size="sm" class="h-8 cursor-pointer" 
                onclick={handleClearAll}
                onmouseenter={bgtexthover(bgtext2, ">> Clear All History")}
                onmouseleave={bgtexthover(bgtext2)}
                onmouseup={bgtexthover(bgtext2)}
                >
                    <TrashIcon/>{$lang.search.history.clearAll}
                </Button>
            </div>
        </div>
        <hr class="mb-4"/>
        {#each $searchKeywordStore as keyword}
            <Card.Root class="py-3 rounded-md mb-2">
                <Card.Content class="ps-4 pe-2 flex justify-between gap-2 items-center">
                <div class="">{keyword}</div>
                <div class="flex gap-x-3">
                    <div class="flex-9/12 w-24">
                        <Button class="cursor-pointer w-full" variant="outline" onclick={() => {
                            goto("/search/" + keyword)
                        }}
                        onmouseenter={bgtexthover(bgtext2, ">> Reuse This History")}
                        onmouseleave={bgtexthover(bgtext2)}
                        onmouseup={bgtexthover(bgtext2)}
                        >
                            <ArrowRightIcon/>
                        </Button>
                    </div>
                    <div class="flex-3/12">
                        <Button class="cursor-pointer" size="icon" variant="ghost" onclick={() => {
                            $searchKeywordStore = $searchKeywordStore.filter((item) => item !== keyword)
                        }}
                        onmouseenter={bgtexthover(bgtext2, ">> Delete This History")}
                        onmouseleave={bgtexthover(bgtext2)}
                        onmouseup={bgtexthover(bgtext2)}
                        >
                            <XIcon/>
                        </Button>
                    </div>
                </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>
{/snippet}

<Confirmation 
    title={$lang.search.history.confirmTitle}
    message={$lang.search.history.confirmMessage}
    bind:open={showClearConfirm}
    onConfirm={confirmClear}
    onCancel={() => {}}
/>