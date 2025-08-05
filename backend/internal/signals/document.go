package signals

import "backend/internal/entity"

// Expected type of a new document
type NewDocument struct {
	Title       string `json:"title"`
	Folder      string `json:"folder"`
	Description string `json:"description"`
}

func (n *NewDocument) ToFullDocument() *entity.Document {
	d := &entity.Document{}
	d.Title = n.Title
	d.Folder = n.Folder
	d.Description = entity.Content(n.Description)

	return d
}
