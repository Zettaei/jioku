import type { Writable } from "svelte/store";

export function bgtexthover(store: Writable<string>, value: string = '')
: () => void 
{
    return () => store.set(value);
}