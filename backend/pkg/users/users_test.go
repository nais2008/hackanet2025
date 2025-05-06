package users_test

import (
	"context"
	"fmt"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	model "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/user_model"
	"github.com/nais2008/hackanet2025/backend/pkg/users"
	"github.com/stretchr/testify/require"
)

// Подключение к БД
func setupDB(t *testing.T) *users.DB {
	connStr := fmt.Sprintf("postgres://postgres:123456@localhost:5432/TaskHub")
	pool, err := pgxpool.New(context.Background(), connStr)
	require.NoError(t, err)
	return &users.DB{Pool: pool}
}

func TestUserCRUDAndRoles(t *testing.T) {
	r := setupDB(t)
	ctx := context.Background()

	// Очистка таблицы
	_, _ = r.Pool.Exec(ctx, `DELETE FROM user_user`)
	_, _ = r.Pool.Exec(ctx, `ALTER SEQUENCE user_user_id_seq RESTART WITH 1`)

	// Синхронизация последовательности с максимальным id
	_, _ = r.Pool.Exec(ctx, `
		SELECT setval('user_user_id_seq', COALESCE(MAX(id), 0) + 1, false)
		FROM user_user
	`)

	// Вставка гостя
	var guestID int
	err := r.Pool.QueryRow(ctx,
		`INSERT INTO user_user (name, image, password, username, email, role, date_join, last_login, attempts_count, block_date)
		 VALUES ('Guest', '', '', 'guest1', 'g@example.com', 'guest', NOW(), NOW(), 0, NULL) RETURNING id`).Scan(&guestID)
	require.NoError(t, err)

	// Создание пользователя
	u := &model.User{
		Name:     "User1",
		Image:    "",
		Password: "pass",
		Username: "user1",
		Email:    "u1@example.com",
	}
	userID, err := r.CreateUser(ctx, u)
	require.NoError(t, err)

	// Вставка админа
	var adminID int
	err = r.Pool.QueryRow(ctx,
		`INSERT INTO user_user (name, image, password, username, email, role, date_join, last_login, attempts_count, block_date)
		 VALUES ('Admin', '', '', 'admin1', 'a@example.com', 'admin', NOW(), NOW(), 0, NULL) RETURNING id`).Scan(&adminID)
	require.NoError(t, err)

	// Проверка ролей
	guest, err := r.GetUser(ctx, guestID)
	require.NoError(t, err)
	require.True(t, users.IsGuest(*guest))
	require.False(t, users.IsRegistered(*guest))
	require.False(t, users.IsAdmin(*guest))

	reg, err := r.GetUser(ctx, userID)
	require.NoError(t, err)
	require.False(t, users.IsGuest(*reg))
	require.True(t, users.IsRegistered(*reg))
	require.False(t, users.IsAdmin(*reg))

	admin, err := r.GetUser(ctx, adminID)
	require.NoError(t, err)
	require.False(t, users.IsGuest(*admin))
	require.True(t, users.IsRegistered(*admin))
	require.True(t, users.IsAdmin(*admin))

	// Обновление
	reg.Name = "Updated"
	reg.Email = "up@example.com"
	err = r.UpdateUser(ctx, reg)
	require.NoError(t, err)

	updated, err := r.GetUser(ctx, userID)
	require.NoError(t, err)
	require.Equal(t, "Updated", updated.Name)
	require.Equal(t, "up@example.com", updated.Email)

	// Удаление
	err = r.DeleteUser(ctx, userID)
	require.NoError(t, err)

	deleted, err := r.GetUser(ctx, userID)
	require.Error(t, err) // Ожидаем ошибку
	require.Nil(t, deleted)

	fmt.Println(updated)
}
