<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index";
  import { cn } from "$lib/utils";

  interface Props {
    isFrontSide: boolean;
    onGradeClick: () => void;
  }

  // @ts-expect-error
  let { isFrontSide = $bindable(), onGradeClick }: Props = $props<Props>();

  const GRADE_BUTTON_BASE_STYLE = cn(
        "h-full flex-4/12 hover:bg-accent cursor-pointer",
        "bg-transparent dark:text-white text-black"
    );


  function handleShowClick() {
    isFrontSide = false;
  }

</script>


<Card.Footer class="w-full flex h-12 mt-20">

  {#if isFrontSide} <!-- QUESTION SIDE -->

    <button 
      class={cn(
        GRADE_BUTTON_BASE_STYLE,
        "border-4 border-yellow-400 rounded-md"
      )}
      onclick={handleShowClick}
    >
      Show Answer
    </button>
  


  {:else} <!-- ANSWER SIDE -->

    <button
      class={cn(
        GRADE_BUTTON_BASE_STYLE,
        "border-4 border-red-500 border-r-0 rounded-l-md",
      )}
    >
      Again
      </button>
    <button
      class={cn(
        GRADE_BUTTON_BASE_STYLE,
        "border-y-4 border-yellow-200 rounded-none",
      )}
    >
      Hard
    </button>
    <button
      class={cn(
        GRADE_BUTTON_BASE_STYLE,
        "border-4 border-green-400 border-l-0 rounded-r-md",
      )}
    >
      Good
    </button>

  {/if}

</Card.Footer>
