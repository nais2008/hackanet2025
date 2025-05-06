package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/nais2008/hackanet2025/backend/pkg/api"
	db "github.com/nais2008/hackanet2025/backend/pkg/postgress"
	users "github.com/nais2008/hackanet2025/backend/pkg/users"
)

func main() {
	// Загружаем переменные окружения из .env файла
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	// Инициализируем подключения к базе данных
	ctx := context.Background()
	dbInstance, err := db.New(ctx)
	if err != nil {
		log.Fatalf("Не удалось инициализировать базу данных: %v", err)
	}
	defer dbInstance.Close()

	usersDBInstance, err := users.New(ctx)
	if err != nil {
		log.Fatalf("Не удалось инициализировать базу данных пользователей: %v", err)
	}
	defer usersDBInstance.Close()

	// Инициализируем API с маршрутизатором
	apiInstance := api.New(dbInstance, usersDBInstance)

	// Настраиваем HTTP сервер
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Порт по умолчанию
	}
	addr := fmt.Sprintf(":%s", port)

	// Запускаем сервер с маршрутизатором
	log.Printf("Сервер запускается на %s", addr)
	if err := http.ListenAndServe(addr, apiInstance.Router()); err != nil {
		log.Fatalf("Сервер не запустился: %v", err)
	}
}
