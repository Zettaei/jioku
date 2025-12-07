type Timestampz = string;

export interface UserSettings {
  language: string | null;
}

export interface DeckSettings {
  newPerDay: number | null;
  duePerDay: number | null;
  statusOrder: string | null;
}

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Timestampz;
  updatedAt: Timestampz;
  settings?: UserSettings;
}

export interface Deck {
  id: string;
  name: string;
  users_id: string | null;
  headers: Record<string, any>;
  headerOrder: string[];
  headerCount: number;
  settings?: DeckSettings;
  createdAt: Timestampz;
  updatedAt: Timestampz;
}

export interface Card {
  id: string;
  decks_id: string;
  data: Record<string, any>;
  status: number;
  due: Timestampz;
  interval: number;
  easeFactor: number;
  repetition: number;
  totalReviews: number;
  createdAt: Timestampz;
  updatedAt: Timestampz;
}

export interface RefreshToken {
  users_id: string;
  token: string;
  expired: Timestampz;
  createdAt: Timestampz;
}

export interface DailyStat {
  cards_id: string;
  timeSpent: number;
  accuracy: number;
  count: number;
  date: Timestampz;
}