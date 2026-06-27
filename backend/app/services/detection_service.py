from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from app.models.detection import Detection
from app.models.video import Video
from app.schemas.detection import DetectionConfig
import math

def get_history(db: Session, user_id: int, page: int, limit: int, obj_filter: str = None, source_filter: str = None, min_conf: float = None):
    q = db.query(Detection).filter(Detection.user_id == user_id)
    if obj_filter:
        q = q.filter(Detection.object_name == obj_filter)
    if source_filter:
        q = q.filter(Detection.source == source_filter)
    if min_conf is not None:
        q = q.filter(Detection.confidence >= min_conf)
    total = q.count()
    pages = math.ceil(total / limit) if total > 0 else 1
    items = q.order_by(desc(Detection.timestamp)).offset((page - 1) * limit).limit(limit).all()
    data = []
    for d in items:
        bbox = None
        if d.bbox_x1 is not None:
            bbox = {"x1": d.bbox_x1, "y1": d.bbox_y1, "x2": d.bbox_x2, "y2": d.bbox_y2}
        vid = db.query(Video).filter(Video.id == d.video_id).first()
        data.append({
            "id": d.id, "object_name": d.object_name, "confidence": d.confidence,
            "tracking_id": d.tracking_id, "frame_number": d.frame_number,
            "bbox": bbox, "source": d.source,
            "video_name": vid.filename if vid else None,
            "timestamp": d.timestamp,
        })
    return {"total": total, "page": page, "limit": limit, "pages": pages, "data": data}

def get_statistics(db: Session, user_id: int):
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=now.weekday())
    month_start = today.replace(day=1)
    total = db.query(Detection).filter(Detection.user_id == user_id).count()
    videos = db.query(Video).filter(Video.user_id == user_id, Video.status == "completed").count()
    today_count = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= today).count()
    week_count = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= week_ago).count()
    month_count = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= month_start).count()
    return {"total_detections": total, "videos_processed": videos, "active_sessions": 0,
            "today_count": today_count, "week_count": week_count, "month_count": month_count}

def delete_detection(db: Session, user_id: int, det_id: int):
    d = db.query(Detection).filter(Detection.id == det_id, Detection.user_id == user_id).first()
    if not d:
        return {"message": "Detection not found"}
    db.delete(d)
    db.commit()
    return {"message": "Detection deleted"}

def start_webcam(db: Session, user_id: int, config: DetectionConfig):
    return {"message": "Webcam detection started", "session_id": "session-1", "stream_url": f"ws://localhost:8000/ws/detection/{user_id}"}

def export_history(db: Session, user_id: int, fmt: str):
    items = db.query(Detection).filter(Detection.user_id == user_id).all()
    # In production, generate actual CSV/Excel file
    return {"message": f"Export as {fmt}", "count": len(items)}
