package repository

import (
	"context"
	"fmt"
)

func InitDatabaseTables(ctx context.Context) error {
	dbx, err := getDBX()
	if err != nil {
		return err
	}

	queries := []string{
		// 1. People
		`CREATE TABLE IF NOT EXISTS people (
		id SERIAL PRIMARY KEY,
		first_name VARCHAR(100) NOT NULL,
		last_name VARCHAR(100) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL
	);`,

		// 2. Documents (without event_id FK initially)
		`CREATE TABLE IF NOT EXISTS documents (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT,
		content TEXT,
		folder TEXT,
		archived BOOLEAN DEFAULT FALSE,
		author_id INTEGER REFERENCES people(id),
		published BOOLEAN DEFAULT FALSE
	);`,

		// 3. Events (can reference documents now)
		`CREATE TABLE IF NOT EXISTS events (
		id SERIAL PRIMARY KEY,
		document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
		author_id INTEGER REFERENCES people(id),
		event_date TIMESTAMP NOT NULL,
		description TEXT NOT NULL,
		content TEXT
	);`,

		// 4. Add event_id foreign key to documents (after events table exists)
		`ALTER TABLE documents
	 ADD COLUMN IF NOT EXISTS event_id INTEGER REFERENCES events(id);`,

		// 5. Editors (many-to-many)
		`CREATE TABLE IF NOT EXISTS editors (
		document_id INTEGER REFERENCES documents(id),
		person_id INTEGER REFERENCES people(id),
		event_id INTEGER REFERENCES events(id),
		PRIMARY KEY (document_id, person_id)
	);`,

		// 6. Comments
		`CREATE TABLE IF NOT EXISTS comments (
		id SERIAL PRIMARY KEY,
		document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
		author_id INTEGER REFERENCES people(id),
		event_id INTEGER REFERENCES events(id),
		content TEXT NOT NULL
	);`,
	}

	for _, query := range queries {
		if _, err := dbx.NewQuery(query).Execute(); err != nil {
			return fmt.Errorf("init tables error: %w", err)
		}
	}

	return nil
}
