package repository

import (
	"backend/internal/entity"
	"context"
	"fmt"

	dbx "github.com/go-ozzo/ozzo-dbx"
)

type Repository interface {
	// Create document with event
	CreateDocumentWithEvent(ctx context.Context, doc *entity.Document, author *entity.Person, description, content string) error
	// Update document with event
	UpdateDocumentWithEvent(ctx context.Context, doc *entity.Document, author *entity.Person, description, content string) error
	// Create comment with event
	CreateCommentWithEvent(ctx context.Context, content string, parentDocID int, author *entity.Person) error
	// Get document by id
	GetDocumentByID(ctx context.Context, id int) (*entity.Document, error)
	// Get comment by document id
	GetComments(ctx context.Context, docID int) ([]entity.Document, error)
	// Delete document by id
	DeleteDocument(ctx context.Context, id int) error
	// Delete comment by id
	DeleteComment(ctx context.Context, commentID int) error
}

type repository struct {
	db *dbx.DB
}

func newRepository(db *dbx.DB) *repository {
	return &repository{db: db}
}

// ==== DOCUMENTS ====

func (r *repository) CreateDocumentWithEvent(ctx context.Context, doc *entity.Document, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := CreatePersionIfNotExists(ctx, tx, author); err != nil {
		return err
	}

	eventID, err := createAndFetchEventID(ctx, tx, doc.ID, author.ID, fmt.Sprintf("@%d created this document: #%d", author.ID, doc.ID))
	if err != nil {
		return err
	}

	doc.AuthorID = author.ID
	if err := insertDocument(ctx, tx, doc, eventID); err != nil {
		return err
	}

	return tx.Commit()
}

func (r *repository) UpdateDocumentWithEvent(ctx context.Context, doc *entity.Document, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := CreatePersionIfNotExists(ctx, tx, author); err != nil {
		return err
	}

	eventID, err := createAndFetchEventID(ctx, tx, doc.ID, author.ID, fmt.Sprintf("@%d updated this document: #%d", author.ID, doc.ID))
	if err != nil {
		return err
	}

	_, err = tx.Update("documents", dbx.Params{
		"title":       doc.Title,
		"description": doc.Description,
		"content":     doc.Content,
		"archived":    doc.Archived,
		"published":   doc.Published,
		"author_id":   doc.ID,
		"event_id":    eventID,
	}, dbx.HashExp{"id": doc.ID}).Execute()
	if err != nil {
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

func (r *repository) GetDocumentsForAuthorID(ctx context.Context, id int) (*[]entity.Document, error) {
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

// ==== COMMENTS ====

func (r *repository) CreateCommentWithEvent(ctx context.Context, content string, parentDocID int, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	description := fmt.Sprintf("@%d commented on this document: #%d", author.ID, parentDocID)
	eventID, err := createAndFetchEventID(ctx, tx, parentDocID, author.ID, description)
	if err != nil {
		return err
	}

	if err := CreatePersionIfNotExists(ctx, tx, author); err != nil {
		return err
	}

	res := tx.Insert("comment", dbx.Params{
		"content":     content,
		"document_id": parentDocID,
		"author_id":   author.ID,
		"event_id":    eventID,
	})
	if _, err := res.Execute(); err != nil {
		return err
	}

	return tx.Commit()
}

func (r *repository) GetComments(ctx context.Context, docID int) ([]entity.Document, error) {
	var comments []entity.Document
	err := r.db.Select("d.*").
		From("documents d").
		Join("INNER", "comments c", dbx.NewExp("c.comment_id = d.id")).
		Where(dbx.HashExp{"c.document_id": docID}).
		All(&comments)
	return comments, err
}

func (r *repository) DeleteComment(ctx context.Context, commentID int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Delete("comments", dbx.HashExp{"comment_id": commentID}).Execute(); err != nil {
		return err
	}

	return tx.Commit()
}
