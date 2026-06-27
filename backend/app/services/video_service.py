import os, uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.models.video import Video

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "output")
ALLOWED_TYPES = {"video/mp4", "video/avi", "video/mov", "video/mkv", "video/x-msvideo"}
MAX_SIZE = 100 * 1024 * 1024  # 100 MB

def get_video(db: Session, user_id: int, video_id: int):
    v = db.query(Video).filter(Video.id == video_id, Video.user_id == user_id).first()
    if not v:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    return v

def download_video(db: Session, user_id: int, video_id: int):
    v = get_video(db, user_id, video_id)
    if v.status != "completed" or not v.processed_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Video not ready")
    return {"download_url": v.processed_path, "filename": v.filename}

def delete_video(db: Session, user_id: int, video_id: int):
    v = get_video(db, user_id, video_id)
    db.delete(v)
    db.commit()
    return {"message": "Video deleted"}

async def process_uploaded_video(db: Session, user_id: int, file: UploadFile, confidence: float):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Unsupported format. Allowed: {', '.join(ALLOWED_TYPES)}")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "mp4"
    saved_name = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_name)

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File exceeds 100MB limit")
    with open(file_path, "wb") as f:
        f.write(content)

    video = Video(
        user_id=user_id, filename=file.filename, original_path=file_path,
        status="pending", file_size=len(content),
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    # In production: process video with YOLO here
    video.status = "completed"
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    video.processed_path = os.path.join(OUTPUT_DIR, f"processed_{saved_name}")
    video.processed_at = datetime.utcnow()
    db.commit()
    db.refresh(video)

    return {"message": "Video processed", "video_id": video.id, "status": video.status}
