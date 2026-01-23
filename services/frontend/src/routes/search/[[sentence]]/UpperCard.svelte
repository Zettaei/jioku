<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
import * as Card from "$lib/components/ui/card/index.js";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";
    import { Volume2Icon } from "@lucide/svelte";

    interface Props {
        tokens: TokensRouteResponse | null;
        selectedWord: string | null;
        selectedIndex: string;
        handleVoiceClick: (text: string, reading?: string) => void;
    };

    // @ts-expect-error
    let { tokens, selectedWord = $bindable(), selectedIndex = $bindable(), handleVoiceClick }: Props = $props<Props>();
    let searchFullWord = $derived<string>(tokens?.tokens.map((token) => token.surface_form).join('') ?? '');


    function handleWordClick(e: MouseEvent) {
      const target = e.target as HTMLSpanElement;
      selectedWord = target.innerText;
      selectedIndex = target.id;
    }

</script>

<Card.Root class="text-lg">
    <Card.Header>
      <Card.Title class="font-bold">
        Quick Translation:
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-center">{tokens?.quickTranslation.text}</p>
    </Card.Content>

    <Card.Header class="py-0 my-0">
      <Card.Title class="font-bold flex">
        Search:
        <span class="px-2 cursor-pointer" onclick={() => handleVoiceClick(searchFullWord)}>
          <Volume2Icon/>
      </span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="text-xl">
      {#each tokens?.tokens as token, index}
        {#if token.isUseful}
            {@const indexStr = index.toString()}
            <button class="hover:underline cursor-pointer {(selectedIndex === indexStr) ? "text-yellow-400 font-bold underline" : ""}" onclick={(e) => {handleWordClick(e);}} id={indexStr}>
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
