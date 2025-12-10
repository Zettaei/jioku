---------------### THIS IS FOR SUPABASE ONLY
---------------### copy these code to run on supabase sql query

-- -------------------------
-- Profiles
-- -------------------------

CREATE SCHEMA IF NOT EXISTS jioku;


CREATE TABLE IF NOT EXISTS jioku.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    settings JSONB
);

-- -------------------------
-- Decks
-- -------------------------
CREATE TABLE IF NOT EXISTS jioku.decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    users_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    headers JSONB NOT NULL,
    headerOrder JSONB NOT NULL,
    headerCount SMALLINT NOT NULL,
    settings JSONB,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decks_users_id ON jioku.decks(users_id);

-- -------------------------
-- Cards
-- -------------------------
CREATE TABLE IF NOT EXISTS jioku.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decks_id UUID NOT NULL REFERENCES jioku.decks(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status SMALLINT NOT NULL,
    due TIMESTAMPTZ NOT NULL,
    interval INT NOT NULL,
    easeFactor SMALLINT NOT NULL,
    repetition INT NOT NULL,
    totalReviews INT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cards_decks_id ON jioku.cards(decks_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON jioku.cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_due ON jioku.cards(due);


-- -------------------------
-- Stats Daily
-- -------------------------
CREATE TABLE IF NOT EXISTS jioku.dailyStats (
    cards_id UUID NOT NULL REFERENCES jioku.cards(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    timeSpent INT NOT NULL,
    accuracy SMALLINT NOT NULL,
    count SMALLINT NOT NULL,
    PRIMARY KEY (cards_id, date)
);
CREATE INDEX IF NOT EXISTS idx_dailyStats_cards_id ON jioku.dailyStats(cards_id);