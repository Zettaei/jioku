---------------### THIS IS FOR SUPABASE ONLY
---------------### copy these code to run on supabase sql query

-- -------------------------
-- Profiles
-- -------------------------

CREATE SCHEMA IF NOT EXISTS public;


CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::jsonb
);

-- -------------------------
-- Decks
-- -------------------------
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    users_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    headers JSONB '{}'::jsonb,
    headerOrder JSONB '[]'::jsonb,
    -- headerCount SMALLINT NOT NULL,   likely not needed, probably
    settings '{}'::jsonb,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decks_users_id ON public.decks(users_id);

-- -------------------------
-- Cards
-- -------------------------
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decks_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    data JSONB '{}'::jsonb,
    status SMALLINT NOT NULL,
    due TIMESTAMPTZ NOT NULL,
    interval INT NOT NULL,
    easeFactor SMALLINT NOT NULL,
    repetition INT NOT NULL,
    totalReviews INT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cards_decks_id ON public.cards(decks_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON public.cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_due ON public.cards(due);


-- -------------------------
-- Stats Daily
-- -------------------------
CREATE TABLE IF NOT EXISTS public.dailyStats (
    cards_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    timeSpent INT NOT NULL,
    accuracy SMALLINT NOT NULL,
    count SMALLINT NOT NULL,
    PRIMARY KEY (cards_id, date)
);
CREATE INDEX IF NOT EXISTS idx_dailyStats_cards_id ON public.dailyStats(cards_id);
