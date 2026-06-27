from sqlalchemy import Column, Integer, String, Float, BigInteger, Enum, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    original_path = Column(String(500), nullable=False)
    processed_path = Column(String(500))
    duration = Column(Float)
    fps = Column(Float)
    resolution = Column(String(50))
    file_size = Column(BigInteger)
    status = Column(Enum("pending", "processing", "completed", "failed"), default="pending", index=True)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
