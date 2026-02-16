<script lang="ts">
    import { ArrowLeftIcon } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
    import { useSidebar } from "./ui/sidebar";
    import { goto } from "$app/navigation";
    import type { assert } from "console";
    
    interface Props {
        destination: string;
        sessionStorageKey?: string | undefined;
        onclick?: () => void | undefined;
    }

    let { destination, sessionStorageKey, onclick = () => {} }: Props = $props();

    const returnUrl = sessionStorage.getItem(sessionStorageKey as string);
    const isValidReturnUrl: boolean = (() => 
    {
        if (!returnUrl) return false;

        try {
            const target = new URL(returnUrl, window.location.origin);

            if (target.origin === window.location.origin &&
                target.pathname.startsWith(destination)
            ) {
                return true;
            }

        } catch {};
        
        return false;
    })();

    const sidebar = useSidebar();

    export function click() {
        onclick();
        if(isValidReturnUrl) {
            return goto(returnUrl!, { keepFocus: true });
        }
        return goto(destination);
    }

</script>

<Button variant="ghost" class="cursor-pointer"
        onclick={click}
    >
    <ArrowLeftIcon/>
    {#if !sidebar.isMobile}
        Back
    {/if}
</Button>