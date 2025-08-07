// helpers.go
package repository

import (
	"backend/internal/entity"
	"context"
	"time"

	dbx "github.com/go-ozzo/ozzo-dbx"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

var l = logger.New().Prefix("Repository")

// Expected type of a new document
type NewDocument struct {
	Title       string `json:"title"`
	Folder      string `json:"folder"`
	Description string `json:"description"`
}

// Expected type of update document request
type UpdateDocument struct {
	NewDocument
	Publish bool           `json:"publish"`
	Delete  bool           `json:"delete"`
	ID      int            `json:"id"`
	Content entity.Content `json:"content"`
}

// ToFullDocument function will get the full document from db and merge
// with the new document
func (n *UpdateDocument) ToFullDocument() (*entity.Document, error) {
	repo, err := NewRepository()
	if err != nil {
		return nil, err
	}
	doc, err := repo.GetDocumentByID(context.Background(), n.ID)
	if err != nil {
		return nil, err
	}
	// Merge document from db with updated document
	doc.Title = n.Title
	doc.Description = entity.Content(n.Description)
	doc.Content = n.Content
	doc.Folder = n.Folder
	doc.Published = n.Publish

	return doc, nil
}

// This function inserts a document into the transaction
func insertDocument(ctx context.Context, tx *dbx.Tx, doc *entity.Document) error {
	res := tx.Insert("documents", dbx.Params{
		"title":       doc.Title,
		"description": doc.Description,
		"content":     doc.Content,
		"author_id":   doc.AuthorID,
		"folder":      doc.Folder,
		"archived":    doc.Archived,
		"published":   doc.Published,
	})
	if _, err := res.Execute(); err != nil {
		return err
	}

	return tx.Select("id").From("documents").
		Where(dbx.HashExp{"author_id": doc.AuthorID, "title": doc.Title}).
		OrderBy("id DESC").Limit(1).Row(&doc.ID)
}

// This function will create a document row for the person if not exists
func EnsurePersonExists(ctx context.Context, db dbx.Builder, p *entity.Person) error {
	var existing entity.Person
	err := db.Select().From("people").Where(dbx.HashExp{"email": p.Email}).One(&existing)
	if err == nil {
		p.ID = existing.ID
		return nil
	}

	res := db.Insert("people", dbx.Params{
		"first_name": p.FirstName,
		"last_name":  p.LastName,
		"email":      p.Email,
	})
	if _, err := res.Execute(); err != nil {
		return err
	}

	return db.Select("id").From("people").Where(dbx.HashExp{"email": p.Email}).One(&p.ID)
}

// This internal function creates an event and returns the event ID
func createEvent(ctx context.Context, db dbx.Builder, docID, authorID int, description string) (int, error) {
	doc := &entity.Document{}
	err := db.Select("*").From("documents").
		Where(dbx.HashExp{"id": docID}).OrderBy("id DESC").Limit(1).One(doc)
	if err != nil {
		l.Fatal(err)
		return 0, err
	}

	insert := db.Insert("events", dbx.Params{
		"document_id": docID,
		"author_id":   authorID,
		"event_date":  time.Now().UTC(),
		"description": description,
		"content":     doc.Content,
	})
	if _, err := insert.Execute(); err != nil {
		l.Fatal(err)
		return 0, err
	}

	var eventID int
	err = db.Select("id").From("events").Where(dbx.HashExp{
		"document_id": docID,
		"author_id":   authorID,
		"description": description,
		"content":     doc.Content,
	}).OrderBy("id DESC").Limit(1).Row(&eventID)
	if err != nil {
		l.Fatal(err)
		return 0, err
	}

	return eventID, nil
}
