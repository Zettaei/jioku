<script lang="ts">
    import { Ellipsis, EllipsisIcon } from "@lucide/svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { goto } from "$app/navigation";
    let className = "";
    export { className as class }

    let { entryText } = $props<string>();

    const JISHO_SEARCH_URL = "https://jisho.org/search/" as const;
    const BUNPRO_SEARCH_URL = "https://bunpro.jp/vocabs/" as const;

    function handleJishoClick() {
        window.open(JISHO_SEARCH_URL + entryText, "_blank");
    }

    function handleBunproClick() {
        window.open(BUNPRO_SEARCH_URL + entryText, "_blank");
    }

</script>


<div class="{className}">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <EllipsisIcon/>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
         <DropdownMenu.Group>
          <DropdownMenu.Item>Add to Deck</DropdownMenu.Item>
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