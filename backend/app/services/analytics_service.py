from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.detection import Detection
from app.models.video import Video

def get_dashboard(db: Session, user_id: int):
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=now.weekday())

    total = db.query(Detection).filter(Detection.user_id == user_id).count()
    videos = db.query(Video).filter(Video.user_id == user_id, Video.status == "completed").count()
    today_count = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= today).count()
    week_count = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= week_ago).count()
    recent = db.query(Detection).filter(Detection.user_id == user_id).order_by(Detection.timestamp.desc()).limit(10).all()

    recent_data = []
    for r in recent:
        mins_ago = int((now - (r.timestamp or now)).total_seconds() / 60)
        time_str = f"{mins_ago} min ago" if mins_ago < 60 else f"{mins_ago//60}h ago"
        recent_data.append({"object": r.object_name, "confidence": r.confidence, "time": time_str})

    return {
        "overview": {"total_detections": total, "videos_processed": videos, "active_sessions": 0, "total_users": 1},
        "today": {"detections": today_count, "videos": 0, "most_detected": "person"},
        "week": {"detections": week_count, "videos": videos, "daily_average": max(1, week_count // 7)},
        "recent_detections": recent_data,
    }

def get_object_distribution(db: Session, user_id: int, period: str):
    now = datetime.utcnow()
    q = db.query(Detection).filter(Detection.user_id == user_id)
    if period == "today":
        q = q.filter(Detection.timestamp >= now.replace(hour=0, minute=0, second=0, microsecond=0))
    elif period == "week":
        q = q.filter(Detection.timestamp >= now - timedelta(days=now.weekday()))
    elif period == "month":
        q = q.filter(Detection.timestamp >= now.replace(day=1))

    rows = q.with_entities(Detection.object_name, func.count().label("cnt")).group_by(Detection.object_name).all()
    total = sum(r.cnt for r in rows)
    data = [{"object": r.object_name, "count": r.cnt, "percentage": round(r.cnt / total * 100, 1) if total else 0} for r in rows]
    data.sort(key=lambda x: x["count"], reverse=True)
    return {"period": period, "data": data, "total": total}

def get_timeline(db: Session, user_id: int, period: str):
    now = datetime.utcnow()
    data = []
    if period == "week":
        for i in range(6, -1, -1):
            d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            day_start = datetime.strptime(d, "%Y-%m-%d")
            day_end = day_start + timedelta(days=1)
            cnt = db.query(Detection).filter(Detection.user_id == user_id, Detection.timestamp >= day_start, Detection.timestamp < day_end).count()
            data.append({"date": d, "count": cnt})
    return {"period": period, "data": data}

def get_recent_detections(db: Session, user_id: int, limit: int):
    items = db.query(Detection).filter(Detection.user_id == user_id).order_by(Detection.timestamp.desc()).limit(limit).all()
    result = []
    for d in items:
        result.append({"id": d.id, "object": d.object_name, "confidence": d.confidence, "source": d.source,
                       "timestamp": d.timestamp.isoformat() if d.timestamp else None})
    return {"data": result}
