# api/main.py
from fastapi import FastAPI
from api.routes import screens, spotify

app = FastAPI()

app.include_router(screens.router)
app.include_router(spotify.router)
