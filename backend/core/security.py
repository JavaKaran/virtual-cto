from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from typing import Optional
from core.config import settings
from jose import JWTError, jwt
from fastapi import HTTPException

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY)

    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify a JWT access token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY)
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not verify token")

def hash_password(password: str) -> str:
    """Hash a password"""
    return password_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password"""
    return password_context.verify(password, hashed_password)