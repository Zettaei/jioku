<script lang="ts">
    import { Ellipsis, EllipsisIcon } from "@lucide/svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { goto } from "$app/navigation";
    import AddToDeckModal from "../AddToDeckModal.svelte";
    import { addCardToDeckId } from "../../deck/[deckId]/browse/services";
    import { errorState } from "$lib/global/errorState.svelte";
    import { successState } from "$lib/global/successState.svelte";

    interface Props {
        entryText: string; 
        kanji?: string; 
        reading?: string; 
        meaning?: string;
        class?: string;
    }

    let { entryText, kanji, reading, meaning, class: className } = $props();

    const JISHO_SEARCH_URL = "https://jisho.org/search/" as const;
    const BUNPRO_SEARCH_URL = "https://bunpro.jp/vocabs/" as const;

    let isAddToDeckModalOpen = $state(false);

    function handleJishoClick() {
        window.open(JISHO_SEARCH_URL + entryText, "_blank");
    }

    function handleBunproClick() {
        window.open(BUNPRO_SEARCH_URL + entryText, "_blank");
    }

    async function handleAddToDeck({ deckId, card }: { deckId: string; card: { data: Record<string, string> } }) {
        try {
            await addCardToDeckId(deckId, card);
            successState.show('Card added to deck successfully!');
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to add card to deck';
            errorState.show(errorMsg, 500);
            console.error('Error adding card to deck:', err);
        }
    }

</script>


<div>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class={className}>
            <EllipsisIcon/>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
         <DropdownMenu.Group>
          <DropdownMenu.Item onclick={() => { isAddToDeckModalOpen = true; }}>Add to Deck</DropdownMenu.Item>
          <DropdownMenu.Item onclick={handleJishoClick}>
            Search in Jisho.org
            </DropdownMenu.Item>
          <DropdownMenu.Item onclick={handleBunproClick}>
            Search in Bunpro.jp
        </DropdownMenu.Item>
         </DropdownMenu.Group>
        </DropdownMenu.Content>
       </DropdownMenu.Root>
</div>

<AddToDeckModal bind:isOpen={isAddToDeckModalOpen} onSave={handleAddToDeck} initialData={{ kanji, reading, meaning }} />