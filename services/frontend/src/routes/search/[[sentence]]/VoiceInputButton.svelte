<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { MicIcon, LoaderCircleIcon } from "@lucide/svelte";
    import { fetchTokensSpeechtotext } from "../services";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";
    import { lang } from "$lib/i18n";
    import { bgtext2 } from "$lib/stores/bgtext";
    import { bgtexthover } from "$lib/utils/bgtext";

    interface Props {
        query: string;
        isListening: boolean;
        isProcessing: boolean;
        translationLang: TranslationLanguage;
        onSubmit: (result: TokensRouteResponse) => void;
        isFirstPage?: boolean;
    }

    // @ts-expect-error
    let { query = $bindable(), isListening = $bindable(), isProcessing = $bindable(), translationLang, onSubmit, isFirstPage = false }: Props = $props<Props>();

    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];

    async function startListening() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(t => t.stop());

                isListening = false;
                isProcessing = true;

                try {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const result = await fetchTokensSpeechtotext(audioBlob, "jp", translationLang);
                    if (result.param) {
                        query = result.param;
                        onSubmit(result);
                    }
                } catch (err) {
                    // silently fail - query stays as is
                } finally {
                    isProcessing = false;
                }
            };

            mediaRecorder.start(100); // Collect data every 100ms
            isListening = true;

        } catch (err) {
            // Microphone permission denied or unavailable
            isListening = false;
        }
    }

    function stopListening() {
        mediaRecorder?.stop();
    }

    function handleClick() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }
</script>

{#if isFirstPage}
    <div>
        <Button
            class="w-full cursor-pointer"
            variant={isListening ? "destructive" : "outline"}
            onclick={handleClick}
            disabled={isProcessing}
            title={isListening ? $lang.search.voiceInput.stopRecording : $lang.search.voiceInput.searchByVoice}
            onmouseenter={bgtexthover(bgtext2, ">> Speech To Text")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
        >
            {#if isProcessing}
                <LoaderCircleIcon size={20} class="animate-spin" />
            {:else}
                <MicIcon size={20} class={isListening ? "animate-pulse" : ""} />
            {/if}

            <span>{$lang.search.voiceInput.label}</span>
        </Button>
    </div>
{:else}
    <div>
        <Button
            class="cursor-pointer"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onclick={handleClick}
            disabled={isProcessing}
            title={isListening ? $lang.search.voiceInput.stopRecording : $lang.search.voiceInput.searchByVoice}
        >
            {#if isProcessing}
                <LoaderCircleIcon size={20} class="animate-spin" />
            {:else}
                <MicIcon size={20} class={isListening ? "animate-pulse" : ""} />
            {/if}
        </Button>
    </div>
{/if}
