from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, get_db, Base
from models import *
from routers import *

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Virtual CTO",
    description="FastAPI backend for Virtual CTO application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("Database connection successful")
    except Exception as e:
        print(f"Database connection failed: {e}")


@app.get("/")
async def root():
    return {"message": "Welcome to Virtual CTO API"}


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint that also verifies database connection"""
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

