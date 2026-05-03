<script lang="ts">

    // NOTE: Auth system kinda junky, might be good to make use of SvelteKit's load() so it would run that before the page

	import { ModeWatcher, mode } from "mode-watcher";
	import './layout.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "../lib/components/AppSidebar.svelte";
    import { onMount, setContext, type Snippet } from "svelte";
    import AppToolbar from "$lib/components/AppToolbar.svelte";
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from "$lib/context/toolbar";
    import { errorState } from '$lib/global/errorState.svelte';
    import ErrorPopup from "./ErrorPopup.svelte";
    import SuccessPopup from "./SuccessPopup.svelte";
    import { tokenCheck } from "./(auth)/services";
	import { getCookie, deleteCookie } from "$lib/utils/cookie";
	import { setupFetchInterceptor } from "$lib/utils/fetchInterceptor";
    import AppFooter from "$lib/components/AppFooter.svelte";
    import { bgtext1, bgtext2 } from "$lib/stores/bgtext";

	let toolbarSnippet: Snippet | null = $state(null);

    const setToolbar: ToolbarSetter = (snippet: Snippet | null) => {
        toolbarSnippet = snippet;
    };

    setContext(TOOLBAR_SNIPPET_CONTEXT, setToolbar);


    onMount(async () => {
        // Set up global fetch interceptor for 401 handling and token refresh
        setupFetchInterceptor();

        window.onerror = (msg) => {
            errorState.show(String(msg), 500);
        };

        // NOTE: return message maybe a bit too vague "401 Server return error" really?
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
<SuccessPopup />

<svelte:head>
    <title>JIOKU</title>
</svelte:head>

<div class={mode.current === "dark" ? "jioku_background_dark" : "jioku_background_light"}>
    <div class="absolute right-10 top-18 text-[0.5rem] avantgarde text-end text-accent-foreground/40">
        <div class="flex-col">
            <div class="">{$bgtext1.toUpperCase()}</div>
            <div class="">{$bgtext2.toUpperCase()}</div>
        </div>
    </div>

    <!-- TODO: move anything not AppSidebar out so the sidebar not affect the whole app -->

    <Sidebar.Provider bind:open={isOpen} class="p-0">
        <AppSidebar />
        <div class="w-full h-full">
            <div>
                <AppToolbar toolbarSnippet={toolbarSnippet}/>
            </div>

            <div>
                <div class="container- mx-auto px-8 mt-24 mb-12">
                    {@render children()}

                </div>
            </div>
            
        </div>
        
    </Sidebar.Provider>

    <AppFooter/>
</div>




