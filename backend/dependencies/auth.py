from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models.user import User
from core.security import verify_token
from exceptions.exceptions import AuthenticationException, InactiveUserException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT token."""
    payload = verify_token(token)
    if payload is None:
        raise AuthenticationException()
    
    username: Optional[str] = payload.get("sub")
    if username is None:
        raise AuthenticationException()
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise AuthenticationException()
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get the current active user."""
    if not current_user.is_active:
        raise InactiveUserException()
    return current_user