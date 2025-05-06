package projectmodels

type Project struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Group       string `json:"Group"`
	Files       string `json:"link"`
	UserID      string `json:"user_id"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
	Tasks       []Task `json:"tasks"`
}

type Task struct {
	ID               string `json:"id"`
	ProjectID        int    `json:"project_id"`
	Title            string `json:"title"`
	Description      string `json:"description"`
	Full_description string `json:"Full_description"`
	CreatedAt        string `json:"createdAt"`
	UpdatedAt        string `json:"updatedAt"`
	Files            string `json:"files"`
	Tags             string `json:"Tags"`
}
