from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Dict
from uuid import UUID

from database import get_db
from models.user import User
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from services.project_service import ProjectService
from dependencies.auth import get_current_active_user

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new project.
    
    - **name**: Project name (required, max 255 characters)
    - **description**: Project description (optional)
    
    Returns the created project.
    """
    project_service = ProjectService(db)
    return project_service.create_project(project_data, current_user)


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    List all projects for the current user.
    
    Returns a list of projects owned by the authenticated user.
    """
    project_service = ProjectService(db)
    projects = project_service.get_user_projects(current_user)
    return ProjectListResponse(projects=projects, total=len(projects))


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific project by ID.
    
    Returns the project if it belongs to the current user.
    """
    project_service = ProjectService(db)
    return project_service.get_project_by_id(project_id, current_user)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a project.
    
    - **name**: New project name (optional)
    - **description**: New project description (optional)
    
    Returns the updated project.
    """
    project_service = ProjectService(db)
    return project_service.update_project(project_id, project_data, current_user)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a project.
    
    Permanently deletes the project and all associated data.
    """
    project_service = ProjectService(db)
    project_service.delete_project(project_id, current_user)
    return None
