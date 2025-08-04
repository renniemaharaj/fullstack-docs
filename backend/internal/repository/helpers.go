// helpers.go
package document

import (
	"backend/internal/entity"
	"context"
	"time"

	dbx "github.com/go-ozzo/ozzo-dbx"
)

func insertDocument(ctx context.Context, tx *dbx.Tx, doc *entity.Document, eventID int) error {
	res := tx.Insert("documents", dbx.Params{
		"title":       doc.Title,
		"description": doc.Description,
		"content":     doc.Content,
		"author_id":   doc.AuthorID,
		"event_id":    eventID,
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

func CreatePersonIfNotExists(ctx context.Context, db dbx.Builder, p *entity.Person) error {
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

func createAndFetchEventID(ctx context.Context, db dbx.Builder, docID, authorID int, description string) (int, error) {
	var content entity.Content
	err := db.Select("content").From("documents").
		Where(dbx.HashExp{"id": docID}).OrderBy("id DESC").Limit(1).One(&content)
	if err != nil {
		return 0, err
	}

	insert := db.Insert("events", dbx.Params{
		"document_id": docID,
		"author_id":   authorID,
		"event_date":  time.Now().UTC(),
		"description": description,
		"content":     content,
	})
	if _, err := insert.Execute(); err != nil {
		return 0, err
	}

	var eventID int
	err = db.Select("id").From("events").Where(dbx.HashExp{
		"document_id": docID,
		"author_id":   authorID,
		"description": description,
		"content":     content,
	}).OrderBy("id DESC").Limit(1).Row(&eventID)
	if err != nil {
		return 0, err
	}

	return eventID, nil
}
