<script lang="ts">
  import { langStore, type LangKey } from "$lib/i18n";
  import * as Select from "$lib/components/ui/select/index.js";

  const options: { value: LangKey; label: string }[] = [
    { value: "en", label: "English" },
    { value: "th", label: "ภาษาไทย" },
  ];
</script>

<Select.Root
  type="single"
  value={$langStore}
  onValueChange={(v) => v && langStore.set(v as LangKey)}
>
  <Select.Trigger class="w-36">
    {options.find((o) => o.value === $langStore)?.label ?? "Language"}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each options as option}
        <Select.Item value={option.value}>{option.label}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
