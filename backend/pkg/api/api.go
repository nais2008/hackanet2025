package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gorilla/mux"
	db "github.com/nais2008/hackanet2025/backend/pkg/postgress"
	projectmodel "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/project_models"
	usermodel "github.com/nais2008/hackanet2025/backend/pkg/postgress/models/user_model"
	usersdb "github.com/nais2008/hackanet2025/backend/pkg/users"
)

type API struct {
	r       *mux.Router
	db      *db.DB
	usersDB *usersdb.DB
}

func New(db *db.DB, usersDB *usersdb.DB) *API {
	if db == nil || usersDB == nil {
		return nil
	}

	api := &API{
		db:      db,
		usersDB: usersDB,
		r:       mux.NewRouter(),
	}
	api.setupEndpoints()
	return api
}

func (api *API) Router() *mux.Router {
	return api.r
}

func (api *API) setupEndpoints() {
	// Project endpoints
	api.r.HandleFunc("/projects", api.createProject).Methods(http.MethodPost)
	api.r.HandleFunc("/projects/{id}", api.getProject).Methods(http.MethodGet)
	api.r.HandleFunc("/projects/{id}", api.updateProject).Methods(http.MethodPut)
	api.r.HandleFunc("/projects/{id}", api.deleteProject).Methods(http.MethodDelete)

	// Task endpoints
	api.r.HandleFunc("/projects/{projectId}/tasks", api.createTask).Methods(http.MethodPost)
	api.r.HandleFunc("/tasks/{id}", api.getTask).Methods(http.MethodGet)
	api.r.HandleFunc("/tasks/{id}", api.updateTask).Methods(http.MethodPut)
	api.r.HandleFunc("/tasks/{id}", api.deleteTask).Methods(http.MethodDelete)

	// User endpoints
	api.r.HandleFunc("/users", api.createUser).Methods(http.MethodPost)
	api.r.HandleFunc("/users/{id}", api.getUser).Methods(http.MethodGet)
	api.r.HandleFunc("/users/{id}", api.updateUser).Methods(http.MethodPut)
	api.r.HandleFunc("/users/{id}", api.deleteUser).Methods(http.MethodDelete)

	// Auth endpoints
	api.r.HandleFunc("/register", api.registerUser).Methods(http.MethodPost)
	api.r.HandleFunc("/login", api.userLogin).Methods(http.MethodPost)
	api.r.HandleFunc("/logout/{id}", api.userLogout).Methods(http.MethodPost)

	// Static file serving
	webappPath := filepath.Join(".", "src", "webapp")
	if _, err := os.Stat(webappPath); os.IsNotExist(err) {
		return
	}
	fs := http.FileServer(http.Dir(webappPath))
	api.r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))
}

// Error response structure
type errorResponse struct {
	Errors []string `json:"errors"`
}

// Helper function to send error response
func (api *API) sendError(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(errorResponse{
		Errors: []string{err.Error()},
	})
}

// Helper function to send success response
func (api *API) sendSuccess(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// Project handlers
func (api *API) createProject(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title  string `json:"title"`
		UserID int    `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	id, err := api.db.CreateProject(r.Context(), input.Title, input.UserID)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusCreated, map[string]int{"id": id})
}

func (api *API) getProject(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid project ID"))
		return
	}

	project, err := api.db.GetProjectByID(r.Context(), id)
	if err != nil {
		api.sendError(w, http.StatusNotFound, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, project)
}

func (api *API) updateProject(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid project ID"))
		return
	}

	var input struct {
		Title string `json:"title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	if err := api.db.UpdateProjectTitle(r.Context(), id, input.Title); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "project updated"})
}

func (api *API) deleteProject(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid project ID"))
		return
	}

	if err := api.db.DeleteProject(r.Context(), id); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "project deleted"})
}

// Task handlers
func (api *API) createTask(w http.ResponseWriter, r *http.Request) {
	projectIdStr := mux.Vars(r)["projectId"]
	projectID, err := strconv.Atoi(projectIdStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid project ID"))
		return
	}

	var input projectmodel.Task
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	id, err := api.db.CreateTask(r.Context(), projectID, input.Title, input.Description, input.Full_description)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusCreated, map[string]int{"id": id})
}

func (api *API) getTask(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid task ID"))
		return
	}

	task, err := api.db.GetTaskByID(r.Context(), id)
	if err != nil {
		api.sendError(w, http.StatusNotFound, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, task)
}

func (api *API) updateTask(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid task ID"))
		return
	}

	var input projectmodel.Task
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	if err := api.db.UpdateTask(r.Context(), id, input.Title, input.Description, input.Full_description); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "task updated"})
}

func (api *API) deleteTask(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid task ID"))
		return
	}

	if err := api.db.DeleteTask(r.Context(), id); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "task deleted"})
}

// User handlers
func (api *API) createUser(w http.ResponseWriter, r *http.Request) {
	var user usermodel.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	if user.Username == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("username is required"))
		return
	}
	if user.Email == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("email is required"))
		return
	}
	if user.Password == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("password is required"))
		return
	}

	exists, err := api.usersDB.CheckUserExists(r.Context(), user.Username, user.Email)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}
	if exists {
		api.sendError(w, http.StatusConflict, fmt.Errorf("user with this username or email already exists"))
		return
	}

	id, err := api.usersDB.CreateUser(r.Context(), &user)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusCreated, map[string]int{"id": id})
}

func (api *API) getUser(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid user ID"))
		return
	}

	user, err := api.usersDB.GetUser(r.Context(), id)
	if err != nil {
		api.sendError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	api.sendSuccess(w, http.StatusOK, user)
}

func (api *API) updateUser(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid user ID"))
		return
	}

	var user usermodel.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}
	user.ID = id

	_, err = api.usersDB.GetUser(r.Context(), id)
	if err != nil {
		api.sendError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	if err := api.usersDB.UpdateUser(r.Context(), &user); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "user updated"})
}

func (api *API) deleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid user ID"))
		return
	}

	if err := api.usersDB.DeleteUser(r.Context(), id); err != nil {
		if err.Error() == fmt.Sprintf("user %d not found", id) {
			api.sendError(w, http.StatusNotFound, err)
		} else {
			api.sendError(w, http.StatusInternalServerError, err)
		}
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "user deleted"})
}

// Auth handlers
func (api *API) registerUser(w http.ResponseWriter, r *http.Request) {
	var user usermodel.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	// Проверка обязательных полей
	if user.Username == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("username is required"))
		return
	}
	if user.Email == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("email is required"))
		return
	}
	if user.Password == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("password is required"))
		return
	}

	// Проверка уникальности username и email
	exists, err := api.usersDB.CheckUserExists(r.Context(), user.Username, user.Email)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}
	if exists {
		api.sendError(w, http.StatusConflict, fmt.Errorf("user with this username or email already exists"))
		return
	}

	// Регистрация пользователя
	id, err := api.usersDB.UserRegister(r.Context(), &user)
	if err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusCreated, map[string]int{"id": id})
}

func (api *API) userLogin(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid request body"))
		return
	}

	// Проверка, что Username и Password не пустые
	if input.Username == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("username is required"))
		return
	}
	if input.Password == "" {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("password is required"))
		return
	}

	// Проверка существования пользователя по username
	user, err := api.usersDB.GetUserByUsername(r.Context(), input.Username)
	if err != nil {
		api.sendError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	// Проверка пароля (здесь предполагается, что пароль хранится в открытом виде, в реальном приложении используйте хэширование)
	if user.Password != input.Password {
		api.sendError(w, http.StatusUnauthorized, fmt.Errorf("invalid password"))
		return
	}

	// Выполнение логина
	if err := api.usersDB.UserLogin(r.Context(), user.ID); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "login successful"})
}

func (api *API) userLogout(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		api.sendError(w, http.StatusBadRequest, fmt.Errorf("invalid user ID"))
		return
	}

	// Проверка существования пользователя
	_, err = api.usersDB.GetUser(r.Context(), id)
	if err != nil {
		api.sendError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	// Выполнение выхода
	if err := api.usersDB.UserLogout(r.Context(), id); err != nil {
		api.sendError(w, http.StatusInternalServerError, err)
		return
	}

	api.sendSuccess(w, http.StatusOK, map[string]string{"message": "logout successful"})
}
