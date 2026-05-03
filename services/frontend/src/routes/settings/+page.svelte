<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { userStore, isLoggedInStore } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { saveTimezone, logout } from "./services";
    import { timeZoneOptions } from "$lib/constant/timezone";
    import { UserIcon, ChevronDown } from "@lucide/svelte";
    import Confirmation from "$lib/components/Confirmation.svelte";
    import { bgtexthover } from "$lib/utils/bgtext";
    import { bgtext2 } from "$lib/stores/bgtext";

    let selectedTimezone = $state("");
    let timezoneSearch = $state("");
    let isDropdownOpen = $state(false);
    let isConfirmationOpen = $state(false);

    let filteredTimeZones = $derived.by(() => {
        if (!timezoneSearch) return timeZoneOptions;
        return timeZoneOptions.filter(opt =>
            opt.label.toLowerCase().includes(timezoneSearch.toLowerCase())
        );
    });

    $effect(() => {
        if ($userStore?.timezone) 
            selectedTimezone = $userStore.timezone;
        else
            selectedTimezone = "Asia/Bangkok";
    });

    let isSaving = $state(false);
    let saveError = $state("");
    let saveSuccess = $state(false);

    function handleSelectTimezone(tz: string) {
        selectedTimezone = tz;
        isDropdownOpen = false;
        timezoneSearch = "";
    }

    async function handleSaveTimezone() {
        isSaving = true;
        saveError = "";
        saveSuccess = false;
        await saveTimezone(
            selectedTimezone,
            () => {
                userStore.update(u => u ? { ...u, timezone: selectedTimezone } : u);
                saveSuccess = true;
                setTimeout(() => { saveSuccess = false; }, 2000);
            },
            (error) => {
                saveError = error;
            }
        );
        isSaving = false;
    }

    async function handleLogout() {
        isConfirmationOpen = true
    }
</script>

<Confirmation 
    title="Logout"
    message={"Proceed to logout of user \"" + $userStore?.username + "\""}
    onConfirm={async () => {
        try {
            await logout();
        } catch {

        }
        goto("/login");
    }}
    onCancel={() => {}}
    bind:open={isConfirmationOpen}
/>

<svelte:head>
  <title>ACCOUNT SETTINGS{$userStore?.username ? ": " + $userStore?.username : ""}</title>
</svelte:head>

<div class="mx-auto max-w-xl py-8 px-4">
    <div class="pagetitle text-start mb-6">
        <span>ACCOUNT</span>
        <span>SETTINGS</span>
    </div>
    <Card.Root>
        <!-- User info at top -->
        <Card.Header class="flex flex-row items-center gap-3 pb-4 border-b">
            <div>Username:</div>
            <div>
                <p class="font-semibold">{$userStore?.username ?? ""}</p>
            </div>
        </Card.Header>

        <Card.Content class="mb-8">
            <!-- Timezone -->
            <div class="space-y-2">
                <label for="timezone-trigger" class="text-sm font-medium">Timezone</label>
                <div class="">
                    <button
                        id="timezone-trigger"
                        onclick={() => { isDropdownOpen = !isDropdownOpen; }}
                        disabled={isSaving}
                        class={(isDropdownOpen ? "rounded-t-md rounded-b-none" : "rounded-md") + " w-full border border-input rounded-md px-3 py-2 text-left bg-background hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-between"}
                    >
                        <span>{timeZoneOptions.find(o => o.name === selectedTimezone)?.label ?? selectedTimezone}</span>
                        <ChevronDown size={16} class="transition-transform {isDropdownOpen ? 'rotate-180' : ''}" />
                    </button>
                    
                    {#if isDropdownOpen}
                        <div class="border border-input rounded-b-md overflow-hidden">
                            <Input 
                                type="text" 
                                placeholder="Search timezone..." 
                                bind:value={timezoneSearch}
                                disabled={isSaving}
                                class="w-full border-0 border-b border-input rounded-none focus-visible:ring-0"
                                autofocus
                            />
                            <div class="max-h-60 overflow-y-auto bg-background">
                                {#if filteredTimeZones.length > 0}
                                    {#each filteredTimeZones as opt (opt.name)}
                                        <button
                                            class="w-full text-left px-3 py-2 hover:bg-accent cursor-pointer transition-colors {selectedTimezone === opt.name ? 'bg-accent font-semibold' : ''}"
                                            onclick={() => handleSelectTimezone(opt.name)}
                                            disabled={isSaving}
                                        >
                                            {opt.label}
                                        </button>
                                    {/each}
                                {:else}
                                    <div class="px-3 py-2 text-xs text-muted-foreground">
                                        No timezones found
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                {#if saveError}
                    <p class="text-sm text-destructive">{saveError}</p>
                {/if}
                {#if saveSuccess}
                    <p class="text-sm text-green-600 dark:text-green-400">Timezone saved!</p>
                {/if}

                <Button
                    class="w-full cursor-pointer"
                    onclick={handleSaveTimezone}
                    disabled={isSaving}
                    onmouseenter={bgtexthover(bgtext2, ">> SAVE TIMEZONE")}
                    onmouseleave={bgtexthover(bgtext2)}
                    onmouseup={bgtexthover(bgtext2)}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </Card.Content>

        <!-- Logout at bottom -->
        <Card.Footer class="border-t pt-4">
            <Button
                class="w-full cursor-pointer"
                variant="destructive"
                onclick={handleLogout}
                onmouseenter={bgtexthover(bgtext2, ">> LOG OUT")}
                onmouseleave={bgtexthover(bgtext2)}
                onmouseup={bgtexthover(bgtext2)}
            >
                Log Out
            </Button>
        </Card.Footer>
    </Card.Root>
</div>
