from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    object_name = Column(String(100), nullable=False, index=True)
    confidence = Column(Float, nullable=False, index=True)
    tracking_id = Column(Integer)
    frame_number = Column(Integer)
    bbox_x1 = Column(Float)
    bbox_y1 = Column(Float)
    bbox_x2 = Column(Float)
    bbox_y2 = Column(Float)
    source = Column(Enum("webcam", "upload"), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
