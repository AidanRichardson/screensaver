from fastapi import APIRouter, Depends, HTTPException, Query
from app.db import get_db
import json

router = APIRouter()

# Get widgets for a screen
@router.get("/screens/{screen_id}")
def get_screen(
    screen_id: int,
    user_id: str = Query("local"),
    db=Depends(get_db)
):
    cur = db.cursor()
    cur.execute(
        "SELECT widgets_json FROM screens WHERE screen_id=? AND user_id=?",
        (screen_id, user_id)
    )
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Screen not found")
    return json.loads(row["widgets_json"])

@router.post("/screens/{screen_id}")
def save_screen(
    screen_id: int,
    widgets: list[dict],
    user_id: str = Query("local"),
    db=Depends(get_db)
):
    cur = db.cursor()
    cur.execute(
        """
        INSERT OR REPLACE INTO screens (screen_id, user_id, widgets_json)
        VALUES (?, ?, ?)
        """,
        (screen_id, user_id, json.dumps(widgets))
    )
    db.commit()
    return {"ok": True}
