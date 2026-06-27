from sqlalchemy.orm import Session
from app.models.others import Settings as SettingsModel

def get_settings(db: Session, user_id: int):
    s = db.query(SettingsModel).filter(SettingsModel.user_id == user_id).first()
    if not s:
        s = SettingsModel(user_id=user_id)
        db.add(s)
        db.commit()
        db.refresh(s)
    return {
        "confidence_threshold": s.confidence_threshold,
        "theme": s.theme, "notifications": s.notifications,
        "language": s.language, "default_camera": s.default_camera,
        "auto_save": s.auto_save, "show_tracking_ids": s.show_tracking_ids,
        "show_confidence": s.show_confidence, "enable_sound": s.enable_sound,
    }

def update_settings(db: Session, user_id: int, data: dict):
    s = db.query(SettingsModel).filter(SettingsModel.user_id == user_id).first()
    if not s:
        s = SettingsModel(user_id=user_id)
        db.add(s)
    for field in ["confidence_threshold", "theme", "notifications", "language",
                  "default_camera", "auto_save", "show_tracking_ids", "show_confidence", "enable_sound"]:
        if field in data:
            setattr(s, field, data[field])
    db.commit()
    db.refresh(s)
    return {"message": "Settings updated", "settings": get_settings(db, user_id)}
