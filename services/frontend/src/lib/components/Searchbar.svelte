<script lang="ts">
  import { SearchIcon } from "@lucide/svelte";
  import * as InputGroup from "./ui/input-group/index.js";

  interface Props {
    query: string;
  }

  export let query: string;
</script>

<InputGroup.Root>
  <InputGroup.Input
  size={60}
    bind:value={query}
    type="search"
    placeholder="Search..."
  />
  <InputGroup.Addon>
    <SearchIcon class="" />
  </InputGroup.Addon>
</InputGroup.Root>
