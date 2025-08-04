package document

import (
	"context"
	"database/sql"
	"fmt"
)

func InitDB(ctx context.Context, db *sql.DB) error {
	queries := []string{
		// Documents Table
		`CREATE TABLE IF NOT EXISTS documents (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			content TEXT,
			archived BOOLEAN DEFAULT FALSE,
			author_id INTEGER REFERENCES people(id),
			event_id INTEGER REFERENCES events(id)
			published BOOLEAN DEFAULT FALSE
		);`,

		// People Table
		`CREATE TABLE IF NOT EXISTS people (
			id SERIAL PRIMARY KEY,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL
		);`,

		// Editors (Many-to-Many)
		`CREATE TABLE IF NOT EXISTS editors (
			document_id INTEGER REFERENCES documents(id),
			person_id INTEGER REFERENCES people(id),
			event_id INTEGER REFERENCES events(id)
			PRIMARY KEY (document_id, person_id)
		);`,

		// Comments Table (Each comment is a Document + Author + Parent Document)
		`CREATE TABLE IF NOT EXISTS comments (
			id SERIAL PRIMARY KEY,
			document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
			author_id INTEGER REFERENCES people(id),
			event_id INTEGER REFERENCES events(id)
			content TEXT NOT NULL
		);`,

		// Events Table (History/Activity)
		`CREATE TABLE IF NOT EXISTS events (
			id SERIAL PRIMARY KEY,
			document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
			author_id INTEGER REFERENCES people(id),
			event_date TIMESTAMP NOT NULL,
			description TEXT NOT NULL,
			content TEXT
		);`,
	}

	for _, query := range queries {
		if _, err := db.ExecContext(ctx, query); err != nil {
			return fmt.Errorf("init db error: %w", err)
		}
	}

	return nil
}
