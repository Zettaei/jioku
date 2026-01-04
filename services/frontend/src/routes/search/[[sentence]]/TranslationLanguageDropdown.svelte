<script lang="ts">
    import { TranslationLanguageFullname } from "$lib/types/search";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model.js"; 
    import * as Select from "$lib/components/ui/select/index";

    interface Props {
      translationLang: TranslationLanguage;
    }

    export let translationLang: TranslationLanguage;
</script>

<Select.Root type="single" bind:value={translationLang}>
    <Select.Trigger class="w-[280px]">{TranslationLanguageFullname[translationLang]}</Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label>Translate into</Select.Label>
        <Select.Item value={TranslationLanguage.English}>{ TranslationLanguageFullname[TranslationLanguage.English] }</Select.Item>
        <Select.Item value={TranslationLanguage.Thai}>{ TranslationLanguageFullname[TranslationLanguage.Thai] }</Select.Item>

      </Select.Group>
    </Select.Content>
</Select.Root>