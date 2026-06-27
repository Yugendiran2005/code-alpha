"""
Pydantic schemas for authentication requests and responses.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# --- Request Schemas ---

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = Field(None, min_length=5, max_length=255)

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=100)

# --- Response Schemas ---

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    message: str = "Success"
    token: str
    user: UserResponse
