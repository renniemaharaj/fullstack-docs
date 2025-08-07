package repository

import (
	"backend/internal/entity"
	"context"
	"fmt"

	dbx "github.com/go-ozzo/ozzo-dbx"
)

func (r *repository) CreateDocument(ctx context.Context, newDoc *NewDocument, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		r.l.Fatal(err)
		return err
	}
	defer tx.Rollback()

	// Ensure author exists
	if err := EnsurePersonExists(ctx, tx, author); err != nil {
		r.l.Fatal(err)
		return err
	}

	// Create new document and populate fields from newDoc
	doc := &entity.Document{}
	doc.Title = newDoc.Title
	doc.Description = entity.Content(newDoc.Description)
	doc.Folder = newDoc.Folder
	doc.AuthorID = author.ID

	// Step 1: insert document without event_id
	if err := insertDocument(ctx, tx, doc); err != nil {
		r.l.Fatal(err)
		return err
	}

	// Step 2: create the event referencing document
	eventID, err := createEvent(ctx, tx, doc.ID, author.ID,
		fmt.Sprintf("@%d created this document: #%d", author.ID, doc.ID))
	if err != nil {
		r.l.Fatal(err)
		return err
	}

	// Step 3: update document with event_id
	_, err = tx.Update("documents", dbx.Params{
		"event_id": eventID,
	}, dbx.HashExp{"id": doc.ID}).Execute()
	if err != nil {
		r.l.Fatal(err)
		return err
	}

	return tx.Commit()
}

func (r *repository) UpdateDocument(ctx context.Context, doc *UpdateDocument, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := EnsurePersonExists(ctx, tx, author); err != nil {
		r.l.Fatal(err)
		return err
	}

	eventID, err := createEvent(ctx, tx, doc.ID, author.ID, fmt.Sprintf("@%d updated this document: #%d", author.ID, doc.ID))
	if err != nil {
		r.l.Fatal(err)
		return err
	}

	_, err = tx.Update("documents", dbx.Params{
		"title":       doc.Title,
		"folder":      doc.Folder,
		"description": doc.Description,
		"content":     doc.Content,
		"published":   doc.Publish,
		"event_id":    eventID,
	}, dbx.HashExp{"id": doc.ID}).Execute()
	if err != nil {
		r.l.Fatal(err)
		return err
	}

	return tx.Commit()
}

func (r *repository) GetDocumentByID(ctx context.Context, id int) (*entity.Document, error) {
	var doc entity.Document
	err := r.db.Select().From("documents").Where(dbx.HashExp{"id": id}).One(&doc)
	if err != nil {
		return nil, err
	}
	return &doc, nil
}

func (r *repository) GetDocumentsByAuthorID(ctx context.Context, id int) (*[]entity.Document, error) {
	var docs []entity.Document
	err := r.db.Select().From("documents").Where(dbx.HashExp{"author_id": id}).All(&docs)
	if err != nil {
		return nil, err
	}
	return &docs, nil
}

func (r *repository) GetDocumentsPublished(ctx context.Context) (*[]entity.Document, error) {
	var docs []entity.Document
	err := r.db.Select().From("documents").Where(dbx.HashExp{"published": true}).All(&docs)
	if err != nil {
		return nil, err
	}
	return &docs, nil
}

func (r *repository) DeleteDocument(ctx context.Context, id int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Delete("comments", dbx.HashExp{"document_id": id}).Execute(); err != nil {
		return err
	}
	if _, err := tx.Delete("editors", dbx.HashExp{"document_id": id}).Execute(); err != nil {
		return err
	}
	if _, err := tx.Delete("documents", dbx.HashExp{"id": id}).Execute(); err != nil {
		return err
	}

	return tx.Commit()
}
