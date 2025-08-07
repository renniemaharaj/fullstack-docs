package repository

import (
	"backend/internal/entity"
	"context"
	"fmt"

	dbx "github.com/go-ozzo/ozzo-dbx"
)

func (r *repository) CreateCommentOnDocument(ctx context.Context, content string, parentDocID int, author *entity.Person) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	description := fmt.Sprintf("@%d commented on this document: #%d", author.ID, parentDocID)
	eventID, err := createEvent(ctx, tx, parentDocID, author.ID, description)
	if err != nil {
		return err
	}

	if err := EnsurePersonExists(ctx, tx, author); err != nil {
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

func (r *repository) GetDocumentCommentsByID(ctx context.Context, docID int) ([]entity.Document, error) {
	var comments []entity.Document
	err := r.db.Select("d.*").
		From("documents d").
		Join("INNER", "comments c", dbx.NewExp("c.comment_id = d.id")).
		Where(dbx.HashExp{"c.document_id": docID}).
		All(&comments)
	return comments, err
}

func (r *repository) DeleteCommentByID(ctx context.Context, commentID int) error {
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
