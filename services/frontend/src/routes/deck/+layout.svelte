<script lang="ts">
    import { goto } from "$app/navigation";
    import { userStore, authInitialized } from "$lib/stores/auth";

    let { children } = $props();

    // Reactive references to stores
    let user = $derived($userStore);
    let authInit = $derived($authInitialized);

    // Redirect to login if user becomes null (after auth init)
    $effect(() => {
        if (authInit && !user) {
            goto("/login");
        }
    });
</script>

{@render children()}
