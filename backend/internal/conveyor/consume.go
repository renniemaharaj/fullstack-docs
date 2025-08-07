package conveyor

import (
	"backend/internal/signals"
	"encoding/json"
	"fmt"
	"time"

	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

// The worker's consumtion function
func (w *Worker) Consume(j *Job) error {
	if j.Person.Email == "_test" {
		// assume jobs is for tests, and simulate cunsumption
		time.Sleep(time.Second)
		return nil
	}

	signalBytes, _ := json.Marshal(j.Signal)
	logger.New().Prefix("Workers").Info(string(signalBytes))
	switch j.Signal.Title {
	case "/":
		return setDocumentsByAuthorID(j)
	case "/community":
		body := &signals.BodySetDocumentByID{}
		err := json.Unmarshal([]byte(j.Signal.Body), body)
		if err == nil {
			setDocumentViewByID(j, body.ID)
		}
		return setDocumentsPublished(j)
	case "/cdoc":
		return createDocumentByAuthorID(j)
	case "/udoc":
		return updateDocumentByID(j)
	default:
		return retryResponse(j, fmt.Errorf("unknown signal"))
	}
}
