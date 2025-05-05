package db_test

import (
	"context"
	"os"
	"testing"

	db "github.com/nais2008/hackanet2025/backend/pkg/postgress"
	"github.com/stretchr/testify/require"
)

func TestProjectFunction(t *testing.T) {
	ctx := context.Background()
	errCh := make(chan error, 1)

	// Установим пароль для БД
	os.Setenv("dbpass", "123456") // замените на свой пароль

	database := db.New(ctx, errCh)
	require.NotNil(t, database)
	defer database.Close()

	// Очистка: сначала зависимости, потом основная таблица
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_comments WHERE project_id = $1`, 9999)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_files WHERE project_id = $1`, 9999)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_files WHERE task_id = $1`, 9999)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id = $1`, 9999)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id = $1`, 9999)

	// Вставляем тестовый проект и комментарий
	_, err := database.Pool.Exec(ctx, `
		INSERT INTO project_project (id, title, user_id)
		VALUES ($1, $2, $3)
	`, 9999, "Test Project", 1)
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx, `
		INSERT INTO project_comments (project_id, user_id, message, create_at)
		VALUES ($1, $2, $3, NOW())
	`, 9999, 1, "Description")
	require.NoError(t, err)

	// Вставляем задачу и файлы
	_, err = database.Pool.Exec(ctx, `
		INSERT INTO task_task (id, title, description, full_description, project_id)
		VALUES ($1, $2, $3, $4, $5)
	`, 9999, "Task Title", "Short Desc", "Full Desc", 9999)
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx, `
		INSERT INTO task_files (task_id, file)
		VALUES ($1, $2), ($1, $3)
	`, 9999, "task/file1.txt", "task/file2.txt")
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx, `
		INSERT INTO project_files (project_id, file)
		VALUES ($1, $2), ($1, $3)
	`, 9999, "project/file1.md", "project/file2.md")
	require.NoError(t, err)

	// Проверяем функцию Project
	project, err := database.Project(ctx, "Test Project")
	require.NoError(t, err)
	require.Equal(t, "Test Project", project.Title)
	require.Equal(t, "Description", project.Description)
	require.Contains(t, project.Files, "project/file1.md")
	require.Len(t, project.Tasks, 1)
	require.Equal(t, "Task Title", project.Tasks[0].Title)
	require.Contains(t, project.Tasks[0].Files, "task/file1.txt")
}

func TestTaskCRUDAndProjectTitle(t *testing.T) {
	ctx := context.Background()
	errCh := make(chan error, 1)
	os.Setenv("dbpass", "123456") // замените на свой пароль

	database := db.New(ctx, errCh)
	require.NotNil(t, database)
	defer database.Close()

	const projectID = 9998
	// Очистка предыдущих данных
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task_tags WHERE task_id IN (SELECT id FROM task_task WHERE project_id=$1)`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_comments WHERE task_id IN (SELECT id FROM task_task WHERE project_id=$1)`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_stages WHERE task_id IN (SELECT id FROM task_task WHERE project_id=$1)`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_images WHERE task_id IN (SELECT id FROM task_task WHERE project_id=$1)`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_files WHERE task_id IN (SELECT id FROM task_task WHERE project_id=$1)`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id=$1`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_files WHERE project_id=$1`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_comments WHERE project_id=$1`, projectID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id=$1`, projectID)
	// Clean up any dummy user
	_, _ = database.Pool.Exec(ctx, `DELETE FROM user_user WHERE id = 0`)

	// Вставляем тестовый проект
	_, err := database.Pool.Exec(ctx, `INSERT INTO project_project (id, title, user_id) VALUES ($1, $2, $3)`, projectID, "CRUD Project", 1)
	require.NoError(t, err)
	// Insert dummy user for FK
	_, err = database.Pool.Exec(ctx, `INSERT INTO user_user (id) VALUES (0)`)
	require.NoError(t, err)

	t.Run("TaskCRUD", func(t *testing.T) {
		// CreateTask
		taskID, err := database.CreateTask(ctx, projectID, "New Task", "Desc", "Full Desc")
		require.NoError(t, err)
		require.Greater(t, taskID, 0)

		// Проверка создания
		var title, desc, fullDesc string
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title, description, full_description FROM task_task WHERE id=$1`, taskID).Scan(&title, &desc, &fullDesc))
		require.Equal(t, "New Task", title)
		require.Equal(t, "Desc", desc)
		require.Equal(t, "Full Desc", fullDesc)

		// UpdateTask
		err = database.UpdateTask(ctx, taskID, "Updated Task", "New Desc", "Updated Full Desc")
		require.NoError(t, err)

		// Проверка обновления
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title, description, full_description FROM task_task WHERE id=$1`, taskID).Scan(&title, &desc, &fullDesc))
		require.Equal(t, "Updated Task", title)
		require.Equal(t, "New Desc", desc)
		require.Equal(t, "Updated Full Desc", fullDesc)

		// DeleteTask
		err = database.DeleteTask(ctx, taskID)
		require.NoError(t, err)

		// Проверка удаления
		require.Error(t, database.Pool.QueryRow(ctx, `SELECT id FROM task_task WHERE id=$1`, taskID).Scan(new(int)))
	})

	t.Run("UpdateProjectTitle", func(t *testing.T) {
		// UpdateProjectTitle
		err := database.UpdateProjectTitle(ctx, projectID, "Renamed Project")
		require.NoError(t, err)

		// Проверка изменения названия проекта
		var updatedTitle string
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title FROM project_project WHERE id=$1`, projectID).Scan(&updatedTitle))
		require.Equal(t, "Renamed Project", updatedTitle)
	})
}
