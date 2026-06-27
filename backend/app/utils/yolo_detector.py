"""YOLOv8 detection utility."""
import os
from ultralytics import YOLO

MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "models/yolov8n.pt")
CONF_THRESHOLD = float(os.getenv("YOLO_CONFIDENCE_THRESHOLD", "0.5"))

_detector = None

def get_model():
    global _detector
    if _detector is None:
        try:
            _detector = YOLO(MODEL_PATH)
        except Exception:
            _detector = YOLO("yolov8n.pt")
    return _detector
