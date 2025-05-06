package usermodel

import "time"

type User struct {
	ID            int        `json:"id"`
	Name          string     `json:"name"`
	Image         string     `json:"image"`
	Password      string     `json:"password"`
	Username      string     `json:"username"`
	Email         string     `json:"email"`
	Role          string     `json:"role"`
	DateJoined    time.Time  `json:"date_join"`
	LastLogin     time.Time  `json:"last_login"`
	AttemptsCount int        `json:"attempts_count"`
	BlockDate     *time.Time `json:"block_date"` // может быть NULL
}
