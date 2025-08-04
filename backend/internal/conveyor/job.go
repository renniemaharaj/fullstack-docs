package conveyor

import (
	"backend/internal/entity"
	"backend/internal/signals"

	"github.com/gorilla/websocket"
)

// Job represents a job on the conveyor belt
type Job struct {
	Person *entity.Person
	Conn   *websocket.Conn
	Sig    *signals.Primitive
}
