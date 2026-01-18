-- Users table for authentication
CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    username TEXT, -- Optional, for display
    currentChallenge TEXT, -- For WebAuthn challenge tracking
    public_key_credentials TEXT, -- JSON string of registered authenticators
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Badges table (Static data, but good to have in DB for dynamic updates)
CREATE TABLE IF NOT EXISTS Badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rarity TEXT DEFAULT 'common', -- common, uncommon, rare, legendary
    description TEXT,
    image_url TEXT,
    location_lat REAL,
    location_lng REAL
);

-- UserBadges table (Collection tracking)
CREATE TABLE IF NOT EXISTS UserBadges (
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    acquired_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (badge_id) REFERENCES Badges(id),
    PRIMARY KEY (user_id, badge_id)
);

-- Initial Data Seeding
INSERT INTO Badges (id, name, rarity, description, image_url) VALUES 
('shiramine', 'Shiramine', 'legendary', 'Home of Dinosaurs and Snow', '/assets/badges/1_白峰村.png'),
('oguchi', 'Oguchi', 'rare', 'Nature and Dams', '/assets/badges/2_尾口村（仮）.png'),
('yoshinodani', 'Yoshinodani', 'rare', 'Forests and Woodworking', '/assets/badges/3_吉野谷村.png'),
('torigoe', 'Torigoe', 'rare', 'Historic Castle Views', '/assets/badges/4_鳥越村.png'),
('kawachi', 'Kawachi', 'uncommon', 'Rivers and Gorges', '/assets/badges/5_河内村.png'),
('tsurugi', 'Tsurugi', 'uncommon', 'Shrines and Gateways', '/assets/badges/6_鶴来町.png'),
('matto', 'Matto', 'common', 'City Center and Commerce', '/assets/badges/7_松任市.png'),
('mikawa', 'Mikawa', 'uncommon', 'Port and Seafood', '/assets/badges/8_美川町.png');
