<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index";
    import type { DeckEditableData } from "$lib/types/deck";
    import DeckMetadataForm from "./DeckMetadataForm.svelte";

    interface Props {
        onSave: (data: DeckEditableData) => void;
        onCancel: () => void;
    }

    // @ts-expect-error
    let { onSave , onCancel }: Props = $props<Props>();

    function handleCancel() {
        onCancel();
    }

    function handleSave(deckData: DeckEditableData) {
        onSave(deckData);
    }

    function handleOpenChange(open: boolean) {
        if(!open) {
            onCancel();
        }
    }
</script>


<Dialog.Root open={true} onOpenChange={handleOpenChange}>
    <Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
            <Dialog.Title class="text-center">Create New Deck</Dialog.Title>
        </Dialog.Header>

        <DeckMetadataForm mode="add" onSave={handleSave} onCancel={handleCancel}
        saveButtonVisible={true} cancelButtonVisible={true} />

    </Dialog.Content>
</Dialog.Root>
