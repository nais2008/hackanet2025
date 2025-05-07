package projectmodels

import "time"

type Project struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Logo        string    `json:"logo"`
	Group       string    `json:"Group"`
	Files       string    `json:"link"`
	UserID      string    `json:"user_id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Tasks       []Task    `json:"tasks"`
}

type Task struct {
	ID               string `json:"id"`
	ProjectID        int    `json:"project_id"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	Full_description string `json:"Full_description"`
	CreatedAt        string `json:"created_at"`
	UpdatedAt        string `json:"updated_at"`
	Files            string `json:"files"`
	Tags             string `json:"Tags"`
}
