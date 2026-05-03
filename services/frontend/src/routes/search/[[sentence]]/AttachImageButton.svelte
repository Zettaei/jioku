<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { PaperclipIcon } from "@lucide/svelte";
    import { lang } from "$lib/i18n";
    import { bgtext1, bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";

    interface Props {
        image: File | null;
        isFirstPage?: boolean;
    }

    // @ts-expect-error
    let { image = $bindable(), isFirstPage = false }: Props = $props<Props>();

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

{#if isFirstPage}
    <div>
        <input 
            type="file" 
            class="hidden" 
            accept="image/*" 
            bind:this={fileInput}
            onchange={handleImageUpload}
        />

        <Button
            class="w-full cursor-pointer"
            variant="outline"
            size="icon"
            onclick={() => fileInput?.click()}
            onmouseenter={bgtexthover(bgtext2, ">> Optical Character Recognition")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
        >
            <PaperclipIcon size={20}/>
            <span>
                {$lang.search.attachImage.label}
            </span>
        </Button>
    </div>

{:else}
    <input 
        type="file" 
        class="hidden" 
        accept="image/*" 
        bind:this={fileInput}
        onchange={handleImageUpload}
    />

    <Button
        class="cursor-pointer"
        variant="outline"
        size="icon"
        onclick={() => fileInput?.click()}
    >
        <PaperclipIcon size={20}/>
    </Button>
{/if}