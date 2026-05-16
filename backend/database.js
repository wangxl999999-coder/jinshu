const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'metal_price.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS metals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    unit TEXT NOT NULL,
    description TEXT,
    icon TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS metal_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metal_id INTEGER NOT NULL,
    price REAL NOT NULL,
    change REAL DEFAULT 0,
    change_percent REAL DEFAULT 0,
    fetch_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (metal_id) REFERENCES metals(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    publish_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    metal_id INTEGER NOT NULL,
    threshold REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (metal_id) REFERENCES metals(id),
    UNIQUE(user_id, metal_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    metal_id INTEGER,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    contact TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (metal_id) REFERENCES metals(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_code TEXT UNIQUE NOT NULL,
    is_valid_lead INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
  )`);

  const metals = [
    { name: '黄金', code: 'gold', unit: '元/克', icon: '🥇' },
    { name: '白银', code: 'silver', unit: '元/克', icon: '🥈' },
    { name: '铜', code: 'copper', unit: '元/吨', icon: '🔶' },
    { name: '铁', code: 'iron', unit: '元/吨', icon: '⚫' },
    { name: '铝', code: 'aluminum', unit: '元/吨', icon: '⬜' },
    { name: '锌', code: 'zinc', unit: '元/吨', icon: '🔵' },
    { name: '镍', code: 'nickel', unit: '元/吨', icon: '🟢' },
    { name: '锡', code: 'tin', unit: '元/吨', icon: '🟤' }
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO metals (name, code, unit, icon) VALUES (?, ?, ?, ?)');
  metals.forEach(metal => {
    stmt.run(metal.name, metal.code, metal.unit, metal.icon);
  });
  stmt.finalize();

  db.run(`INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
    ['admin', 'a****@***********', '$2a$10$v/Q1mar4DfQ3LolYThIOouJUUBYMXJkVSay27DuGValbMeOs2127m', 'admin']);
});

module.exports = db;
