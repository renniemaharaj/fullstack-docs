package document

import dbx "github.com/go-ozzo/ozzo-dbx"

// NewDBRepository opens a Postgres database and returns a repository instance
func NewDBRepository(dsn string) (*repository, error) {
	db, err := dbx.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	return &repository{db: db}, nil
}