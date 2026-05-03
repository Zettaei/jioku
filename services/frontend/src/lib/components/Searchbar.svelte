<script lang="ts">
  import { SearchIcon } from "@lucide/svelte";
  import * as InputGroup from "./ui/input-group/index.js";

  interface Props {
    query: string;
    placeholder?: string;
    class?: string;
  }

  let { query = $bindable(), placeholder = "Search...", class: className = "" }: Props = $props();
</script>

<InputGroup.Root class={className}>
  <InputGroup.Input
    size={60}
    bind:value={query}
    type="search"
    placeholder={placeholder}
  />
  <InputGroup.Addon>
    <SearchIcon class="" />
  </InputGroup.Addon>
</InputGroup.Root>
