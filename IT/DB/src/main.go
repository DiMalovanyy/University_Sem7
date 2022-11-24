package main

import (
	"os"

	grpcServer "github.com/DiMalovanyy/University_Sem7/IT/DB/src/server/grpc"
)

func main() {

    currentPath, err := os.Getwd()
    if err != nil {
        panic(err)
    }
    openApiPath := currentPath + "/genproto/database_grpc_service.swagger.json"
    databaseServer := grpcServer.NewDatabaseServer()
    if err := databaseServer.ListenAndServe("50051", openApiPath); err != nil {
        panic(err)
    }
}
