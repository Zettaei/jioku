import type { DeckRow } from '$lib/types/server/core/supabase/type.js';
import type { GetDeckByIdRouteResponse } from '$lib/types/server/modules/deck/type/deck_dto';
import { fetchDeckByDeckId } from '../../services';

// export async function load({ params })
// : Promise<{ deckId: string, deck: GetDeckByIdRouteResponse }>
// {
//     const deckId = params.deckId;
//     const fetchData = await fetchDeckByDeckId(deckId);

//     return {
//         deckId: deckId,
//         deck: fetchData
//     }
// }