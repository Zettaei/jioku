<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import type { EntriesRouteResponse } from "$lib/types/server/modules/dict/type/dto";
  import { getEntryMetadata } from "./LowerCard";
  import { Ellipsis } from "@lucide/svelte";

  interface Props {
    entries: EntriesRouteResponse | null;
  }

  // @ts-expect-error
  let { entries }: Props = $props<Props>();

  let allItemIds = $derived(
    entries?.result.map((entry) => `item-${entry.ent_seq}`) ?? [],
  );
</script>

<!-- OPTIMIZE: Add close all, open all button/option -->
<!-- TODO: I FORGOR THE PAGINATION OR INFINTIE SCROLL OR WHATEVER -->

<div>
  <div class="text-lg mb-4 border-x-8 border-zinc-500 px-4">
    Result Found ({entries?.total ?? 0})
  </div>
  <hr class="mb-0" />
  {#if entries?.result}
    <Accordion.Root type="multiple" value={allItemIds}>
      {#each entries.result as entry (entry.ent_seq)}
        {@const item = getEntryMetadata(entry)}
        <Accordion.Item value="item-{entry.ent_seq}">
          <div class="flex justify-between h-12">
            <div class="flex space-x-5 items-center">
              <div class="text-2xl">{item.kanji ?? item.reading}</div>
              <div class="text-xl">{!item.kanji ? "" : item.reading}</div>
            </div>
            <div class="flex items-center rounded-md border gap-4">
              <div class="cursor-pointer ps-4">
                <Ellipsis />
              </div>
              <Accordion.Trigger class="pe-4 cursor-pointer" />
            </div>
          </div>
          <Accordion.Content>
            {item.definition ?? "No definition found."}
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</div>
