<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { PaperclipIcon } from "@lucide/svelte";

    interface Props {
        image: File | null;
    }

    // @ts-expect-error
    let { image = $bindable() }: Props = $props<Props>();

    // just for clickable
    let fileInput: HTMLInputElement | undefined = $state();

    function handleImageUpload(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) return;

        // Update the bound prop directly
        image = target.files[0];

        target.value = "";
    }
</script>

<input 
    type="file" 
    class="hidden" 
    accept="image/*" 
    bind:this={fileInput}
    onchange={handleImageUpload}
/>

<Button
    variant="outline"
    size="icon"
    onclick={() => fileInput?.click()}
>
    <PaperclipIcon size={20}/>
</Button>