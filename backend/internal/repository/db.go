package repository

import (
	"fmt"
	"os"

	dbx "github.com/go-ozzo/ozzo-dbx"
	"github.com/joho/godotenv"
	"github.com/renniemaharaj/grouplogs/pkg/logger"

	_ "github.com/lib/pq"
)

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
