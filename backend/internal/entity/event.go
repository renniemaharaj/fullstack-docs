package entity

import "time"

// An event type
type Event struct {
	ID          int       `json:"id"`
	DocumentID  int       `json:"documentID"`
	AuthorID    int       `json:"authorID"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Content     Content   `json:"content"`
}
