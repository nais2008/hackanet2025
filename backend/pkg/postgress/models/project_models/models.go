package projectmodels

type Project struct {
	ID          string `json:"id"`
	Title       string `json:"name"`
	Description string `json:"description"`
	Group       string `json:"Group"`
	Files       string `json:"link"`
	Tasks       []Task `json:"tasks"`
}

type Task struct {
	ID               string `json:"id"`
	Title            string `json:"name"`
	Description      string `json:"description"`
	Full_description string `json:"Full_description"`
	Files            string `json:"files"`
	Tags             string `json:"Tags"`
}
