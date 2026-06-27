"""
Smart Object Detection & Tracking System - Backend Main Application
FastAPI + YOLOv8 + MySQL
"""
import os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import uvicorn

load_dotenv()

from app.database import engine, Base, get_db
from app.models.user import User
from app.models.detection import Detection
from app.models.video import Video
from app.models.others import Screenshot, Settings

# Schemas
from app.schemas import auth as auth_schema
from app.schemas import detection as det_schema
from app.schemas import analytics as an_schema

# Services
from app.services import auth_service
from app.services import detection_service
from app.services import video_service
from app.services import analytics_service
from app.services import settings_service

# Auth middleware
from app.middleware.auth_middleware import get_current_user

# Create tables
Base.metadata.create_all(bind=engine)

# App init
app = FastAPI(title="Smart Object Detection API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Root / Health
# ============================================

@app.get("/")
def root():
    return {"message": "Smart Object Detection API", "version": "1.0.0", "status": "active", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ============================================
# AUTH
# ============================================

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(data: auth_schema.UserRegister, db: Session = Depends(get_db)):
    return auth_service.register_user(db, data)

@app.post("/api/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return auth_service.login_user(db, form.username, form.password)

@app.get("/api/auth/profile")
def profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/api/auth/profile")
def update_profile(data: auth_schema.UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return auth_service.update_user_profile(db, current_user.id, data)

@app.put("/api/auth/change-password")
def change_pwd(data: auth_schema.PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return auth_service.change_password(db, current_user.id, data.current_password, data.new_password)

# ============================================
# DETECTION
# ============================================

@app.post("/api/detection/webcam")
def start_webcam(config: det_schema.DetectionConfig, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return detection_service.start_webcam(db, current_user.id, config)

@app.post("/api/detection/upload")
async def upload_video(
    file: UploadFile = File(...),
    confidence: float = Form(0.5),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await video_service.process_uploaded_video(db, current_user.id, file, confidence)

@app.get("/api/detection/history")
def detection_history(
    page: int = 1, limit: int = 10,
    object: Optional[str] = None, source: Optional[str] = None,
    min_confidence: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return detection_service.get_history(db, current_user.id, page, limit, object, source, min_confidence)

@app.get("/api/detection/statistics")
def detection_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return detection_service.get_statistics(db, current_user.id)

@app.delete("/api/detection/{detection_id}")
def delete_detection(detection_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return detection_service.delete_detection(db, current_user.id, detection_id)

@app.get("/api/detection/export/{fmt}")
def export_history(fmt: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return detection_service.export_history(db, current_user.id, fmt)

# ============================================
# VIDEOS
# ============================================

@app.get("/api/video/{video_id}")
def get_video(video_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return video_service.get_video(db, current_user.id, video_id)

@app.get("/api/video/download/{video_id}")
def download_video(video_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return video_service.download_video(db, current_user.id, video_id)

@app.delete("/api/video/{video_id}")
def delete_video(video_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return video_service.delete_video(db, current_user.id, video_id)

# ============================================
# ANALYTICS
# ============================================

@app.get("/api/analytics/dashboard")
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return analytics_service.get_dashboard(db, current_user.id)

@app.get("/api/analytics/objects")
def object_dist(period: str = "all", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return analytics_service.get_object_distribution(db, current_user.id, period)

@app.get("/api/analytics/timeline")
def timeline(period: str = "week", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return analytics_service.get_timeline(db, current_user.id, period)

@app.get("/api/analytics/recent")
def recent(limit: int = 10, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return analytics_service.get_recent_detections(db, current_user.id, limit)

# ============================================
# SETTINGS
# ============================================

@app.get("/api/settings")
def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return settings_service.get_settings(db, current_user.id)

@app.put("/api/settings")
def update_settings(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return settings_service.update_settings(db, current_user.id, data)

# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    uvicorn.run("main:app", host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")), reload=os.getenv("RELOAD", "True") == "True")
