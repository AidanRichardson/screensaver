from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Screensaver Backend", version="0.1.0")

app.include_router(router, prefix="/api")
