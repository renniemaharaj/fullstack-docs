package main

import (
	"backend/internal/conveyor"
	"backend/internal/repository"
	"backend/internal/router"
	"context"
	"net/http"

	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

func main() {
	r := router.SetupRouter()
	l := logger.New().Prefix("Backend")
	m := conveyor.CreateManager(0, 15, 10, 0)
	m.Start()

	if err := repository.InitDatabaseTables(context.Background()); err != nil {
		panic(err)
	}

	go func() {
		l.Info("Starting server on :8081")
		if err := http.ListenAndServe(":8081", r); err != nil {
			l.Fatal(err)
		}
	}()

	select {}
}
