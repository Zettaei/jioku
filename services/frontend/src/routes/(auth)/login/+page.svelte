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
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/auth";
  import { login } from "../services";
  import { getCookie } from "$lib/utils/cookie";
    import { bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";

  let email = $state("");
  let password = $state("");
  let isLoading = $state(false);

  let emailError = $state("");
  let passwordError = $state("");
  let formError = $state("");

  function validate(): boolean {
    emailError = "";
    passwordError = "";
    formError = "";
    let valid = true;
    if (!email) { emailError = "Email is required"; valid = false; }
    if (!password) { passwordError = "Password is required"; valid = false; }
    return valid;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!validate()) return;
    isLoading = true;
    formError = "";
    try {
      const result = await login({ email, password });
      userStore.set({ username: result.username, role: "member", timezone: result.timezone });
      goto("/deck");
    } catch (err: any) {
      formError = err.message ?? "Login failed. Please check your credentials.";
    } finally {
      isLoading = false;
      bgtexthover(bgtext2);
    }
  }
</script>

<svelte:head>
  <title>LOGIN</title>
</svelte:head>

<div class="flex flex-col items-center justify-start">
  <div class="flex w-full max-w-md flex-col gap-6 pt-40">
    <div class="pagetitle">LOGIN</div>
    <div class="flex flex-col gap-6">
      <Card.Root class="py-8">
        <Card.Content>
          <form onsubmit={handleSubmit}>
            <FieldGroup class="gap-4">
              <Field>
                <FieldLabel for="login-email">Email</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  bind:value={email}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={emailError ? [{ message: emailError }] : []} />
              </Field>
              <Field class="mb-8">
                <FieldLabel for="login-password">Password</FieldLabel>
                <Input
                  id="login-password"
                  type="password"
                  bind:value={password}
                  disabled={isLoading}
                  required
                />
                <FieldError errors={passwordError ? [{ message: passwordError }] : []} />
              </Field>

              {#if formError}
                <p class="text-sm text-destructive">{formError}</p>
              {/if}

              <Field class="mt-2">
                <Button type="submit" disabled={isLoading}
                  onmouseenter={bgtexthover(bgtext2, ">> Login")}
                  onmouseleave={bgtexthover(bgtext2)}
                  onmouseup={bgtexthover(bgtext2)}
                >
                  {isLoading ? "Logging in..." : "Login"}
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
                  onclick={() => goto("/register")}
                  onmouseenter={bgtexthover(bgtext2, ">> Go To Register")}
                  onmouseleave={bgtexthover(bgtext2)}
                  onmouseup={bgtexthover(bgtext2)}
                >Register</Button>
              </div>
            </FieldGroup>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
