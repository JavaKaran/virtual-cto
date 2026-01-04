from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    username: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "securepassword123"
            }
        }


class UserResponse(BaseModel):
    id: UUID
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None