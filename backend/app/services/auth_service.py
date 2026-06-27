from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserRegister, UserUpdate
from app.utils.security import hash_password, verify_password, create_access_token
import re

def register_user(db: Session, data: UserRegister):
    # Check for existing email
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    # Create user
    hashed = hash_password(data.password)
    user = User(name=data.name, email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    # Generate token
    token = create_access_token({"sub": str(user.id)})
    return {"message": "Registration successful", "token": token, "user": user}

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")
    token = create_access_token({"sub": str(user.id)})
    return {"message": "Login successful", "token": token, "user": user}

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def update_user_profile(db: Session, user_id: int, data: UserUpdate):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # Validate email uniqueness if email is being changed
    if data.email and data.email != user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
    if data.name:
        user.name = data.name
    if data.email:
        user.email = data.email
    db.commit()
    db.refresh(user)
    return user

def change_password(db: Session, user_id: int, current_pwd: str, new_pwd: str):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not verify_password(current_pwd, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    user.password_hash = hash_password(new_pwd)
    db.commit()
    return {"message": "Password changed successfully"}
