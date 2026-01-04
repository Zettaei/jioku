import type { Snippet } from "svelte";

export type ToolbarSetter = (snippet: Snippet<[]> | null) => void;
export const TOOLBAR_SNIPPET_CONTEXT = "toolbar_snippet_context" as const;