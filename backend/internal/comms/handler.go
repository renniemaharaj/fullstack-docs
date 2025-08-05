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
		break
	}

	if message != nil {
		sig := &signals.Primitive{}
		err := json.Unmarshal(message, sig)
		if err != nil {
			// Invalid JSON
			conn.WriteMessage(websocket.TextMessage,
				signals.New().SetTitle("retry").SetBody("Invalid signal format").Marshall())
			continue
		}

		// Valid JSON — process it
		person, err := auth.GetClient(conn)
		if err != nil {
			conn.WriteMessage(websocket.TextMessage,
				signals.New().SetTitle("retry").SetBody("Unauthorized: "+err.Error()).Marshall())
			continue
		}

		job := &conveyor.Job{
			Context: context.Background(),
			Person:  person,
			Conn:    conn,
			Sig:     sig,
		}
		conveyor.CONVEYOR_BELT <- *job
		conn.WriteMessage(websocket.TextMessage,
				signals.New().SetTitle("generic_wait").Marshall())
	}
}
}
