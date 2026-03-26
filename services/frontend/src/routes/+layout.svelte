<script lang="ts">

    // NOTE: Auth system kinda junky, might be good to make use of SvelteKit's load() so it would run that before the page

	import { ModeWatcher } from "mode-watcher";
	import './layout.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "../lib/components/AppSidebar.svelte";
    import { onMount, setContext, type Snippet } from "svelte";
    import AppToolbar from "$lib/components/AppToolbar.svelte";
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from "$lib/context/toolbar";
	import { userStore, authInitialized } from "$lib/stores/auth";
    import { errorState } from '$lib/global/errorState.svelte';
    import ErrorPopup from "./ErrorPopup.svelte";
    import SuccessPopup from "./SuccessPopup.svelte";
    import { tokenCheck } from "./(auth)/services";
	import { getCookie, deleteCookie } from "$lib/utils/cookie";
	import { setupFetchInterceptor } from "$lib/utils/fetchInterceptor";

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

        // Check if user has is_loggedin cookie — skip API call if not present
        const isLoggedInCookie = getCookie("is_loggedin");

        if (isLoggedInCookie === "true") {
            try {
                const result = await tokenCheck();
                userStore.set({ username: result.username, role: "member", timezone: result.timezone });
            } catch {
                // Token invalid/expired, clear user state and remove cookie
                userStore.set(null);
            }
        } else {
            userStore.set(null);
        }

        authInitialized.set(true);
    });


	let isOpen = $state(false);
    let { children } = $props();
	
</script>

<ModeWatcher/>

<ErrorPopup />
<SuccessPopup />

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

