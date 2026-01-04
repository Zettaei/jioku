<script lang="ts">
import * as Card from "$lib/components/ui/card/index.js";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";

    interface Props {
        tokens: TokensRouteResponse | null;
        selectedWord: string | null;
        selectedIndex: string;
    };

    // @ts-expect-error
    let { tokens, selectedWord = $bindable(), selectedIndex = $bindable() }: Props = $props<Props>();
    
    function handleWordClick(e: MouseEvent) {
      const target = e.target as HTMLSpanElement;
      selectedWord = target.innerText;
      selectedIndex = target.id;
    }

</script>

<Card.Root>
    <Card.Header>
      <Card.Title class="font-bold">Quick Translation:</Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-center text-lg">{tokens?.quickTranslation.text}</p>
    </Card.Content>

    <Card.Header>
      <Card.Title class="font-bold">Search:</Card.Title>
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
