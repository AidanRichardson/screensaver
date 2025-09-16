import os, time, requests
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import RedirectResponse

load_dotenv()
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = "http://127.0.0.1:8000/api/spotifyauth/callback"

router = APIRouter(prefix="/api/spotifyauth", tags=["spotify"])

tokens = {
    "access_token": None,
    "refresh_token": None,
    "expires_at": 0,
}

@router.get("/login")
def login():
    url = (
        "https://accounts.spotify.com/authorize"
        f"?client_id={CLIENT_ID}"
        "&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=user-read-currently-playing user-read-playback-state"
    )
    return RedirectResponse(url)


@router.get("/callback")
def callback(code: str):
    resp = requests.post("https://accounts.spotify.com/api/token", data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }).json()

    tokens["access_token"] = resp["access_token"]
    tokens["refresh_token"] = resp["refresh_token"]
    tokens["expires_at"] = time.time() + resp.get("expires_in", 3600)

    return RedirectResponse("http://localhost:5173/")


def refresh_access_token():
    if not tokens["refresh_token"]:
        return None

    resp = requests.post("https://accounts.spotify.com/api/token", data={
        "grant_type": "refresh_token",
        "refresh_token": tokens["refresh_token"],
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }).json()

    tokens["access_token"] = resp["access_token"]
    tokens["expires_at"] = time.time() + resp.get("expires_in", 3600)

    return tokens["access_token"]


@router.get("/token")
def get_token():
    if not tokens["access_token"] or time.time() > tokens["expires_at"]:
        refresh_access_token()
    return {"access_token": tokens["access_token"]}
