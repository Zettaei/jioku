<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { cardPos } from "$lib/constant/cardPos";
  import type { EntriesRouteResponse } from "$lib/types/server/modules/dict/type/dto";
  import type { Entry } from "$lib/types/server/modules/dict/type/model";
    import { fetchVoice } from "../services";
    import EllipsisButton from "./EllipsisButton.svelte";
    import HighlightBox from "./HighlightBox.svelte";
  import { getEntryMetadata } from "./LowerCard";
  import { Volume2Icon } from "@lucide/svelte";

  interface Props {
    entries: EntriesRouteResponse | null;
    handleVoiceClick: (text: string, reading: string | undefined) => void;
  }

  // @ts-expect-error
  let { entries, handleVoiceClick }: Props = $props<Props>();

  $inspect(entries);

  let allItemIds = $derived(
    entries?.result.map((entry) => `item-${entry.ent_seq}`) ?? [],
  );


</script>

<!-- OPTIMIZE: Add close all, open all button/option -->

<div>
  <div class="text-lg mb-4 border-x-8 border-zinc-500 px-4">
    Result Found ({entries?.total ?? 0})
  </div>
  <hr class="border-b mx-2"/>
  {#if entries?.result}
    <Accordion.Root type="multiple" value={allItemIds}>
      {#each entries.result as entry (entry.ent_seq)}
        {@const metadata = getEntryMetadata(entry)}
        <Accordion.Item value="item-{entry.ent_seq}" class="bg-accent rounded-lg">
          <div class="flex justify-between ps-2 h-12">
            <div class="flex space-x-3 items-center">
              
              <div class="text-2xl">{metadata.kanji ?? metadata.reading}</div>
              <div class="text-lg">{!metadata.kanji ? "" : metadata.reading}</div>
              <HighlightBox boxType={metadata.highlight.common}/>
              <!-- <div class="text-md">{metadata.meaning}</div> -->

            </div>
            <div class="flex items-center rounded-md gap-4 pe-4">
              <Volume2Icon class="cursor-pointer h-full" onclick={() => handleVoiceClick(metadata.kanji, metadata.reading)}/>
              <EllipsisButton class="cursor-pointer h-full" entryText={metadata.kanji ?? metadata.reading}/>
              <Accordion.Trigger class="cursor-pointer" />
            </div>
          </div>
          <Accordion.Content class="text-lg flex flex-col ps-2 gap-3 bg-background">
            {@render entryDetail(entry)}
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</div>


{#snippet entryDetail(entry: Entry)}
  {@const kanji = entry.k_ele.map((k_ele) => k_ele.keb)}
  {@const reading = entry.r_ele.map((r_ele) => r_ele.reb)}
  <!-- {@const meaning = entry.sense.map((sense) => sense.gloss.map((gloss) => gloss.text[0]))} -->

  <!-- ALTERNATIVES -->
  <div>
    <span class="font-bold">{"Alternatives:"}</span> 
    <div class="ms-3 mt-1">
      {#each kanji as text}
        <span class="flex me-3 gap-2 items-center">
          {text}
        </span>
      {/each}
    </div>
  </div>

  <!-- READING -->
  <div>
    <span class="font-bold">{"Reading:"}</span> 
    <div class="ms-3 mt-1">
      {#each reading as text}
        <span class="flex me-3">
          {text}
        </span>
      {/each}
    </div>
  </div>

  <!-- MEANING -->
  <div>
    <div class="font-bold">Meaning:</div>
    <div class="ms-3">
      {#each entry.sense as sense}
      <div class="mt-1 mb-3">
        <div class="flex italic">
          <span class="border-s-8 border-zinc-500 ps-3 text-sm">
            {#each sense.pos as pos}
              <span class="me-3">{cardPos.pos[pos]};</span>

            {/each}
        </div>
        {#each sense.gloss as gloss}
          {#each gloss.text as text}
            <span class="me-2">{text};</span>
          {/each}
        {/each}
      </div>
      {/each}
    </div>
  </div>

{/snippet}
