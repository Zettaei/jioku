<script lang="ts">
    import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/auth";


    let user = $derived($userStore);
    let isLoggedIn = $derived(user !== null);

</script>

<div class="z-30 border-t-4 w-full pt-4 pb-8 px-12 gap-x-6 flex justify-end items-end bg-background gap-4">
    <div class="avantgardecebook font-bold text-sm accent-foreground">J I O K U</div>
    <div class="flex flex-col text-md ps-6 border-s-1 border-accent-foreground">
        <div class="text-sm avantgarde font-bold border-b-2 mb-2">NAVIGATION</div>
        <div class="flex flex-col gap-1 text-muted-foreground">
            {@render link("search", "/search")}
            {#if isLoggedIn}
                {@render link("deck", "/deck")}
                {@render link("settings", "/settings")}
            {:else}
                {@render link("login", "/login")}
                {@render link("register", "/register")}
            {/if}
            
        </div>
    </div>
</div>

{#snippet link(name: string, link: string)}
    <a class="hover:text-foreground" href={link}>
        {name}
    </a>
{/snippet}