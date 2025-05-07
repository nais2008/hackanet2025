package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	projectmodel "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/project_models"
)

// Project retrieves a project by title
func (db *DB) Project(ctx context.Context, title string) (*projectmodel.Project, error) {
	query := `SELECT id, title, user_id 
              FROM project_project 
              WHERE title = $1`
	var p projectmodel.Project
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
func (db *DB) GetProjectByID(ctx context.Context, id int) (*projectmodel.Project, error) {
	query := `SELECT id, title, user_id 
              FROM project_project 
              WHERE id = $1`
	var p projectmodel.Project
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
func (db *DB) GetTaskByID(ctx context.Context, id int) (*projectmodel.Task, error) {
	query := `SELECT id, project_id, title, description, full_description 
              FROM task_task 
              WHERE id = $1`
	var t projectmodel.Task
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

func (db *DB) CreateTask(ctx context.Context, projectID int, title, description, fullDescription string) (int, error) {
	var id int
	err := db.Pool.QueryRow(ctx, `
		INSERT INTO task_task (project_id, title, description, full_description)
		VALUES ($1, $2, $3, $4)
		RETURNING id`, projectID, title, description, fullDescription).Scan(&id)
	return id, err
}

func (db *DB) GetTasksByProjectID(ctx context.Context, projectID int) ([]projectmodel.Task, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, project_id, title, description, full_description, created_at
		FROM task_task WHERE project_id = $1`, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tasks := []projectmodel.Task{}
	for rows.Next() {
		var t projectmodel.Task
		err := rows.Scan(&t.ID, &t.ProjectID, &t.Title, &t.Description, &t.Full_description, &t.CreatedAt)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, nil
}

func (db *DB) GetTaskByTitleAndProjectID(ctx context.Context, projectID int, title string) (*projectmodel.Task, error) {
	var t projectmodel.Task
	err := db.Pool.QueryRow(ctx, `
		SELECT id, project_id, title, description, full_description, created_at
		FROM task_task WHERE project_id = $1 AND title = $2`, projectID, title).Scan(
		&t.ID, &t.ProjectID, &t.Title, &t.Description, &t.Full_description, &t.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (db *DB) UpdateTask(ctx context.Context, projectID int, oldTitle, newTitle, description, fullDescription string) error {
	_, err := db.Pool.Exec(ctx, `
		UPDATE task_task SET title = $1, description = $2, full_description = $3
		WHERE project_id = $4 AND title = $5`, newTitle, description, fullDescription, projectID, oldTitle)
	return err
}

func (db *DB) DeleteTask(ctx context.Context, projectID int, title string) error {
	_, err := db.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id = $1 AND title = $2`, projectID, title)
	return err
}
