<script lang="ts">
  import { SearchIcon } from "@lucide/svelte";
  import * as InputGroup from "./ui/input-group/index.js";

  interface Props {
    query: string;
    placeholder?: string;
  }

  export let query: string;
  export let placeholder: string = "Search...";
</script>

<InputGroup.Root>
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
