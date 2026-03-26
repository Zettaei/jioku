<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldError,
    FieldSeparator,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { goto } from "$app/navigation";
  import { successState } from "$lib/global/successState.svelte";
  import { register } from "../services";
  import { timeZones } from "$lib/constant/timezone";
  import { getCookie } from "$lib/utils/cookie";

  // Check is_loggedin cookie immediately and redirect
  if (getCookie("is_loggedin") === "true") {
    goto("/deck");
  }

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let timezone = $state("");
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
    }
  }
</script>

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Card.Header class="text-center">
          <Card.Title class="text-xl">Create Account</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onsubmit={handleSubmit}>
            <FieldGroup>
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
              <Field>
                <FieldLabel>Timezone</FieldLabel>
                <Select.Root type="single" bind:value={timezone} disabled={isLoading}>
                  <Select.Trigger class="w-full">{timezone}</Select.Trigger>
                  <Select.Content class="max-h-60 overflow-y-auto">
                    <Select.Group>
                      <Select.Label>Select your timezone</Select.Label>
                      {#each timeZones as tz (tz)}
                        <Select.Item value={tz}>{tz}</Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Field>

              {#if formError}
                <p class="text-sm text-destructive">{formError}</p>
              {/if}

              <Field class="mt-2">
                <Button type="submit" disabled={isLoading}>
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
                  style="cursor:pointer"
                  onclick={() => goto("/login")}
                >Log In</Button>
              </div>
            </FieldGroup>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
