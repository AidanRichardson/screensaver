import sqlite3

conn = sqlite3.connect("app.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS widgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0,
    w INTEGER DEFAULT 1,
    h INTEGER DEFAULT 1
)
""")

conn.commit()
conn.close()
print("✅ Database initialized")
