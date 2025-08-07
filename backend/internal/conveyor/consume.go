package conveyor

import (
	"backend/internal/signals"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gorilla/websocket"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

// The worker's consumtion function
func (w *Worker) Consume(j *Job) error {
	if j.Person.Email == "_test" {
		// assume jobs is for tests, and simulate cunsumption
		time.Sleep(time.Second)
		return nil
	}

	signalBytes, _ := json.Marshal(j.Sig)
	logger.New().Prefix("Workers").Info(string(signalBytes))

	switch j.Sig.Title {
	case "/":
		return getDocumentsByAuthorID(j)
	case "/community":
		return getPublishedDocuments(j)
	case "/cdoc":
		j.Conn.WriteMessage(websocket.TextMessage,
			signals.New().SetTitle("cdoc_consuming").Marshall())
		return createDocumentByAuthorID(j)
	case "/udoc":
		j.Conn.WriteMessage(websocket.TextMessage,
			signals.New().SetTitle("udoc_consuming").Marshall())
		return updateDocumentByID(j)
	default:
		return retryResponse(j, fmt.Errorf("unknown signal"))
	}
}
