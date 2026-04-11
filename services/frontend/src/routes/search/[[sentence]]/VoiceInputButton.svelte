<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { MicIcon, LoaderCircleIcon } from "@lucide/svelte";
    import { fetchTokensSpeechtotext } from "../services";
    import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";
    import type { TokensRouteResponse } from "$lib/types/server/modules/dict/type/dto";

    interface Props {
        query: string;
        isListening: boolean;
        isProcessing: boolean;
        translationLang: TranslationLanguage;
        onSubmit: (result: TokensRouteResponse) => void;
    }

    // @ts-expect-error
    let { query = $bindable(), isListening = $bindable(), isProcessing = $bindable(), translationLang, onSubmit }: Props = $props<Props>();

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

<Button
    variant={isListening ? "destructive" : "outline"}
    size="icon"
    onclick={handleClick}
    disabled={isProcessing}
    title={isListening ? "Stop recording" : "Search by voice"}
>
    {#if isProcessing}
        <LoaderCircleIcon size={20} class="animate-spin" />
    {:else}
        <MicIcon size={20} class={isListening ? "animate-pulse" : ""} />
    {/if}
</Button>
