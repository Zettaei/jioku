<script lang="ts">
    import { TranslationLanguageFullname } from "$lib/types/search";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model.js"; 
    import * as Select from "$lib/components/ui/select/index";
    import { lang } from "$lib/i18n";

    interface Props {
      translationLang: TranslationLanguage;
      isFirstPage?: boolean;
    }

    let { translationLang = $bindable(), isFirstPage = false }: Props = $props();
</script>

{#if isFirstPage}
    <div class="flex items-center">
        <div class="text-muted-foreground me-2">{$lang.search.translation.label} </div>
        <Select.Root type="single" bind:value={translationLang}>
            <Select.Trigger class="w-48">{TranslationLanguageFullname[translationLang]}</Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value={TranslationLanguage.English}>{ TranslationLanguageFullname[TranslationLanguage.English] }</Select.Item>
                <Select.Item value={TranslationLanguage.Thai}>{ TranslationLanguageFullname[TranslationLanguage.Thai] }</Select.Item>

              </Select.Group>
            </Select.Content>
        </Select.Root>
    </div>
{:else}
    <Select.Root type="single" bind:value={translationLang}>
        <Select.Trigger class="w-48">{TranslationLanguageFullname[translationLang]}</Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>{$lang.search.translation.label}</Select.Label>
            <Select.Item value={TranslationLanguage.English}>{ TranslationLanguageFullname[TranslationLanguage.English] }</Select.Item>
            <Select.Item value={TranslationLanguage.Thai}>{ TranslationLanguageFullname[TranslationLanguage.Thai] }</Select.Item>

          </Select.Group>
        </Select.Content>
    </Select.Root>
{/if}