package conveyor

import (
	"backend/internal/repository"
	"backend/internal/signals"
	"encoding/json"

	"github.com/gorilla/websocket"
)

func getUserDocuments(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	docs, err := repo.GetDocumentsForAuthorID(j.Context, j.Person.ID)
	if err != nil {
		return retryResponse(j, err)
	}

	jobsMarshalled, _ := json.Marshal(docs)
	s := signals.New().SetTitle("setUserDocs").SetBody(string(jobsMarshalled)).Marshall()
	return j.Conn.WriteMessage(websocket.TextMessage, s)
}

func createUserDocument(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	newDoc := &signals.NewDocument{}

	err = json.Unmarshal([]byte(j.Sig.Body), newDoc)
	if err != nil {
		return retryResponse(j, err)
	}

	err = repo.CreateDocumentWithEvent(j.Context, newDoc.ToFullDocument(), j.Person)
	if err != nil {
		return retryResponse(j, err)
	}
	return reloadResponse(j)
}
