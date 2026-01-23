<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Accordion from "$lib/components/ui/accordion/index";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { CardRow } from "$lib/types/server/core/supabase/type";

    interface Header {
        key: string;  
        label: string;
    }

    interface Props {
        isOpen: boolean;
        headers: Array<Header>;
        onSave: (data: {
            card: Record<string, string>
        }) => void;
    }

    // @ts-expect-error
    let { isOpen = $bindable(), headers = [], onSave }: Props = $props<Props>();

    let editingData = $state<Pick<CardRow, "data">>({
      data: {} as Record<string, string>
    });
    let lastIsOpen = $state(false);


    $effect(() => {
        // Only initialize when isOpen changes from false to true
        if (isOpen && !lastIsOpen) {
            const newData: Pick<CardRow, "data"> = {
              data: {} as Record<string, string>
            };

            headers?.forEach(header => {
              (newData.data as Record<string, string>)[header.key] = "";
            });

            editingData = newData;
            lastIsOpen = true;
        } else if (!isOpen) {
            lastIsOpen = false;
        }
    });

    function handleSave() {
        console.log(editingData);
        if (onSave) {
            onSave({
                card: editingData as Record<string, string>
            });
        }
        isOpen = false;
    }

    function handleCancel() {
        isOpen = false;
    }

</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
            <Dialog.Title class="text-center">Add New Card</Dialog.Title>
        </Dialog.Header>

        <div class="space-y-6 py-4">
            <Accordion.Root value={["card-data"]}>
                <!-- Card Data Fields (in headerOrder) -->
                <Accordion.Item value="card-data">
                    <Accordion.Trigger class="py-3 cursor-pointer">Card Data</Accordion.Trigger>
                    <Accordion.Content>
                        <div class="space-y-4 pt-4">
                            {#each headers as header}
                                <div class="space-y-2">
                                    <label for={header.key} class="text-sm font-medium">
                                        {header.label}
                                    </label>
                                    <textarea
                                        id={header.key}
                                        bind:value={(editingData.data as Record<string, string>)[header.key]}
                                        class="w-full min-h-9 px-3 py-2 border rounded-md text-sm resize-y dark:text-black"
                                        rows="1"
                                    >
                                    </textarea>
                                </div>
                            {/each}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>

        <Dialog.Footer>
            <Button onclick={handleSave} class="cursor-pointer py-5">
                Add Card
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
