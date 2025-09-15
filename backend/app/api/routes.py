from fastapi import APIRouter, Depends, HTTPException, Query
from app.db import get_db
import json

router = APIRouter()


@router.get("/screens")
def get_screens(
    user_id: str = Query("local"),
    db=Depends(get_db)
):
    cur = db.cursor()
    cur.execute(
        "SELECT screen_id FROM screens WHERE user_id=? ORDER BY screen_id",
        (user_id,)
    )
    rows = cur.fetchall()
    if not rows:
        return {"screens": []}
    return {"screens": [row["screen_id"] for row in rows]}



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

@router.delete("/screens/{screen_id}")
def delete_screen(
    screen_id: int,
    user_id: str = Query("local"),
    db=Depends(get_db)
):
    cur = db.cursor()
    cur.execute(
        """
        DELETE FROM screens WHERE user_id=? AND screen_id=?;
        """,
        (user_id, screen_id)
    )
    db.commit()
    return {"ok": True}