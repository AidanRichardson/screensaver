from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter()

class WidgetBase(BaseModel):
    type: str
    x: int = 0
    y: int = 0
    w: int = 1
    h: int = 1

class WidgetOut(WidgetBase):
    id: int

@router.get("/widgets", response_model=List[WidgetOut])
def read_widgets(db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("SELECT * FROM widgets")
    rows = cur.fetchall()
    return [dict(row) for row in rows]

@router.post("/widgets", response_model=WidgetOut)
def create_widget(widget: WidgetBase, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute(
        "INSERT INTO widgets (type, x, y, w, h) VALUES (?, ?, ?, ?, ?)",
        (widget.type, widget.x, widget.y, widget.w, widget.h),
    )
    db.commit()
    widget_id = cur.lastrowid
    return {**widget.model_dump(), "id": widget_id}

@router.get("/widgets/{widget_id}", response_model=WidgetOut)
def read_widget(widget_id: int, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("SELECT * FROM widgets WHERE id = ?", (widget_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Widget not found")
    return dict(row)

@router.put("/widgets/{widget_id}", response_model=WidgetOut)
def update_widget(widget_id: int, widget: WidgetBase, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute(
        "UPDATE widgets SET type=?, x=?, y=?, w=?, h=? WHERE id=?",
        (widget.type, widget.x, widget.y, widget.w, widget.h, widget_id),
    )
    db.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Widget not found")
    return {**widget.model_dump(), "id": widget_id}

@router.delete("/widgets/{widget_id}")
def delete_widget(widget_id: int, db=Depends(get_db)):
    cur = db.cursor()
    cur.execute("DELETE FROM widgets WHERE id=?", (widget_id,))
    db.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Widget not found")
    return {"ok": True}
