package db

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	model "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/project_models"
)

type DB struct {
	Pool *pgxpool.Pool
}

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbname = "TaskHub"
)

func New(ctx context.Context, errCn chan<- error) *DB {
	db := &DB{}
	pwd := os.Getenv("dbpass")
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%d/%s", user, pwd, host, port, dbname)

	maxRetries := 10
	retryDelay := 2 * time.Second

	var pool *pgxpool.Pool
	var err error
	for i := 0; i < maxRetries; i++ {
		pool, err = pgxpool.New(ctx, connStr)
		if err == nil {
			if err = pool.Ping(ctx); err == nil {
				break
			}
			pool.Close()
		}
		fmt.Printf("Попытка %d: не удалось подключиться к базе данных: %v, ждём %v\n", i+1, err, retryDelay)
		time.Sleep(retryDelay)
	}
	if err != nil {
		errCn <- fmt.Errorf("failed to connect to database after %d retries: %w", maxRetries, err)
		return nil
	}

	db.Pool = pool
	return db
}

func (db *DB) Project(ctx context.Context, name string) (model.Project, error) {
	var project model.Project

	err := db.Pool.QueryRow(ctx, "SELECT p.id, p.title, (SELECT message FROM project_comments WHERE project_id = p.id ORDER BY create_at ASC LIMIT 1) AS description FROM project_project p WHERE p.title = $1;", name).
		Scan(&project.ID, &project.Title, &project.Description)

	if err != nil {
		return model.Project{}, fmt.Errorf("project not found: %w", err)
	}

	_ = db.Pool.QueryRow(ctx,
		"SELECT message FROM project_comments WHERE project_id = $1 ORDER BY create_at DESC LIMIT 1",
		project.ID).Scan(&project.Description)

	rowsFiles, err := db.Pool.Query(ctx,
		"SELECT file FROM project_files WHERE project_id = $1", project.ID)
	if err != nil {
		return model.Project{}, fmt.Errorf("get project files: %w", err)
	}
	defer rowsFiles.Close()

	var files []string
	for rowsFiles.Next() {
		var file string
		if err := rowsFiles.Scan(&file); err == nil {
			files = append(files, file)
		}
	}
	project.Files = strings.Join(files, ",")

	rowsTasks, err := db.Pool.Query(ctx,
		"SELECT id, title, description, full_description FROM task_task WHERE project_id = $1", project.ID)
	if err != nil {
		return model.Project{}, fmt.Errorf("get tasks: %w", err)
	}
	defer rowsTasks.Close()

	tasks := []model.Task{}
	for rowsTasks.Next() {
		var task model.Task
		if err := rowsTasks.Scan(&task.ID, &task.Title, &task.Description, &task.Full_description); err == nil {

			filesRows, _ := db.Pool.Query(ctx,
				"SELECT file FROM task_files WHERE task_id = $1", task.ID)
			files := []string{}
			for filesRows.Next() {
				var f string
				filesRows.Scan(&f)
				files = append(files, f)
			}
			filesRows.Close()
			task.Files = strings.Join(files, ",")

			tagRows, _ := db.Pool.Query(ctx,
				`SELECT t.name FROM task_tag t 
				JOIN task_task_tags tt ON tt.tag_id = t.id 
				WHERE tt.task_id = $1`, task.ID)
			tags := []string{}
			for tagRows.Next() {
				var tag string
				tagRows.Scan(&tag)
				tags = append(tags, tag)
			}
			tagRows.Close()
			task.Tags = strings.Join(tags, ",")

			tasks = append(tasks, task)
		}
	}

	project.Tasks = tasks
	return project, nil
}

func (db *DB) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}
