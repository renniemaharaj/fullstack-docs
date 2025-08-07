package repository

import (
	"backend/internal/entity"
	"context"
	"fmt"
	"os"

	dbx "github.com/go-ozzo/ozzo-dbx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

// Repository definition
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
	l  *logger.Logger
}

func GetDBX() (*dbx.DB, error) {
	l := logger.New().Prefix("Repository")
	// Load .env file
	if err := godotenv.Load(); err != nil {
		l.Fatal(err)
	}

	if dsn := os.Getenv("POSTGRE_DSN"); dsn != "" {
		db, err := dbx.Open("postgres", dsn)
		if err != nil {
			return nil, err
		}
		return db, nil
	}

	return nil, fmt.Errorf("couldn't open database connection")
}

// NewRepository opens a Postgres database and returns a repository instance
func NewRepository() (*repository, error) {
	if dbx, err := GetDBX(); err == nil {
		return newRepository(dbx), nil
	}

	return nil, fmt.Errorf("couldn't load repository")
}

// Internal new repository
func newRepository(db *dbx.DB) *repository {
	return &repository{db: db, l: logger.New().Prefix("Repository")}
}
