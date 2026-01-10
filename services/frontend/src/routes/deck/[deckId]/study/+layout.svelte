<script lang="ts">
    import { onMount, setContext } from 'svelte';
    import { getContext } from 'svelte';
    import StudyDeckToolbar from './StudyDeckToolbar.svelte';
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar';
    import { STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContextClass, type StudyDeckToolbarContextInterface } from '$lib/context/studyToolbar.svelte';

    let { children } = $props();

    const StudyDeckToolbarContext = new StudyDeckToolbarContextClass();
    setContext<StudyDeckToolbarContextInterface>(STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContext);

    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);    
        

    onMount(() => {
        setToolbar(toolbarSnippet);
        return () => {
            setToolbar(null);
        };
    });

</script>

{#snippet toolbarSnippet()}
    <StudyDeckToolbar
    
    />
{/snippet}


<div class="flex align-middle justify-center">
    {@render children()}
</div>