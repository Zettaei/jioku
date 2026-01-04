import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { ConnectionError, HttpError } from "$lib/errors/HttpError";
import { userState } from "$lib/global/userState.svelte";
import type { DeckRow } from "$lib/types/server/core/supabase/type";
import type { PaginatedResponse } from "$lib/types/server/modules/deck/type/dto";
import type { GetDecksStudyRouteResponse } from "$lib/types/server/modules/deck/type/study_dto";

export async function fetchUserDecks()
: Promise< GetDecksStudyRouteResponse >
{
    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/study/decks?timezone=${userState.timezone}`,
                // {
                //     credentials: "include",
                // }
            )
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }
    
            return await fetchData.json();
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}