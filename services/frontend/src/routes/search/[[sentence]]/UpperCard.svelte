<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";
    import VolumeButton from "./VolumeButton.svelte";
    import { lang } from "$lib/i18n";
    import { bgtext2 } from "$lib/stores/bgtext";

    interface Props {
        tokens: TokensRouteResponse | null;
        selectedWord: string | null;
        selectedIndex: string;
        onWordSelect: (word: string) => void;
        handleVoiceClick: (text: string, reading?: string) => void;
    };

    // @ts-expect-error
    let { tokens, selectedWord, selectedIndex = $bindable(), onWordSelect, handleVoiceClick }: Props = $props<Props>();
    let searchFullWord = $derived<string>(tokens?.tokens.map((token) => token.surface_form).join('') ?? '');


    function handleWordClick(e: MouseEvent) {
      const target = e.target as HTMLSpanElement;
      const word = target.innerText;
      onWordSelect(word);
      selectedIndex = target.id;
    }

</script>

<Card.Root class="text-lg mb-12">
    <Card.Header>
      <Card.Title class="avantgarde text-lg">
        {$lang.card.quickTranslation}
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-center">{tokens?.quickTranslation.text}</p>
    </Card.Content>

    <div class="my-1"></div>

    <Card.Header class="py-0 my-0">
      <Card.Title class="font-bold flex items-center">
        <span class="avantgarde text-lg me-2">{$lang.card.searchKeywords}</span>
        <VolumeButton text={searchFullWord} onClick={handleVoiceClick} />
      </Card.Title>
    </Card.Header>
    <Card.Content class="text-xl">
      {#each tokens?.tokens as token, index}
        {#if token.isUseful}
            {@const indexStr = index.toString()}
            <button class="hover:underline cursor-pointer {(selectedIndex === indexStr) ? "text-yellow-400 font-bold underline" : ""}" 
            onclick={(e) => {handleWordClick(e);}} id={indexStr}
            onmouseenter={
              selectedIndex === index.toString() ? 
              () => {} 
              : 
              () => {$bgtext2 = ">> Select '" + token.surface_form + "'"}
            }
            onmouseleave={() => {$bgtext2 = ''}}
            >
                {token.surface_form}
            </button>
        {:else}
            <span class="opacity-60">
                {token.surface_form}
            </span>
        {/if}
      {/each}
    </Card.Content>
  </Card.Root>
