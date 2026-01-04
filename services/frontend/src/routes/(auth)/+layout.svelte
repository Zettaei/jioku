<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import { userStore } from "$lib/stores/auth";

	let { children } = $props();

    onMount(() => {
        // TODO: check if user already logged in, if yes redirect to other page
    });

</script>

<!-- DESIGN: add halftone pattern, for both themes -->

<div>
    {@render children?.()}
</div>