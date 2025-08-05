package signals

import (
	"encoding/json"

	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

type Primitive struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

func New() *Primitive {

	return &Primitive{}
}

func (p *Primitive) Marshall() []byte {
	primitiveBytes, err := json.Marshal(*p)
	if err != nil {
		logger.New().Prefix("Primitive").Fatal(err)
		return nil
	}
	return primitiveBytes
}

func (p *Primitive) SetTitle(t string) *Primitive {
	p.Title = t

	return p
}

func (p *Primitive) SetBody(b string) *Primitive {
	p.Body = b

	return p
}
