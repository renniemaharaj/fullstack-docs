package gorilla

import (
	"backend/internal/auth"
	"backend/internal/comms"
	"net/http"

	oauth "firebase.google.com/go/v4/auth"
	"github.com/gorilla/websocket"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

// The upgrader to be used later for upgrading with cors configuration or not :(
var wsUpgrade = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Accepting all origin
	},
}

// Upgrade handler function
func UpgradeHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.New().Prefix("Upgrader")

	token, ok := r.Context().Value(auth.UserKey).(*oauth.Token)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	conn, err := wsUpgrade.Upgrade(w, r, nil)
	if err != nil {
		l.Fatal(err)
	}

	auth.SubscribeClient(conn, token)
	comms.CommsHandler(conn, r)
}
