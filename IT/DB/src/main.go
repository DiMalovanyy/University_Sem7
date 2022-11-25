package main

import (
	"flag"
	"fmt"

	grpcServer "github.com/DiMalovanyy/University_Sem7/IT/DB/src/server/grpc"
)

func main() {
    backendDir := flag.String("dir", "", "Backend dir") 
    flag.Parse()

    if backendDir == nil || *backendDir == "" {
        err := fmt.Errorf("You should provide --dir argument")
        panic(err)
    }

    databaseServer := grpcServer.NewDatabaseServer(*backendDir)
    if err := databaseServer.ListenAndServe("50051"); err != nil {
        panic(err)
    }
}
