package conveyor

import (
	"backend/internal/repository"
	"backend/internal/signals"
	"encoding/json"
	"time"

	"github.com/gorilla/websocket"
)

// The worker's consumtion function
func (w *Worker) Consume(j *Job) error {
	if j.Person.Email == "_test" {
		// assume jobs is for tests, and simulate cunsumption
		time.Sleep(time.Second)
		return nil
	}

	switch j.Sig.Title {
	case "/":
		if repo, err := repository.NewRepository(); err != nil {
			docs, err := repo.GetDocumentsForAuthorID(j.Context, j.Person.ID)
			if err != nil {
				return j.Conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("retry").Marshall())
			}

			jobsMarshalled, _ := json.Marshal(docs)
			s := signals.New().SetTitle("userDocs").SetBody(string(jobsMarshalled)).Marshall()
			return j.Conn.WriteMessage(websocket.TextMessage, s)
		}
		return j.Conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("retry").Marshall())
	default:
		return j.Conn.WriteMessage(websocket.TextMessage, signals.New().SetTitle("retry").Marshall())
	}
}
