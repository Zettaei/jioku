<script lang="ts">
  import * as Card from "$lib/components/ui/card/index";
  import { cn } from "$lib/utils";
  import { onMount, onDestroy } from "svelte";
  import type { CardRow } from "$lib/types/server/core/supabase/type";
    import { bgtexthover } from "$lib/utils/bgtext";
    import { bgtext2 } from "$lib/stores/bgtext";

  interface Props {
    isFrontSide: boolean;
    currentCard: CardRow;
    onGradeClick: (timeSpent: number, quality: number) => void;
  }

  let { isFrontSide = $bindable(), currentCard, onGradeClick }: Props = $props();

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

  // --- SM-2 INTERVAL ESTIMATION ---
  // Mirrors the calculate_sm2 SQL function (easefactor stored as integer * 10)
  function estimateNextInterval(quality: number): string {
    if (quality === GRADE.again) {
      return "0d";
    }

    const interval = currentCard.interval ?? 0;
    const easefactorRaw = currentCard.easefactor ?? 25; // stored as int * 10
    const repetition = currentCard.repetition ?? 0;

    let ef = easefactorRaw / 10;
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;
    if (ef > 2.5) ef = 2.5;

    let nextInterval: number;
    if (quality < 3) {
      nextInterval = 1;
    } else {
      const nextRep = repetition + 1;
      if (nextRep === 1)      nextInterval = 1;
      else if (nextRep === 2) nextInterval = 3;
      else if (nextRep === 3) nextInterval = 7;
      else                    nextInterval = Math.round(interval * ef);
    }

    if (nextInterval < 1)  return "<1d";
    if (nextInterval === 1) return "1d";
    if (nextInterval < 30)  return `${nextInterval}d`;
    if (nextInterval < 365) return `${Math.round(nextInterval / 30)}mo`;
    return `${(nextInterval / 365).toFixed(1)}y`;
  }

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
        onmouseenter={bgtexthover(bgtext2, ">> Show Answer")}
        onmouseleave={bgtexthover(bgtext2)}
        onmouseup={bgtexthover(bgtext2)}
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
        onmouseenter={bgtexthover(bgtext2, ">> Grade This Card 'Again'")}
        onmouseleave={bgtexthover(bgtext2)}
        onmouseup={bgtexthover(bgtext2)}
      >
        <span>Again</span>
        <span class="text-xs text-muted-foreground">{estimateNextInterval(GRADE.again)}</span>
      </button>
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-y-4 border-yellow-200 rounded-none",
        )}
        onclick={() => handleGrade(GRADE.hard)}
        onmouseenter={bgtexthover(bgtext2, ">> Grade This Card 'Hard'")}
        onmouseleave={bgtexthover(bgtext2)}
        onmouseup={bgtexthover(bgtext2)}
      >
        <span>Hard</span>
        <span class="text-xs text-muted-foreground">{estimateNextInterval(GRADE.hard)}</span>
      </button>
      <button
        class={cn(
          GRADE_BUTTON_BASE_STYLE,
          "border-4 border-green-400 border-l-0 rounded-r-md w-full",
        )}
        onclick={() => handleGrade(GRADE.good)}
          onmouseenter={bgtexthover(bgtext2, ">> Grade This Card 'Good'")}
        onmouseleave={bgtexthover(bgtext2)}
        onmouseup={bgtexthover(bgtext2)}
      >
        <span>Good</span>
        <span class="text-xs text-muted-foreground">{estimateNextInterval(GRADE.good)}</span>
      </button>
    {/if}
    </div>
</Card.Footer>
