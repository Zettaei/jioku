<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion/index";
  import { onMount } from "svelte";

  interface Props {
    image: File;
  }

  // @ts-expect-error
  let { image }: Props = $props<Props>();

  let imageUrl = $state<string>("");

  function compressImage(file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.7): Promise<Blob> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxWidth;
              height = Math.round(maxWidth / aspectRatio);
            } else {
              height = maxHeight;
              width = Math.round(maxHeight * aspectRatio);
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  onMount(() => {
    (async () => {
      const compressedBlob = await compressImage(image);
      imageUrl = URL.createObjectURL(compressedBlob);
    })();

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  });
</script>

<Accordion.Root type="single" class="w-full border rounded-lg overflow-hidden">
  <Accordion.Item value="image-view" class="border-none">
    
    <Accordion.Trigger class="px-2 hover:bg-accent hover:no-underline transition">
      <div class="flex items-center gap-4">
        {#if imageUrl}
          <img src={imageUrl} alt="thumbnail" class="w-10 h-10 object-cover rounded border" />
        {/if}
        <span class="">Uploaded Image</span>
      </div>
    </Accordion.Trigger>

    <Accordion.Content class="p-4">
      {#if imageUrl}
        <img 
          src={imageUrl} 
          alt="full view" 
          class="w-full h-auto object-contain rounded-md shadow-sm" 
        />
      {:else}
        <div class="h-40 flex items-center justify-center text-muted-foreground italic">
          Loading image...
        </div>
      {/if}
    </Accordion.Content>

  </Accordion.Item>
</Accordion.Root>