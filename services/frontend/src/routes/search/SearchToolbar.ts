import { goto } from "$app/navigation";

export async function searchbarSubmit(text: string) {
    goto(`/search/${encodeURIComponent(text)}`, {
        replaceState: true
  });
}
