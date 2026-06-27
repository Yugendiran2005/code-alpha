from pydantic import BaseModel
from typing import List, Optional

class ObjectDistItem(BaseModel):
    object: str
    count: int
    percentage: float

class TimelineItem(BaseModel):
    date: str
    count: int

class RecentDetection(BaseModel):
    object: str
    confidence: float
    time: str

class DashboardResponse(BaseModel):
    overview: dict
    today: dict
    week: dict
    recent_detections: List[RecentDetection]

class ObjectDistributionResponse(BaseModel):
    period: str
    data: List[ObjectDistItem]
    total: int

class TimelineResponse(BaseModel):
    period: str
    data: List[TimelineItem]
