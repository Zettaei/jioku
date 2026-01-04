<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Accordion from "$lib/components/ui/accordion/index";
    import type { CardRow } from "$lib/types/server/core/supabase/type";
    import { cardExtraHeaderName, cardExtraHeaderOrder } from "$lib/constant/cardExtraRows";
    import { getCardExtraValue, isJsonObject, convertTimeToUser } from "./utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Trash2Icon } from "@lucide/svelte";

    interface Header {
        key: string;
        label: string;
    }

    interface Props {
      selectedCard: CardRow | null;
      headers: Header[] | undefined;
      onSave?: (cardId: string, data: Pick<CardRow, "data">) => void;
    }


    // @ts-expect-error
    let { selectedCard = $bindable(), headers = [], onSave }: Props = $props<Props>();


    let open = $derived(!!selectedCard);  // convert to boolean
    let editingData = $state<Record<string, any>>({});

    $effect(() => {
        if (open && selectedCard) {
            editingData = { ...selectedCard.data as {} };
        }
    });

    function handleSave() {
        if (selectedCard) {
            if (onSave) {
                onSave(selectedCard.id, { data: editingData });
            }
            selectedCard = null;
        }
    }

    function handleCancel() {
        selectedCard = null;
    }

</script>


<Dialog.Root bind:open>
  <Dialog.Content class="max-w-4xl max-h-[90vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title class="text-center">Edit Card</Dialog.Title>
    </Dialog.Header>
    
    <!-- {#if card} -->
      <div class="space-y-6 py-4">
        <Accordion.Root value={["card-data", "card-metrics"]}>
          <!-- Card Data Fields (in headerOrder) -->
          <Accordion.Item value="card-data">
            <Accordion.Trigger class="py-3 cursor-pointer">Card Data</Accordion.Trigger>
            <Accordion.Content>
              <div class="space-y-4 pt-4">
                {#if isJsonObject(selectedCard?.data)}
                  {#each headers as header}
                    <div class="space-y-2">
                      <label for={header.key} class="text-sm font-medium">
                        {header.label}
                      </label>
                      <textarea
                        id={header.key}
                        bind:value={editingData[header.key]}
                        class="w-full min-h-9 px-3 py-2 border rounded-md text-sm resize-y dark:text-black"
                        rows="1"
                      >
                      </textarea>
                    </div>
                  {/each}
                {/if}
              </div>
            </Accordion.Content>
          </Accordion.Item>

          <!-- Extra Card Fields (Read-only) -->
          <Accordion.Item value="card-metrics">
            <Accordion.Trigger class="py-3 cursor-pointer">Card Metrics</Accordion.Trigger>
            <Accordion.Content>
              <div class="space-y-4 pt-4">
                <div class="grid grid-cols-2 gap-4">
                  {#each cardExtraHeaderOrder as headerKey}
                    <div class="space-y-2">
                      <label class="text-sm font-medium">
                        {cardExtraHeaderName[headerKey]}
                      </label>
                      <input
                        type="text"
                        value={getCardExtraValue(selectedCard, headerKey)}
                        disabled
                        class="w-full px-3 py-2 border rounded-md text-sm bg-muted disabled:cursor-not-allowed"
                      />
                    </div>
                  {/each}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      <Dialog.Footer>
        <!-- <Button variant="destructive" class="cursor-pointer py-3">
          <Trash2Icon/>
        </Button> -->
        <Button
          onclick={handleSave}
          class="cursor-pointer py-5 w-full"
        >
          Save
        </Button>
      </Dialog.Footer>
    <!-- {/if} -->
  </Dialog.Content>
</Dialog.Root>