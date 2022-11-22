package main

import (
	grpcServer "github.com/DiMalovanyy/University_Sem7/IT/DB/src/server/grpc"
)

func main() {
    databaseServer := grpcServer.NewDatabaseServer()
    if err := databaseServer.ListenAndServe("50051"); err != nil {
        panic(err)
    }
}
