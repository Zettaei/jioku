---------------### THIS IS FOR SUPABASE ONLY
---------------### copy these code to run on supabase sql query

CREATE SCHEMA IF NOT EXISTS public;

-- -------------------------.
-- Profiles
-- -------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- -------------------------
-- Decks
-- -------------------------
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    users_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    headersData JSONB NOT NULL DEFAULT '{}'::jsonb,
    headersOrder JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- headerCount SMALLINT NOT NULL,           likely not needed, probably
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decks_users_id ON public.decks(users_id);

-- -------------------------
-- Cards
-- -------------------------
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decks_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status SMALLINT NOT NULL DEFAULT 0,
    due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    interval INT NOT NULL DEFAULT 0,
    easeFactor SMALLINT NOT NULL DEFAULT 25,       -- 13 - 25 (1.3 - 2.5)
    repetition INT NOT NULL DEFAULT 0,
    totalReviews INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cards_decks_id ON public.cards(decks_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON public.cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_due ON public.cards(due);


-- -------------------------
-- Reviews
-- TODO: add schedule partitioning later
-- -------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    cards_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    timeSpent INT NOT NULL,
    quality SMALLINT NOT NULL,
    createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cards_id, createdat)
);