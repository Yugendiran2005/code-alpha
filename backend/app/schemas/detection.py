from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DetectionConfig(BaseModel):
    confidence: float = Field(0.5, ge=0.1, le=1.0)
    classes: Optional[List[str]] = None
    enable_tracking: bool = True

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class DetectionItem(BaseModel):
    id: int
    object_name: str
    confidence: float
    tracking_id: Optional[int] = None
    frame_number: Optional[int] = None
    bbox: Optional[BoundingBox] = None
    source: str
    video_name: Optional[str] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class DetectionHistoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    pages: int
    data: List[DetectionItem]

class DetectionStatistics(BaseModel):
    total_detections: int
    videos_processed: int
    active_sessions: int
    today_count: int
    week_count: int
    month_count: int
