<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { userStore } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { logout, updateSettings } from "../(auth)/services";
    import { timeZones } from "$lib/constant/timezone";
    import { UserIcon } from "@lucide/svelte";

    let user = $derived($userStore);
    let selectedTimezone = $state("Asia/Bangkok");
    $effect(() => {
        if (user?.timezone) selectedTimezone = user.timezone;
    });
    let isSaving = $state(false);
    let saveError = $state("");
    let saveSuccess = $state(false);

    async function handleSaveTimezone() {
        isSaving = true;
        saveError = "";
        saveSuccess = false;
        try {
            await updateSettings({ timezone: selectedTimezone });
            userStore.update(u => u ? { ...u, timezone: selectedTimezone } : u);
            saveSuccess = true;
            setTimeout(() => { saveSuccess = false; }, 2000);
        } catch (err: any) {
            saveError = err.message ?? "Failed to save timezone.";
        } finally {
            isSaving = false;
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // clear client state regardless
        }
        userStore.set(null);
        goto("/login");
    }
</script>

<div class="container mx-auto max-w-md py-8 px-4">
    <div class="pagetitle text-start mb-6">
        <span>ACCOUNT</span>
        <span>SETTINGS</span>
    </div>
    <Card.Root>
        <!-- User info at top -->
        <Card.Header class="flex flex-row items-center gap-3 pb-4 border-b">
            <div>Username:</div>
            <div>
                <p class="font-semibold">{user?.username ?? ""}</p>
            </div>
        </Card.Header>

        <Card.Content class="space-y-6">
            <!-- Timezone -->
            <div class="space-y-2">
                <label for="timezone-select" class="text-sm font-medium">Timezone</label>
                <Select.Root type="single" bind:value={selectedTimezone} disabled={isSaving} name="timezone-select">
                    <Select.Trigger class="w-full" id="timezone-select">{selectedTimezone}</Select.Trigger>
                    <Select.Content class="max-h-60 overflow-y-auto">
                        <Select.Group>
                            <Select.Label>Select your timezone</Select.Label>
                            {#each timeZones as tz (tz)}
                                <Select.Item value={tz}>{tz}</Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

                {#if saveError}
                    <p class="text-sm text-destructive">{saveError}</p>
                {/if}
                {#if saveSuccess}
                    <p class="text-sm text-green-600 dark:text-green-400">Timezone saved!</p>
                {/if}

                <Button
                    class="w-full"
                    onclick={handleSaveTimezone}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>
        </Card.Content>

        <!-- Logout at bottom -->
        <Card.Footer class="border-t pt-4">
            <Button
                class="w-full"
                variant="destructive"
                onclick={handleLogout}
            >
                Log Out
            </Button>
        </Card.Footer>
    </Card.Root>
</div>
