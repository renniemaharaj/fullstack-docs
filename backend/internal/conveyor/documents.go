package conveyor

import (
	"backend/internal/repository"
	"backend/internal/signals"
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

// This function gets and returns documents for the user associated with the job
func setDocumentsByAuthorID(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	docs, err := repo.GetDocumentsByAuthorID(j.Context, j.Person.ID)
	if err != nil {
		return retryResponse(j, err)
	}

	jobsMarshalled, _ := json.Marshal(docs)
	s := signals.New().SetTitle("setUserDocs").SetBody(string(jobsMarshalled)).Marshall()
	return j.Conn.WriteMessage(websocket.TextMessage, s)
}

// This function creates a document from the job's body for the user.
// It Then calls the get job function
func createDocumentByAuthorID(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	newDoc := &repository.NewDocument{}

	err = json.Unmarshal([]byte(j.Signal.Body), newDoc)
	if err != nil {
		return retryResponse(j, err)
	}

	err = repo.CreateDocument(j.Context, newDoc, j.Person)
	if err != nil {
		return retryResponse(j, err)
	}

	return setDocumentsByAuthorID(j)
}

// This function updates the document for the user associated with the job.
// And then calls get documents
func updateDocumentByID(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	uDoc := &repository.UpdateDocument{}
	err = json.Unmarshal([]byte(j.Signal.Body), uDoc)
	if err != nil {
		return retryResponse(j, err)
	}

	fullDoc, err := uDoc.ToFullDocument()
	if err != nil {
		return retryResponse(j, err)
	}

	if fullDoc.AuthorID != j.Person.ID {
		// Change this to return unauthorized
		return retryResponse(j, fmt.Errorf("Unauthorized"))
	}
	if uDoc.Delete {
		repo.DleteDocumentByID(j.Context, uDoc.ID)
		return setDocumentsByAuthorID(j)
	}

	if err = repo.UpdateDocument(j.Context, uDoc, j.Person); err != nil {
		return retryResponse(j, err)
	}

	return setDocumentsByAuthorID(j)
}

func setDocumentViewByID(j *Job, id int) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	doc, err := repo.GetDocumentByID(j.Context, id)
	if err != nil {
		return retryResponse(j, err)
	}

	jobsMarshalled, _ := json.Marshal(doc)
	s := signals.New().SetTitle("setDocumentView").SetBody(string(jobsMarshalled)).Marshall()
	return j.Conn.WriteMessage(websocket.TextMessage, s)
}

func setDocumentsPublished(j *Job) error {
	repo, err := repository.NewRepository()
	if err != nil {
		return retryResponse(j, err)
	}

	docs, err := repo.GetDocumentsPublished(j.Context)
	if err != nil {
		return retryResponse(j, err)
	}

	jobsMarshalled, _ := json.Marshal(docs)
	s := signals.New().SetTitle("setUserDocs").SetBody(string(jobsMarshalled)).Marshall()
	return j.Conn.WriteMessage(websocket.TextMessage, s)
}
