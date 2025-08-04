package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var singleton *firebase.App

func Get()*firebase.App{
	if singleton == nil {
		Init()
	}
	return singleton
}

func Init() {
	opt := option.WithCredentialsFile("twcfb.json") // replace with actual path
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase: %v", err)
	}
	singleton = app
}
