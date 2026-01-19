CREATE TABLE IF NOT EXISTS UserBadges (
    userId TEXT,
    badgeId TEXT,
    claimedAt INTEGER,
    PRIMARY KEY (userId, badgeId)
);

CREATE TABLE IF NOT EXISTS Users (
    userId TEXT PRIMARY KEY,
    avatarId INTEGER DEFAULT 1,
    createdAt INTEGER
);
