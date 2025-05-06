package db

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	prj "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/project_models"
)

// Project retrieves a project by title
func (db *DB) Project(ctx context.Context, title string) (*prj.Project, error) {
	query := `SELECT id, title, user_id 
              FROM project_project 
              WHERE title = $1`
	var p prj.Project
	err := db.Pool.QueryRow(ctx, query, title).Scan(&p.ID, &p.Title, &p.UserID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("project not found: %w", err)
		}
		return nil, fmt.Errorf("failed to query project: %w", err)
	}
	return &p, nil
}

// GetProjectByID retrieves a project by ID
func (db *DB) GetProjectByID(ctx context.Context, id int) (*prj.Project, error) {
	query := `SELECT id, title, user_id 
              FROM project_project 
              WHERE id = $1`
	var p prj.Project
	err := db.Pool.QueryRow(ctx, query, id).Scan(&p.ID, &p.Title, &p.UserID)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("project not found: %w", err)
		}
		return nil, fmt.Errorf("failed to query project: %w", err)
	}
	return &p, nil
}

// GetTaskByID retrieves a task by ID
func (db *DB) GetTaskByID(ctx context.Context, id int) (*prj.Task, error) {
	query := `SELECT id, project_id, title, description, full_description 
              FROM task_task 
              WHERE id = $1`
	var t prj.Task
	err := db.Pool.QueryRow(ctx, query, id).Scan(&t.ID, &t.ProjectID, &t.Title, &t.Description, &t.Full_description)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("task not found: %w", err)
		}
		return nil, fmt.Errorf("failed to query task: %w", err)
	}
	return &t, nil
}

// CreateProject creates a new project and returns its ID
func (db *DB) CreateProject(ctx context.Context, title string, userID int) (int, error) {
	query := `INSERT INTO project_project (title, user_id) 
              VALUES ($1, $2) 
              RETURNING id`
	var id int
	err := db.Pool.QueryRow(ctx, query, title, userID).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to create project: %w", err)
	}
	return id, nil
}

// UpdateProjectTitle updates the title of a project by ID
func (db *DB) UpdateProjectTitle(ctx context.Context, id int, title string) error {
	query := `UPDATE project_project 
              SET title = $1 
              WHERE id = $2`
	tag, err := db.Pool.Exec(ctx, query, title, id)
	if err != nil {
		return fmt.Errorf("failed to update project title: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("project with id %d not found", id)
	}
	return nil
}

// DeleteProject deletes a project by ID
func (db *DB) DeleteProject(ctx context.Context, id int) error {
	query := `DELETE FROM project_project WHERE id = $1`
	tag, err := db.Pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("project with id %d not found", id)
	}
	return nil
}

// CreateTask creates a new task for a project and returns its ID
func (db *DB) CreateTask(ctx context.Context, projectID int, title, description, fullDescription string) (int, error) {
	query := `
        INSERT INTO task_task (project_id, title, description, full_description, createdat, updatedat)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id
    `
	var id int
	row := db.Pool.QueryRow(ctx, query, projectID, title, description, fullDescription)
	err := row.Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to create task: %w", err)
	}
	return id, nil
}

// UpdateTask updates a task by ID
func (r *DB) UpdateTask(ctx context.Context, projectID, taskID int, title, description, fullDescription string) error {
	query := `UPDATE tasks 
	          SET title=$1, description=$2, full_description=$3, updated_at=NOW()
	          WHERE id=$4 AND project_id=$5`
	cmd, err := r.Pool.Exec(ctx, query, title, description, fullDescription, taskID, projectID)
	if err != nil {
		log.Printf("Error updating task: %v", err)
		return fmt.Errorf("update task: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("task with ID %d in project %d not found", taskID, projectID)
	}
	return nil
}

// DeleteTask deletes a task by ID
func (r *DB) DeleteTask(ctx context.Context, projectID, taskID int) error {
	query := `DELETE FROM tasks WHERE id=$1 AND project_id=$2`
	cmd, err := r.Pool.Exec(ctx, query, taskID, projectID)
	if err != nil {
		log.Printf("Error deleting task: %v", err)
		return fmt.Errorf("delete task: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("task with ID %d in project %d not found", taskID, projectID)
	}
	return nil
}
