package conveyor

import (
	"backend/internal/signals"

	"github.com/gorilla/websocket"
)

func retryResponse(j *Job, err error) error {
	return j.Conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("retry").SetBody("Failure: "+err.Error()).Marshall())
}

func reloadResponse(j *Job) error {
	return j.Conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("reload").Marshall())
}
