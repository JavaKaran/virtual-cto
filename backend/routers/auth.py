from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Dict
from database import get_db
from models.user import User
from schemas.auth import UserCreate, UserResponse, Token
from services.auth_services import AuthService
from dependencies.auth import get_current_active_user

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user and automatically log them in.
    
    - **username**: User's username (must be unique)
    - **password**: User's password (will be hashed)
    
    Returns a JWT access token for immediate use.
    """
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data)
    return auth_service.create_access_token_for_user(user)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login and get access token.
    
    - **username**: User's username or email
    - **password**: User's password
    
    Returns a JWT access token.
    """
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    return auth_service.create_access_token_for_user(user)


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, str]:
    """
    Logout the current user.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current authenticated user's information."""
    return current_user