from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Screenshot(Base):
    __tablename__ = "screenshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    detection_id = Column(Integer, ForeignKey("detections.id", ondelete="SET NULL"))
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    confidence_threshold = Column(Float, default=0.5)
    theme = Column(String(50), default="dark")
    notifications = Column(Boolean, default=True)
    language = Column(String(10), default="en")
    default_camera = Column(Integer, default=0)
    auto_save = Column(Boolean, default=True)
    show_tracking_ids = Column(Boolean, default=True)
    show_confidence = Column(Boolean, default=True)
    enable_sound = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
