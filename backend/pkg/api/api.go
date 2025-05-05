package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	db "github.com/nais2008/hackanet2025/backend/pkg/postgress"
)

type API struct {
	r  *mux.Router
	db *db.DB
}

func New(db *db.DB, errChan chan<- error) *API {
	if db == nil {
		errChan <- fmt.Errorf("database instance is nil")
		return nil
	}

	api := &API{db: db, r: mux.NewRouter()}
	api.endpoints(errChan)
	return api
}

func (api *API) Router() *mux.Router {
	return api.r
}

func (api *API) endpoints(errCn chan<- error) {
	api.r.HandleFunc("/project/{name}", api.projectHandler).Methods(http.MethodGet)
	//api.r.HandleFunc("/{login}", api.loginHandler).Methods(http.MethodGet)

	webappPath := filepath.Join(".", "src", "webapp")
	if _, err := os.Stat(webappPath); os.IsNotExist(err) {
		errCn <- fmt.Errorf("static files directory not found: %s", webappPath)
		return
	}

	fs := http.FileServer(http.Dir(webappPath))
	api.r.PathPrefix("/").Handler(http.StripPrefix("/", fs))
}

func (api *API) projectHandler(w http.ResponseWriter, r *http.Request) {
	errcol := make([]string, 0)
	n := mux.Vars(r)["name"]
	if n == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errcol)
	}

	news, err := api.db.Project(r.Context(), n)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to fetch news: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(news); err != nil {
		http.Error(w, fmt.Sprintf("failed to encode response: %v", err), http.StatusInternalServerError)
	}
}
