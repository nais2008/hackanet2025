package db_test

import (
	"context"
	"os"
	"testing"

	"github.com/nais2008/hackanet2025/backend/pkg/postgress"
	"github.com/stretchr/testify/require"
)

func TestProjectFunction(t *testing.T) {
	ctx := context.Background()
	errCh := make(chan error, 1)

	// Установим переменную окружения dbpass для подключения
	os.Setenv("dbpass", "123456") // замени на свой пароль

	database := db.New(ctx, errCh)
	require.NotNil(t, database)
	defer database.Close()

	// Очистка: сначала зависимости, потом основная таблица
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_comments WHERE project_id = 9999;`)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_files WHERE project_id = 9999;`)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_files WHERE task_id = 9999;`)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM task_task WHERE project_id = 9999;`)
	_, _ = database.Pool.Exec(ctx, `DELETE FROM project_project WHERE id = 9999;`)

	// Вставим тестовый проект
	_, err := database.Pool.Exec(ctx, `
		INSERT INTO project_project (id, title, user_id)
		VALUES (9999, 'Test Project', 1);
	`)
	require.NoError(t, err)

	// Вставим комментарий (будет использоваться как описание)
	_, err = database.Pool.Exec(ctx, `
		INSERT INTO project_comments (project_id, user_id, message, create_at)
		VALUES (9999, 1, 'Description', NOW());
	`)
	require.NoError(t, err)

	// Вставим тестовую задачу
	_, err = database.Pool.Exec(ctx, `
		INSERT INTO task_task (id, title, description, full_description, project_id)
		VALUES (9999, 'Task Title', 'Short Desc', 'Full Desc', 9999);
	`)
	require.NoError(t, err)

	// Вставим файлы задач
	_, err = database.Pool.Exec(ctx, `
		INSERT INTO task_files (task_id, file)
		VALUES (9999, 'task/file1.txt'), (9999, 'task/file2.txt');
	`)
	require.NoError(t, err)

	// Вставим файлы проекта
	_, err = database.Pool.Exec(ctx, `
		INSERT INTO project_files (project_id, file)
		VALUES (9999, 'project/file1.md'), (9999, 'project/file2.md');
	`)
	require.NoError(t, err)

	// Вызов функции и проверки
	project, err := database.Project(ctx, "Test Project")
	require.NoError(t, err)
	require.Equal(t, "Test Project", project.Title)
	require.Equal(t, "Description", project.Description)
	require.Contains(t, project.Files, "project/file1.md")
	require.Len(t, project.Tasks, 1)
	require.Equal(t, "Task Title", project.Tasks[0].Title)
	require.Contains(t, project.Tasks[0].Files, "task/file1.txt")
}
