<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import Button from "./ui/button/button.svelte";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  import { ListIcon } from "@lucide/svelte";

  const sidebar = useSidebar();

  function toggleSidebar() {
    sidebar.toggle();
  }

  let { toolbarSnippet }: { toolbarSnippet: Snippet | null } = $props();
</script>

<div class="w-full fixed top-0 left-0 right-0 bg-background">
  <nav class="w-full h-full flex items-center justify-between border-b py-1">
    <Button
      variant="ghost"
      size="icon"
      aria-label="Expanded"
      onclick={toggleSidebar}
    >
      <ListIcon />
    </Button>
    <div class="flex gap-2">
      {#if toolbarSnippet}
        {@render toolbarSnippet()}
      {/if}
    </div>
  </nav>
</div>
