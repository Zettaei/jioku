<script lang="ts">
    import { get } from "svelte/store";
    import { goto } from "$app/navigation";
    import { userStore, authInitialized } from "$lib/stores/auth";

	let { children } = $props();

    $effect(() => {
        if (get(authInitialized)) {
            const user = get(userStore);
            if (user) {
                goto("/deck");
            }
        }
    });
</script>

<!-- DESIGN: add halftone pattern, for both themes -->

<div>
    {@render children?.()}
</div>