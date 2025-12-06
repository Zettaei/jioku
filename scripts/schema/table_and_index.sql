-- -------------------------
-- Users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    settings JSONB
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -------------------------
-- Decks
-- -------------------------
CREATE TABLE IF NOT EXISTS decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    users_id UUID,
    headers JSONB NOT NULL,
    headerOrder JSONB NOT NULL,
    headerCount SMALLINT NOT NULL,
    settings JSONB,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_decks_users_id ON decks(users_id);

-- -------------------------
-- Cards
-- -------------------------
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decks_id UUID NOT NULL,
    data JSONB NOT NULL,
    status SMALLINT NOT NULL,
    due TIMESTAMPTZ NOT NULL,
    interval INT NOT NULL,
    easeFactor SMALLINT NOT NULL,
    repetition INT NOT NULL,
    totalReviews INT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (decks_id) REFERENCES decks(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_cards_decks_id ON cards(decks_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(due);

-- -------------------------
-- Refresh Tokens
-- -------------------------
CREATE TABLE IF NOT EXISTS refreshTokens (
    users_id UUID NOT NULL,
    token TEXT NOT NULL,
    expired TIMESTAMPTZ NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (users_id, token),
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_refreshTokens_token ON refreshTokens(token);


-- -------------------------
-- Stats Daily
-- -------------------------
CREATE TABLE IF NOT EXISTS dailyStats (
    cards_id UUID NOT NULL,
    timeSpent INT NOT NULL,
    accuracy SMALLINT NOT NULL,
    count SMALLINT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (cards_id, date),
    FOREIGN KEY (cards_id) REFERENCES cards(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_dailyStats_cards_id ON dailyStats(cards_id);