<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";
    import { Volume2Icon } from "@lucide/svelte";

    interface Props {
        text: string;
        reading?: string;
        onClick: (text: string, reading?: string) => void;
        class?: string;
    }

    let { text, reading, onClick, class: className = "" }: Props = $props();

    function handleClick() {
        onClick(text, reading);
    }
</script>

<Button variant="outline" size="icon-lg" 
class={"cursor-pointer px-3" + className} 
onclick={handleClick} role="button" 
onmouseenter={bgtexthover(bgtext2, ">> Text To Speech")}
onmouseleave={bgtexthover(bgtext2)}
onmouseup={bgtexthover(bgtext2)}
                        >
    <Volume2Icon />
</Button>
