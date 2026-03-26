import type { Database } from './generatedTypes.js'

// Convenience aliases
export type DeckRow = Database['public']['Tables']['decks']['Row'];
export type DeckInsert = Database['public']['Tables']['decks']['Insert'];
export type DeckUpdate = Database['public']['Tables']['decks']['Update'];

export type CardRow = Database['public']['Tables']['cards']['Row'];
export type CardInsert = Database['public']['Tables']['cards']['Insert'];
export type CardUpdate = Database['public']['Tables']['cards']['Update'];

export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];