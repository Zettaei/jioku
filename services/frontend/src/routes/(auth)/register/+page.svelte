<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldError,
    FieldSeparator,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ChevronDown } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { successState } from "$lib/global/successState.svelte";
  import { register } from "../services";
  import { timeZoneOptions } from "$lib/constant/timezone";
  import { getCookie } from "$lib/utils/cookie";
    import { bgtexthover } from "$lib/utils/bgtext";
    import { bgtext2 } from "$lib/stores/bgtext";

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let timezone = $state("");
  let timezoneSearch = $state("");
  let isTimezoneDropdownOpen = $state(false);
  let filteredTimezones = $derived.by(() => {
    if (!timezoneSearch) return timeZoneOptions;
    return timeZoneOptions.filter(opt =>
      opt.label.toLowerCase().includes(timezoneSearch.toLowerCase())
    );
  });
  let isLoading = $state(false);

  let usernameError = $state("");
  let emailError = $state("");
  let passwordError = $state("");
  let confirmPasswordError = $state("");
  let formError = $state("");

  function validate(): boolean {
    usernameError = "";
    emailError = "";
    passwordError = "";
    confirmPasswordError = "";
    formError = "";
    let valid = true;
    if (!username) { usernameError = "Username is required"; valid = false; }
    if (!email) { emailError = "Email is required"; valid = false; }
    if (!password) { passwordError = "Password is required"; valid = false; }
    else if (password.length < 8) { passwordError = "Password must be at least 8 characters"; valid = false; }
    if (!confirmPassword) { confirmPasswordError = "Please confirm your password"; valid = false; }
    else if (password !== confirmPassword) { confirmPasswordError = "Passwords do not match"; valid = false; }
    return valid;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!validate()) return;
    isLoading = true;
    formError = "";
    try {
      await register({ username, email, password, timezone });
      successState.show("Account created! Please log in.");
      goto("/login");
    } catch (err: any) {
      formError = err.message ?? "Registration failed. Please try again.";
    } finally {
      isLoading = false;
      bgtexthover(bgtext2);
    }
  }
</script>

<svelte:head>
  <title>REGISTER</title>
</svelte:head>

<div class="flex flex-col items-center justify-center pt-12">
  <div class="flex w-full max-w-md flex-col gap-6">
    <div class="pagetitle">REGISTER</div>
    <div class="flex flex-col">
      <Card.Root>
        <Card.Content>
          <form onsubmit={handleSubmit}>
            <FieldGroup class="gap-4">
              <Field>
                <FieldLabel for="register-username">Username</FieldLabel>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="username"
                  bind:value={username}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={usernameError ? [{ message: usernameError }] : []} />
              </Field>
              <Field>
                <FieldLabel for="register-email">Email</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="email@example.com"
                  bind:value={email}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={emailError ? [{ message: emailError }] : []} />
              </Field>
              <Field>
                <FieldLabel for="register-password">Password</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  bind:value={password}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={passwordError ? [{ message: passwordError }] : []} />
              </Field>
              <Field>
                <FieldLabel for="register-confirm-password">Confirm Password</FieldLabel>
                <Input
                  id="register-confirm-password"
                  type="password"
                  bind:value={confirmPassword}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={confirmPasswordError ? [{ message: confirmPasswordError }] : []} />
              </Field>

              <!-- TODO: make it that searchable timezone dropdown-like -->
              <Field class="mb-12">
                <FieldLabel>Timezone</FieldLabel>
                <div>
                  <button
                    type="button"
                    onclick={() => { isTimezoneDropdownOpen = !isTimezoneDropdownOpen; }}
                    disabled={isLoading}
                    class={(isTimezoneDropdownOpen ? "rounded-t-md rounded-b-none" : "rounded-md") + " w-full border border-input px-3 py-2 text-left bg-background hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-between items-center"}
                  >
                    <span>{(timeZoneOptions.find(o => o.name === timezone)?.label ?? timezone) || "Select timezone..."}</span>
                    <ChevronDown size={16} class="transition-transform {isTimezoneDropdownOpen ? 'rotate-180' : ''}" />
                  </button>

                  {#if isTimezoneDropdownOpen}
                    <div class="border border-input rounded-b-md overflow-hidden">
                      <Input
                        type="text"
                        placeholder="Search timezone..."
                        bind:value={timezoneSearch}
                        disabled={isLoading}
                        class="w-full border-0 border-b border-input rounded-none focus-visible:ring-0"
                        autofocus
                      />
                      <div class="max-h-60 overflow-y-auto bg-background">
                        {#if filteredTimezones.length > 0}
                          {#each filteredTimezones as opt (opt.name)}
                            <button
                              type="button"
                              class="w-full text-left px-3 py-2 hover:bg-accent cursor-pointer transition-colors {timezone === opt.name ? 'bg-accent font-semibold' : ''}"
                              onclick={() => { timezone = opt.name; isTimezoneDropdownOpen = false; timezoneSearch = ""; }}
                              disabled={isLoading}
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
              </Field>

              {#if formError}
                <p class="text-sm text-destructive">{formError}</p>
              {/if}

              <Field class="mt-2">
                <Button type="submit" disabled={isLoading}
                  class="cursor-pointer"
                  onmouseenter={bgtexthover(bgtext2, ">> Register")}
                  onmouseleave={bgtexthover(bgtext2)}
                  onmouseup={bgtexthover(bgtext2)}>
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </Field>

              <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card mt-2">
                or
              </FieldSeparator>

              <div class="text-center">
                <Button
                  type="button"
                  variant="link"
                  class="cursor-pointer"
                  onclick={() => goto("/login")}
                  onmouseenter={bgtexthover(bgtext2, ">> Go To Login")}
                  onmouseleave={bgtexthover(bgtext2)}
                  onmouseup={bgtexthover(bgtext2)}
                >Log In</Button>
              </div>
            </FieldGroup>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
