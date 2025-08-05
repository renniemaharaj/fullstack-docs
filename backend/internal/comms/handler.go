package comms

import (
	"backend/internal/auth"
	"backend/internal/conveyor"
	"backend/internal/signals"
	"context"
	"encoding/json"
	"fmt"
	"html"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

func CommsHandler(conn *websocket.Conn, r *http.Request) {
	l := logger.New().Prefix("Comms")

	// write to client: successfully connected
	iSignal := &signals.Primitive{}
	iSignal.SetTitle("onSubscribed")
	conn.WriteMessage(websocket.TextMessage, iSignal.Marshall())

	l.Info(fmt.Sprintf("%s client connected", html.EscapeString(r.URL.Path)))

	// Cleanup client, and close connection
	defer func() {
		auth.UnsubscribeClient(conn)
		conn.Close()
	}()

	for {
		mt, message, err := conn.ReadMessage()
		if err != nil || mt == websocket.CloseMessage {
			break // Exit the blocking loop if client tries to close
		}

		// handle incoming messages
		if message != nil {
			sig := &signals.Primitive{}
			if err := json.Unmarshal(message, sig); err != nil {
				if person, err := auth.GetClient(conn); err != nil {
					job := &conveyor.Job{
						Context: context.Background(),
						Person:  person,
						Conn:    conn,
						Sig:     sig,
					}

					conveyor.CONVEYOR_BELT <- *job
				}
			}
		}
	}
}
