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
	os.Setenv("dbpass", "123456")

	database := db.New(ctx, errCh)
	require.NotNil(t, database)
	defer database.Close()

	const testProjID = 9999
	// Очистка зависимостей
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_comments WHERE project_id = $1`, testProjID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_files WHERE project_id = $1`, testProjID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_files WHERE task_id = $1`, testProjID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id = $1`, testProjID)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id = $1`, testProjID)

	_, err := database.Pool.Exec(ctx,
		`INSERT INTO project_project (id, title, user_id) VALUES ($1, $2, $3)`,
		testProjID, "Test Project", 1)
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx,
		`INSERT INTO project_comments (project_id, user_id, message, create_at) VALUES ($1, $2, $3, NOW())`,
		testProjID, 1, "Description")
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx,
		`INSERT INTO task_task (id, title, description, full_description, project_id) VALUES ($1, $2, $3, $4, $5)`,
		testProjID, "Task Title", "Short Desc", "Full Desc", testProjID)
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx,
		`INSERT INTO task_files (task_id, file) VALUES ($1, $2), ($1, $3)`,
		testProjID, "task/file1.txt", "task/file2.txt")
	require.NoError(t, err)

	_, err = database.Pool.Exec(ctx,
		`INSERT INTO project_files (project_id, file) VALUES ($1, $2), ($1, $3)`,
		testProjID, "project/file1.md", "project/file2.md")
	require.NoError(t, err)

	project, err := database.Project(ctx, "Test Project")
	require.NoError(t, err)
	require.Equal(t, "Test Project", project.Title)
	require.Equal(t, "Description", project.Description)
	require.Contains(t, project.Files, "project/file1.md")
	require.Len(t, project.Tasks, 1)
	require.Equal(t, "Task Title", project.Tasks[0].Title)
	require.Contains(t, project.Tasks[0].Files, "task/file1.txt")
}

func TestTaskAndProjectCRUD(t *testing.T) {
	ctx := context.Background()
	errCh := make(chan error, 1)
	os.Setenv("dbpass", "123456")

	database := db.New(ctx, errCh)
	require.NotNil(t, database)
	defer database.Close()

	t.Run("CreateAndDeleteProject", func(t *testing.T) {
		const pid = 8888
		_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id=$1`, pid)

		newID, err := database.CreateProject(ctx, "New Project", 1)
		require.NoError(t, err)
		require.Greater(t, newID, 0)

		var title string
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title FROM project_project WHERE id=$1`, newID).Scan(&title))
		require.Equal(t, "New Project", title)

		err = database.DeleteProject(ctx, newID)
		require.NoError(t, err)

		err = database.Pool.QueryRow(ctx, `SELECT id FROM project_project WHERE id=$1`, newID).Scan(new(int))
		require.Error(t, err)

		// Проверка повторного удаления
		err = database.DeleteProject(ctx, newID)
		require.NoError(t, err)
	})

	t.Run("TaskCRUD", func(t *testing.T) {
		const projectID = 9998
		_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id=$1`, projectID)
		_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id=$1`, projectID)
		_, _ = database.Pool.Exec(ctx, `INSERT INTO project_project (id, title, user_id) VALUES ($1,$2,$3)`, projectID, "CRUD Project", 1)

		taskID, err := database.CreateTask(ctx, projectID, "New Task", "Desc", "Full Desc")
		require.NoError(t, err)
		require.Greater(t, taskID, 0)

		var ttitle, tdesc, tfull string
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title, description, full_description FROM task_task WHERE id=$1`, taskID).Scan(&ttitle, &tdesc, &tfull))
		require.Equal(t, "New Task", ttitle)

		err = database.UpdateTask(ctx, taskID, "Updated Task", "New Desc", "Updated Full Desc")
		require.NoError(t, err)

		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title FROM task_task WHERE id=$1`, taskID).Scan(&ttitle))
		require.Equal(t, "Updated Task", ttitle)

		err = database.DeleteTask(ctx, taskID)
		require.NoError(t, err)

		err = database.Pool.QueryRow(ctx, `SELECT id FROM task_task WHERE id=$1`, taskID).Scan(new(int))
		require.Error(t, err)
	})

	t.Run("UpdateProjectTitle", func(t *testing.T) {
		const projectID = 9998
		err := database.UpdateProjectTitle(ctx, projectID, "Renamed Project")
		require.NoError(t, err)

		var updated string
		require.NoError(t, database.Pool.QueryRow(ctx, `SELECT title FROM project_project WHERE id=$1`, projectID).Scan(&updated))
		require.Equal(t, "Renamed Project", updated)
	})
}
