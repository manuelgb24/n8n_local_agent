import os
import tempfile
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from faster_whisper import WhisperModel
import yt_dlp

app = FastAPI()
_models = {}

class TranscribeRequest(BaseModel):
    youtubeUrl: str
    languageHint: Optional[str] = "es"
    model: Optional[str] = "medium"

def get_model(model_name: str):
    if model_name not in _models:
        _models[model_name] = WhisperModel(model_name, device="cpu", compute_type="int8")
    return _models[model_name]

@app.post("/transcribe")
def transcribe(req: TranscribeRequest):
    if not req.youtubeUrl:
        raise HTTPException(status_code=400, detail="youtubeUrl is required")

    with tempfile.TemporaryDirectory() as tmpdir:
        outtmpl = os.path.join(tmpdir, "%(id)s.%(ext)s")
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": outtmpl,
            "quiet": True,
            "noplaylist": True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(req.youtubeUrl, download=True)
                downloaded = ydl.prepare_filename(info)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"yt-dlp error: {e}")

        if not os.path.exists(downloaded):
            raise HTTPException(status_code=500, detail="audio download failed")

        try:
            model = get_model(req.model or "medium")
            segments, info = model.transcribe(downloaded, language=req.languageHint, vad_filter=True)
            text = " ".join([s.text.strip() for s in segments]).strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"whisper error: {e}")

        if not text:
            raise HTTPException(status_code=422, detail="empty transcript")

        return {
            "transcriptText": text,
            "language": getattr(info, "language", req.languageHint),
            "engine": "faster-whisper"
        }
