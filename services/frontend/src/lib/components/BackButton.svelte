<script lang="ts">
    import { ArrowLeftIcon } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
    import { useSidebar } from "./ui/sidebar";
    
    interface Props {
        onclick: () => void;
    }

    let { onclick }: Props = $props<Props>();

    const sidebar = useSidebar();

</script>

<Button variant="ghost" class="absolute left-0"
    onclick={onclick} >
    <ArrowLeftIcon/>
    {#if !sidebar.isMobile}
        Back
    {/if}
</Button>