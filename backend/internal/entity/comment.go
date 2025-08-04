package entity

// Shape of a comment
type Comment struct {
	AuthorID   int    `json:"authorID"`
	Content    string `json:"content"`
	DocumentID int    `json:"documentID"`
	EventID    int    `json:"eventID"`
	ID         int    `json:"id"`
}
