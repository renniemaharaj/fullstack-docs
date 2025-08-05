package conveyor

import (
	"backend/internal/entity"
	"backend/internal/signals"
	"context"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestManagerScaling(t *testing.T) {
	minWorkers := 1
	maxWorkers := 5
	thresholdUp := 3
	thresholdDown := 1

	manager := CreateManager(minWorkers, maxWorkers, thresholdUp, thresholdDown)
	manager.Start()

	// scale up scenario
	for range 10 {
		CONVEYOR_BELT <- Job{
			context.Background(),
			&entity.Person{
				Email: "_test",
			},
			&websocket.Conn{},
			&signals.Primitive{},
		}
	}

	time.Sleep(5 * time.Second) // Let workers scale up

	// check that workers increased
	if len(manager.workers) <= minWorkers {
		t.Errorf("Expected workers to scale up, but only %d running", len(manager.workers))
	}

	// scale down scenario
	time.Sleep(15 * time.Second)

	// should have reduced workers by now
	if len(manager.workers) != minWorkers {
		t.Errorf("Expected workers to scale back down to %d, but got %d", minWorkers, len(manager.workers))
	}

	manager.Stop()
}
