package conveyor

import (
	"backend/internal/entity"
	"backend/internal/signals"
	"context"

	"github.com/gorilla/websocket"
)

// Job represents a job on the conveyor belt
type Job struct {
	Context context.Context
	Person  *entity.Person
	Conn    *websocket.Conn
	Signal  *signals.Primitive
}
