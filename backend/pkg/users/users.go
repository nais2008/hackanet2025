package users

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	model "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/user_model"
)

type DB struct {
	Pool *pgxpool.Pool
}

// New создает новый экземпляр DB для пользователей
func New(ctx context.Context) (*DB, error) {
	// Получаем переменные окружения
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	if dbname == "" {
		return nil, fmt.Errorf("database name not specified in DB_NAME")
	}

	connString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user, password, host, port, dbname, sslmode)
	fmt.Println("Подключение к базе данных пользователей:", connString)

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Проверка подключения
	err = pool.Ping(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{Pool: pool}, nil
}

// Close закрывает пул подключений к базе данных
func (db *DB) Close() {
	db.Pool.Close()
}

// CreateUser создает нового пользователя
func (r *DB) CreateUser(ctx context.Context, u *model.User) (int, error) {
	var id int
	query := `INSERT INTO user_user (name, image, password, username, email, role, date_join, last_login, attempts_count, block_date)
              VALUES ($1, $2, $3, $4, $5, 'user', NOW(), NOW(), 0, NULL) RETURNING id`
	err := r.Pool.QueryRow(ctx, query, u.Name, u.Image, u.Password, u.Username, u.Email).Scan(&id)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		return 0, fmt.Errorf("create user: %w", err)
	}
	return id, nil
}

// GetUser retrieves a user by ID
func (r *DB) GetUser(ctx context.Context, userID int) (*model.User, error) {
	u := &model.User{}
	query := `SELECT id, name, image, password, username, email, role, date_join, last_login, attempts_count, block_date
              FROM user_user WHERE id=$1`
	err := r.Pool.QueryRow(ctx, query, userID).Scan(
		&u.ID, &u.Name, &u.Image, &u.Password, &u.Username, &u.Email,
		&u.Role, &u.DateJoined, &u.LastLogin, &u.AttemptsCount, &u.BlockDate,
	)
	if err == pgx.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	} else if err != nil {
		log.Printf("Error getting user: %v", err)
		return nil, fmt.Errorf("get user: %w", err)
	}
	return u, nil
}

// GetUserByUsername retrieves a user by username
func (r *DB) GetUserByUsername(ctx context.Context, username string) (*model.User, error) {
	u := &model.User{}
	query := `SELECT id,name,image,password,username,email,role,date_join,last_login,attempts_count,block_date
FROM user_user WHERE username=$1`
	err := r.Pool.QueryRow(ctx, query, username).Scan(
		&u.ID, &u.Name, &u.Image, &u.Password, &u.Username, &u.Email,
		&u.Role, &u.DateJoined, &u.LastLogin, &u.AttemptsCount, &u.BlockDate,
	)
	if err != nil {
		return nil, fmt.Errorf("get user by username: %w", err)
	}
	return u, nil
}

// UpdateUser updates mutable fields: name, image, password, email
func (r *DB) UpdateUser(ctx context.Context, u *model.User) error {
	query := `UPDATE user_user SET name=$1, image=$2, password=$3, email=$4, last_login=NOW() WHERE id=$5`
	cmd, err := r.Pool.Exec(ctx, query, u.Name, u.Image, u.Password, u.Email, u.ID)
	if err != nil {
		log.Printf("Error updating user: %v", err)
		return fmt.Errorf("update user: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("user %d not found", u.ID)
	}
	return nil
}

// DeleteUser removes a user
func (r *DB) DeleteUser(ctx context.Context, userID int) error {
	query := `DELETE FROM user_user WHERE id=$1`
	cmd, err := r.Pool.Exec(ctx, query, userID)
	if err != nil {
		log.Printf("Error deleting user: %v", err)
		return fmt.Errorf("delete user: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("user %d not found", userID)
	}
	return nil
}

// Role checks

// IsGuest returns true if the user's role is "guest"
func IsGuest(u model.User) bool {
	return u.Role == "guest"
}

// IsRegistered returns true if role is "user" or "admin"
func IsRegistered(u model.User) bool {
	return u.Role == "user" || u.Role == "admin"
}

// IsAdmin returns true if the user's role is "admin"
func IsAdmin(u model.User) bool {
	return u.Role == "admin"
}

// CheckUserExists checks if a user with the given username or email exists
func (r *DB) CheckUserExists(ctx context.Context, username, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM user_user WHERE username=$1 OR email=$2)`
	err := r.Pool.QueryRow(ctx, query, username, email).Scan(&exists)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, fmt.Errorf("check user existence: %w", err)
	}
	return exists, nil
}

func (r *DB) UserRegister(ctx context.Context, u *model.User) (int, error) {
	var id int
	query := `INSERT INTO user_user (name, image, password, username, email, role, date_join, last_login, attempts_count, block_date)
              VALUES ($1, $2, $3, $4, $5, 'user', NOW(), NOW(), 0, NULL) RETURNING id`
	err := r.Pool.QueryRow(ctx, query, u.Name, u.Image, u.Password, u.Username, u.Email).Scan(&id)
	if err != nil {
		log.Printf("Error registering user: %v", err)
		return 0, fmt.Errorf("register user: %w", err)
	}
	return id, nil
}

// UserLogin обновляет время последнего входа пользователя
func (r *DB) UserLogin(ctx context.Context, userID int) error {
	cmd, err := r.Pool.Exec(ctx, `UPDATE user_user SET last_login=NOW() WHERE id=$1`, userID)
	if err != nil {
		return fmt.Errorf("login user: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("user %d not found", userID)
	}
	return nil
}

// UserLogout обновляет дату блокировки (например, для логирования) или выполняет другую логику выхода
func (r *DB) UserLogout(ctx context.Context, userID int) error {
	cmd, err := r.Pool.Exec(ctx, `UPDATE user_user SET block_date=NOW() WHERE id=$1`, userID)
	if err != nil {
		log.Printf("Error logging out user: %v", err)
		return fmt.Errorf("logout user: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("user %d not found", userID)
	}
	return nil
}
