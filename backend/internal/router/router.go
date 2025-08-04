package router

import (
	"backend/internal/auth"
	cors "backend/internal/middleware"
	handlers "backend/internal/router/routes"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func SetupRouter() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.CORS)         // CORS middleware
	r.Use(auth.FirebaseAuth) // Auth middleware

	// public routes
	r.Get("/public", handlers.Public)

	// protected routes
	r.Get("/protected", handlers.Protected)

	return r
}
