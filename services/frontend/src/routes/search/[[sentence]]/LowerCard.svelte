<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { cardPos } from "$lib/constant/cardPos";
  import type { EntriesRouteResponse } from "$lib/types/server/modules/dict/type/dto";
  import type { Entry } from "$lib/types/server/modules/dict/type/model";
  import { fetchVoice } from "../services";
  import EllipsisButton from "./EllipsisButton.svelte";
  import HighlightBox from "./HighlightBox.svelte";
  import VolumeButton from "./VolumeButton.svelte";
  import { getEntryMetadata } from "./LowerCard";
  import { lang } from "$lib/i18n";
    import { bgtext1, bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";

  interface Props {
    entries: EntriesRouteResponse | null;
    handleVoiceClick: (text: string, reading: string | undefined) => void;
  }

  let { entries, handleVoiceClick }: Props = $props();

  $inspect(entries);

  let allItemIds = $derived(
    entries?.result.map((entry) => `item-${entry.ent_seq}`) ?? [],
  );
</script>

<!-- OPTIMIZE: Add close all, open all button/option -->

<div class="mb-8">
  <div
    class="avantgarde text-lg font-bold mb-4 border-x-8 border-zinc-500 px-4"
  >
    <span>{$lang.card.resultFound}</span>
    ( {entries?.total ?? 0} )
  </div>
  <hr class="border-b mx-2" />

  {#if entries?.result}
    <Accordion.Root type="multiple" value={allItemIds} class="flex flex-col mt-4">
      {#each entries.result as entry (entry.ent_seq)}
        {@const metadata = getEntryMetadata(entry)}
        {@const allKanji = entry.k_ele.map((k) => k.keb).join("; ")}
        {@const allReading = entry.r_ele.map((r) => r.reb).join("; ")}
        {@const meaning = entry.sense
          .map((sense) => {
            const posStr =
              sense.pos.length > 0
                ? `[${sense.pos.map((p) => cardPos.pos[p]).join("; ")}]`
                : "";
            const glossStr = sense.gloss
              .flatMap((g) => g.text ?? [])
              .join(", ");
            return posStr ? `${posStr};\n${glossStr};` : `${glossStr};`;
          })
          .join("\n")}
        <Accordion.Item
          value="item-{entry.ent_seq}"
          class="bg-accent rounded-lg overflow-hidden border border-border/40"
          onmouseenter={bgtexthover(bgtext1, metadata.kanji ?? metadata.reading)}
          onmouseleave={bgtexthover(bgtext1)}
        >
          <!-- Accordion Header Row -->
          <div class="flex justify-between items-center ps-4 pe-3 py-2 min-h-14">
            <div class="flex items-baseline gap-3 flex-1 min-w-0">
              <div class="text-2xl font-semibold leading-none shrink-0">{metadata.kanji ?? metadata.reading}</div>
              {#if metadata.kanji}
                <div class="text-base opacity-70 shrink-0">{metadata.reading}</div>
              {/if}
              <HighlightBox boxType={metadata.highlight.common} />
            </div>

            
            <div class="flex items-center gap-1 shrink-0">
              <VolumeButton
                text={metadata.kanji ?? metadata.reading}
                reading={metadata.reading}
                onClick={handleVoiceClick}
              />
              <EllipsisButton
                entryText={allKanji}
                kanji={allKanji}
                reading={allReading}
                {meaning}
              />
              <Accordion.Trigger class="cursor-pointer ps-4 pe-2" />
            </div>
          </div>

          <Accordion.Content class="text-base bg-background">
            <div class="px-4 py-4 flex flex-col gap-4">
              {@render entryDetail(entry)}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</div>

{#snippet entryDetail(entry: Entry)}
  {@const kanji = entry.k_ele.map((k_ele) => k_ele.keb)}
  {@const reading = entry.r_ele.map((r_ele) => r_ele.reb)}

  <!-- ALTERNATIVES -->
  {#if kanji.length > 0}
    <div>
      <div class="text-sm font-bold uppercase tracking-wide opacity-60 mb-1">{$lang.card.alternatives}</div>
      <div class="flex flex-wrap gap-x-3 gap-y-1 ms-1">
        {#each kanji as text}
          <span>{text}</span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- READING -->
  {#if reading.length > 0}
    <div>
      <div class="text-sm font-bold uppercase tracking-wide opacity-60 mb-1">{$lang.card.reading}</div>
      <div class="flex flex-wrap gap-x-3 gap-y-1 ms-1">
        {#each reading as text}
          <span>{text}</span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- MEANING -->
  <div>
    <div class="text-sm font-bold uppercase tracking-wide opacity-60 mb-2">{$lang.card.meaning}</div>
    <div class="flex flex-col gap-3 ms-1">
      {#each entry.sense as sense}
        <div>
          {#if sense.pos.length > 0}
            <div class="border-s-4 border-zinc-500 ps-3 text-sm italic opacity-70 mb-1">
              {#each sense.pos as pos}
                <span class="me-2">{cardPos.pos[pos]};</span>
              {/each}
            </div>
          {/if}
          <div class="ps-1">
            {#each sense.gloss as gloss}
              {#each gloss.text as text}
                <span class="me-2">{text};</span>
              {/each}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}
