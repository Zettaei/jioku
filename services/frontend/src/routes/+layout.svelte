<script lang="ts">

	import { ModeWatcher } from "mode-watcher";
	import './layout.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "../lib/components/AppSidebar.svelte";
    import { onMount, setContext, type Snippet } from "svelte";
    import AppToolbar from "$lib/components/AppToolbar.svelte";
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from "$lib/context/toolbar";
	import { userStore } from "$lib/stores/auth";
    import { errorState } from '$lib/global/errorState.svelte';
    import ErrorPopup from "./ErrorPopup.svelte";

	let toolbarSnippet: Snippet | null = $state(null);

    const setToolbar: ToolbarSetter = (snippet: Snippet | null) => {
        toolbarSnippet = snippet;
    };

    setContext(TOOLBAR_SNIPPET_CONTEXT, setToolbar);


    onMount(() => {
        window.onerror = (msg) => {
            errorState.show(String(msg), 500);
        };

        window.onunhandledrejection = (event) => {

            const msg = event.reason?.message || "Unhandled Promise Rejection";
            const status = event.reason?.status || 500;
            errorState.show(msg, status);
        };
    });


	let isOpen = $state(false);
    let { children } = $props();
	
</script>

<ModeWatcher/>

<ErrorPopup />

<Sidebar.Provider bind:open={isOpen}>
	<AppSidebar />
	<div class="w-full">
		<div>
			<AppToolbar toolbarSnippet={toolbarSnippet}/>
		</div>

		<main class="container mx-auto px-2 mt-18 mb-40">
			{@render children()}
		</main>
	</div>

</Sidebar.Provider>

