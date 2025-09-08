import sqlite3

conn = sqlite3.connect("app.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS screens (
    screen_id INTEGER NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'local',
    widgets_json TEXT NOT NULL,
    PRIMARY KEY (screen_id, user_id)
)
""")

conn.commit()
conn.close()