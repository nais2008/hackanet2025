# syntax=docker/dockerfile:1
FROM golang:1.24.2

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

WORKDIR /app/backend/src

RUN go build -o /app/hackanet-server .

EXPOSE 8080

CMD ["/app/hackanet-server"]
