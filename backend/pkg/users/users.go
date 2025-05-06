package users

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	model "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/user_model"
)

type DB struct {
	Pool *pgxpool.Pool
}

func (r *DB) CreateUser(ctx context.Context, u *model.User) (int, error) {
	var id int
	query := `INSERT INTO user_user (name, image, password, username, email, role, date_join, last_login, attempts_count, block_date)
VALUES ($1,$2,$3,$4,$5,'user', NOW(), NOW(), 0, NULL) RETURNING id`
	err := r.Pool.QueryRow(ctx, query,
		u.Name, u.Image, u.Password, u.Username, u.Email,
	).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("create user: %w", err)
	}
	return id, nil
}

// GetUser retrieves a user by ID
func (r *DB) GetUser(ctx context.Context, userID int) (*model.User, error) {
	u := &model.User{}
	query := `SELECT id,name,image,password,username,email,role,date_join,last_login,attempts_count,block_date
FROM user_user WHERE id=$1`
	err := r.Pool.QueryRow(ctx, query, userID).Scan(
		&u.ID, &u.Name, &u.Image, &u.Password, &u.Username, &u.Email,
		&u.Role, &u.DateJoined, &u.LastLogin, &u.AttemptsCount, &u.BlockDate,
	)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}
	return u, nil
}

// UpdateUser updates mutable fields: name, image, password, email
func (r *DB) UpdateUser(ctx context.Context, u *model.User) error {
	cmd, err := r.Pool.Exec(ctx,
		`UPDATE user_user SET name=$1, image=$2, password=$3, email=$4, last_login=NOW() WHERE id=$5`,
		u.Name, u.Image, u.Password, u.Email, u.ID,
	)
	if err != nil {
		return fmt.Errorf("update user: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("user %d not found", u.ID)
	}
	return nil
}

// DeleteUser removes a user
func (r *DB) DeleteUser(ctx context.Context, userID int) error {
	cmd, err := r.Pool.Exec(ctx, `DELETE FROM user_user WHERE id=$1`, userID)
	if err != nil {
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
