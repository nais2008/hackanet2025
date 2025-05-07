# syntax=docker/dockerfile:1
FROM golang:1.24.2

WORKDIR /app

# Скопируем файлы зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Скопируем весь код проекта
COPY . .

# Переходим в папку с исходным кодом
WORKDIR /app/backend/src

# Проверим наличие исходников перед сборкой
RUN ls -l

# Собираем сервер
RUN go build -o /app/hackanet-server .

# Проверяем, что файл существует
RUN ls -l /app/hackanet-server

# Открываем порт
EXPOSE 8080

# Запускаем сервер
CMD ["/app/hackanet-server"]
