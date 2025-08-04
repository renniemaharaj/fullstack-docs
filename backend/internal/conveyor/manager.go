package conveyor

import (
	"fmt"
	"sync"
	"time"

	"github.com/renniemaharaj/grouplogs/pkg/logger"
)

// The manager shape
type Manager struct {
	l             *logger.Logger
	mu            sync.Mutex
	workers       []*Worker
	ticker        *time.Ticker
	quit          chan struct{}
	minWorkers    int
	maxWorkers    int
	thresholdUp   int // if queue length > thresholdUp, scale up
	thresholdDown int // if queue length < thresholdDown, scale down
}

// Create a new manager with min, max scale up at, and scale down at
func CreateManager(min, max, up, down int) *Manager {
	logger.New().Prefix("Manager").Info(fmt.Sprintf(`
	Creating a manager. Will allow %d min, and %d max workers.
	Will scale up at %d, and scale down at %d jobs`, min, max, up, down))

	return &Manager{
		l:             logger.New().Prefix("Manager"),
		minWorkers:    min,
		maxWorkers:    max,
		thresholdUp:   up,
		thresholdDown: down,
		quit:          make(chan struct{}),
		ticker:        time.NewTicker(2 * time.Second),
	}
}

// Manager start function
func (m *Manager) Start() {
	// Initialize min workers
	for range m.minWorkers {
		m.scaleWorkersUp()
	}

	// Routine
	go func() {
		for {
			select {
			case <-m.ticker.C:
				m.routineCheck()
			case <-m.quit:
				m.stopAll()
				return
			}
		}
	}()
}

// Manager
func (m *Manager) Stop() {
	close(m.quit)
	m.ticker.Stop()
}

// Manager's routine check
func (m *Manager) routineCheck() {
	m.mu.Lock()
	defer m.mu.Unlock()

	queueLen := len(CONVEYOR_BELT)

	if queueLen > m.thresholdUp && len(m.workers) < m.maxWorkers {
		m.l.Info(fmt.Sprintf("At %d current workers, scaling up. Jobs queued: %d", len(m.workers), queueLen))
		m.scaleWorkersUp()
	} else if queueLen < m.thresholdDown && len(m.workers) > m.minWorkers {
		m.l.Info(fmt.Sprintf("At %d current workers, scaling down. Jobs queued: %d", len(m.workers), queueLen))
		m.scaleWorkersDown()
	}
}

// scaleWorkersUp internal function, creates and starts a new worker
func (m *Manager) scaleWorkersUp() {
	w := &Worker{}
	m.workers = append(m.workers, w)
	go w.Start()
}

// scaleWorkersDown internal function, stops the last worker safely and removes
func (m *Manager) scaleWorkersDown() {
	if len(m.workers) == 0 {
		return
	}

	last := m.workers[len(m.workers)-1]
	last.Stop() // Worker will complete its current job before
	m.workers = m.workers[:len(m.workers)-1]
}

// stopAll function safely stops all works
func (m *Manager) stopAll() {
	for _, w := range m.workers {
		w.Stop()
	}
	m.workers = nil
}
