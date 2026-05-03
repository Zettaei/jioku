<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { lang } from "$lib/i18n";

  interface Props {
    title: string;
    message: string;
    open: boolean;
    onConfirm: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
  }

  let {
    title,
    message,
    open = $bindable(false),
    onConfirm,
    onCancel,
  }: Props = $props();

  function handleConfirm() {
    onConfirm?.();
    open = false;
  }

  function handleCancel() {
    onCancel?.();
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>
        {message}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={handleCancel}>{$lang.common.no}</Button>
      <Button variant="destructive" onclick={handleConfirm}>{$lang.common.yes}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
