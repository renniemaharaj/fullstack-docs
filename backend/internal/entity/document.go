package entity

// The document type
type Document struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Description Content `json:"description"`
	Content     Content `json:"content"`
	AuthorID    int     `json:"authorID"`
	EventID     int     `json:"eventID"`
	Archived    bool    `json:"archived"`
	Published   bool    `json:"published"`
}
