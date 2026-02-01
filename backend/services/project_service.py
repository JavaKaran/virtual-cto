from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from models.project import Project
from models.user import User
from schemas.project import ProjectCreate, ProjectUpdate
from services.base import BaseService
from exceptions.exceptions import ProjectNotFoundException, ProjectAccessDeniedException


class ProjectService(BaseService):
    """Service layer for project business logic"""
    
    def create_project(self, project_data: ProjectCreate, user: User) -> Project:
        """
        Create a new project for a user.
        
        Args:
            project_data: Project creation data
            user: The user creating the project
            
        Returns:
            Created Project object
        """
        new_project = Project(
            name=project_data.name,
            description=project_data.description,
            user_id=user.id
        )
        
        self.db.add(new_project)
        self.db.commit()
        self.db.refresh(new_project)
        
        return new_project
    
    def get_user_projects(self, user: User) -> List[Project]:
        """
        Get all projects for a user.
        
        Args:
            user: The user whose projects to retrieve
            
        Returns:
            List of Project objects
        """
        return self.db.query(Project).filter(Project.user_id == user.id).order_by(Project.created_at.desc()).all()
    
    def get_project_by_id(self, project_id: UUID, user: User) -> Project:
        """
        Get a project by ID, ensuring it belongs to the user.
        
        Args:
            project_id: The project ID
            user: The user requesting the project
            
        Returns:
            Project object
            
        Raises:
            ProjectNotFoundException: If project doesn't exist
            ProjectAccessDeniedException: If user doesn't own the project
        """
        project = self.db.query(Project).filter(Project.id == project_id).first()
        
        if not project:
            raise ProjectNotFoundException()
        
        if project.user_id != user.id:
            raise ProjectAccessDeniedException()
        
        return project
    
    def update_project(self, project_id: UUID, project_data: ProjectUpdate, user: User) -> Project:
        """
        Update a project.
        
        Args:
            project_id: The project ID
            project_data: Project update data
            user: The user updating the project
            
        Returns:
            Updated Project object
            
        Raises:
            ProjectNotFoundException: If project doesn't exist
            ProjectAccessDeniedException: If user doesn't own the project
        """
        project = self.get_project_by_id(project_id, user)
        
        if project_data.name is not None:
            project.name = project_data.name
        if project_data.description is not None:
            project.description = project_data.description
        
        self.db.commit()
        self.db.refresh(project)
        
        return project
    
    def delete_project(self, project_id: UUID, user: User) -> None:
        """
        Delete a project.
        
        Args:
            project_id: The project ID
            user: The user deleting the project
            
        Raises:
            ProjectNotFoundException: If project doesn't exist
            ProjectAccessDeniedException: If user doesn't own the project
        """
        project = self.get_project_by_id(project_id, user)
        
        self.db.delete(project)
        self.db.commit()
