<script lang="ts">
    import { errorState } from '$lib/global/errorState.svelte';
    import { AlertCircleIcon, AlertTriangleIcon } from '@lucide/svelte';
    import { fly } from 'svelte/transition';
</script>

{#if errorState.visible}
    <div 
        transition:fly={{ x: 20, duration: 300 }}
        class="fixed top-1/2 right-2 z-50 flex h-fit max-w-sm items-center gap-3 overflow-hidden rounded-lg border-2 border-red-500 bg-background p-4"
        role="alert"
    >
        <div>
            <AlertCircleIcon/>
        </div>

        <div class="flex-1">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-red-400">Error {errorState.status}</span>
            </div>
            <p class="text-sm">{errorState.message}</p>
        </div>

        <button 
            onclick={() => (errorState.visible = false)}
            class="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

    </div>
{/if}

<!-- <style>
    @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
    }
    .animate-shrink {
        animation: shrink 5000ms linear forwards;
    }
</style> -->