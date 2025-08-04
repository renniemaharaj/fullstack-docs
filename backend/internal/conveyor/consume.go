package conveyor

import "time"

// The worker's consumtion function
func (w *Worker) Consume(j *Job) {
	if j.Person.Email == "_test" {
		// assume jobs is for tests, and simulate cunsumption
		time.Sleep(time.Second)
		return
	}

	// switch j.Sig.Title {
	// case "get":

	// }

}
