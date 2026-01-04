<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import type { ComponentProps } from "svelte";
    import FieldGroup from "./ui/field/field-group.svelte";
    import Field from "./ui/field/field.svelte";
    import { FieldLabel } from "./ui/field";

	let { ...restProps }: ComponentProps<typeof Card.Root> = $props();
</script>

<!-- DESIGN: Button Color AND App Icon (maybe) -->

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Card.Root>
    <Card.Header class="text-center">
      <Card.Title class="text-xl">Log In</Card.Title>
    </Card.Header>
    <Card.Content>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="email-{id}">Email</FieldLabel>
            <Input
              id="email-{id}"
              type="email"
              placeholder="email@example.com"
              required
            />
          </Field>
          <Field>
            <div class="flex items-center">
              <FieldLabel for="password-{id}">Password</FieldLabel>
              <!-- <a
                href="##"
                class="ms-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a> -->
            </div>
            <Input id="password-{id}" type="password" required />
          </Field>

          <Field class="mt-5">
            <Button type="submit">Login</Button>
          </Field>

          <FieldSeparator
            class="*:data-[slot=field-separator-content]:bg-card mt-2"
          >
            or
          </FieldSeparator>

          <div class="text-center">
            <Button type="button" variant="link"
            style="cursor:pointer" onclick={() => {goto("/register");}}>Register</Button>
          </div>
        </FieldGroup>
      </form>
    </Card.Content>
  </Card.Root>
  <!-- <FieldDescription class="px-6 text-center">
    By clicking continue, you agree to our <a href="##">Terms of Service</a>
    and <a href="##">Privacy Policy</a>.
  </FieldDescription> -->
</div>