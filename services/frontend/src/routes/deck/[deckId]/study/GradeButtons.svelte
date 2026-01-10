<script lang="ts">
  import * as Card from "$lib/components/ui/card/index";
  import { cn } from "$lib/utils";
  import { onMount, onDestroy } from "svelte";

  interface Props {
    isFrontSide: boolean;
    onGradeClick: (timeSpent: number, quality: number) => void;
  }

  let { isFrontSide = $bindable(), onGradeClick }: Props = $props();

  // --- TIMER LOGIC ---
  let startTime = Date.now();
  let now = $state(Date.now());
  let timerInterval: any;

  // Calculate elapsed seconds
  let elapsedSeconds = $derived(Math.floor((now - startTime) / 1000));

  function startTimer() {
    startTime = Date.now();
    now = Date.now();
    timerInterval = setInterval(() => {
      now = Date.now();
    }, 1000);
  }

  function handleGrade(quality: number) {
    const finalTime = elapsedSeconds;
    // Stop/Reset logic if needed, then send to parent
    onGradeClick(finalTime, quality);

    // Reset timer for next card
    startTime = Date.now();
    now = Date.now();
  }

  onMount(() => startTimer());
  onDestroy(() => clearInterval(timerInterval));

  // --- STYLES ---
  const GRADE = { again: 2, hard: 3, good: 5 } as const;
  const GRADE_BUTTON_BASE_STYLE = cn(
    "h-full flex-1 hover:bg-accent cursor-pointer transition-colors",
    "bg-transparent dark:text-white text-black flex flex-col items-center justify-center",
  );
</script>

<Card.Footer class="w-full flex flex-col h-20 mt-20">


      <div class="w-full text-end pe-1 text-xs text-muted-foreground tabular-nums mb-3">
        {Math.floor(elapsedSeconds / 60)
          .toString()
          .padStart(2, "0")}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
      </div>

    <div class="flex w-full h-full">
    {#if isFrontSide}
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-4 border-yellow-400 rounded-md w-full",
        )}
        onclick={() => (isFrontSide = false)}
      >
        Show Answer
      </button>
    {:else}
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-4 border-red-500 border-r-0 rounded-l-md",
        )}
        onclick={() => handleGrade(GRADE.again)}
      >
        Again
      </button>
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-y-4 border-yellow-200 rounded-none",
        )}
        onclick={() => handleGrade(GRADE.hard)}
      >
        Hard
      </button>
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-4 border-green-400 border-l-0 rounded-r-md w-full",
        )}
        onclick={() => handleGrade(GRADE.good)}
      >
        Good
      </button>
    {/if}
    </div>
</Card.Footer>
