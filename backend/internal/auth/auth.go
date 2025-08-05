package auth

import (
	"backend/internal/entity"
	"backend/internal/firebase"
	"backend/internal/repository"
	"backend/internal/signals"
	"context"
	"fmt"
	"net/http"
	"sync"

	"firebase.google.com/go/v4/auth"
	"github.com/gorilla/websocket"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

type contextKey string

const UserKey = contextKey("firebaseUser")

var (
	users = make(map[*websocket.Conn]*entity.Person)
	mu    sync.Mutex
	l     = logger.New().Prefix("Auth")
)

// GetClient returns a person entity from their socket connection
func GetClient(conn *websocket.Conn) (*entity.Person, error) {
	if client, ok := users[conn]; ok {
		return client, nil
	}

	return nil, fmt.Errorf("no client found for socket")
}

// SubscribeClient maps the WebSocket connection to a Person extracted from token
func SubscribeClient(conn *websocket.Conn, token *auth.Token) error {
	email := token.Claims["email"]
	name := token.Claims["name"]

	// Basic parsing of name into first and last
	fullName, _ := name.(string)
	firstName, lastName := splitName(fullName)

	person := &entity.Person{
		Email:     toString(email),
		FirstName: firstName,
		LastName:  lastName,
	}

	dbx, err := repository.GetDBX()
	if err != nil {
		conn.Close()
		return conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("failure").Marshall())
	}

	mu.Lock()
	users[conn] = person
	mu.Unlock()

	repository.CreatePersionIfNotExists(context.Background(), dbx, person)
	l.Info(fmt.Sprintf("Subscribed user: %s", person.Email))
	return conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("greeting").Marshall())
}

// UnsubscribeClient removes the user associated with the WebSocket connection
func UnsubscribeClient(conn *websocket.Conn) {
	mu.Lock()
	defer mu.Unlock()

	if person, ok := users[conn]; ok {
		l.Info(fmt.Sprintf("Unsubscribed user: %s", person.Email))
		delete(users, conn)
	}
}

// FirebaseAuth middleware validates Firebase token in the `token` query param
func FirebaseAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.URL.Query().Get("token")
		if tokenString == "" {
			http.Error(w, "Missing token query parameter", http.StatusUnauthorized)
			return
		}

		client, err := firebase.Get().Auth(r.Context())
		if err != nil {
			l.Fatal(err)
			http.Error(w, "Internal auth error", http.StatusInternalServerError)
			return
		}

		token, err := client.VerifyIDToken(r.Context(), tokenString)
		if err != nil {
			l.Fatal(err)
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserKey, token)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
