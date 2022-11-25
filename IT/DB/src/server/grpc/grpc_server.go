package grpc

import (
	"context"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"

	proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database"
	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/sirupsen/logrus"
	"github.com/soheilhy/cmux"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/rs/cors"
)


type DatabaseServer struct {
    proto.UnimplementedDatabaseServiceServer

    databases []*database.Database
    logger* logrus.Entry
    backendDir string
}

func NewDatabaseServer(backendDir string) *DatabaseServer {
    logger := logrus.New()
    logger.SetLevel(logrus.DebugLevel)
    loggerEnt := logger.WithFields(logrus.Fields{"server": "grpc"})

    return &DatabaseServer{
        databases: make([]*database.Database, 0),
        logger: loggerEnt,
        backendDir: backendDir,
    }
}

func (server *DatabaseServer) ListenAndServe(port string) error {
    openapiPath := server.backendDir + "/genproto/database_grpc_service.swagger.json"
    staticDirPath := server.backendDir + "/frontend_build";
    s := grpc.NewServer()
    proto.RegisterDatabaseServiceServer(s, server)
    // Create mux for reverse grpc-gaateway proxy
    grpcMux := runtime.NewServeMux()
    err := proto.RegisterDatabaseServiceHandlerFromEndpoint(context.Background(), grpcMux, "localhost:" + port, []grpc.DialOption{grpc.WithInsecure()})
    if err != nil {
        err = fmt.Errorf("Error while creating Service endpoint: %v", err)
        server.logger.Error(err)
        return err
    }
    
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"*"},
        AllowedMethods: []string{"POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"},
        AllowedHeaders: []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
    })

    // Creating HTTP server
    r := mux.NewRouter()
    r.PathPrefix("/v1/api/").Handler(grpcMux)
    grpcMux.HandlePath("GET", "/v1/api/openapi.json", func(w http.ResponseWriter, r *http.Request, pathParams map[string]string) {
        server.logger.Info("OpenApi json requested")
        openApiBytes, err := ioutil.ReadFile(openapiPath)
        if err != nil {
            w.WriteHeader(http.StatusNotFound)
            w.Write([]byte(err.Error()))
            return
        }
        w.Header().Set("Content-Type", "application/octet-stream")
        w.Write(openApiBytes)
    })

    /*
    r.PathPrefix("/").Handler(grpcMux)
    grpcMux.HandlePath("GET", "/", func(w http.ResponseWriter, r *http.Request, pathParams map[string]string) {
        w.Header().Add("Content Type", "text/html")
        switch r.Method {
            case "GET": {
                server.logger.Debugf("Requested static data from %s", staticDirPath)
                if r.URL.Path == "" || r.URL.Path == "/" {
                    http.ServeFile(w, r, path.Join(staticDirPath, "index.html"))
                } else {
                    http.ServeFile(w, r, path.Join(staticDirPath, r.URL.Path))
                }
            }
        }
    })
    */
    r.PathPrefix("/").Handler(http.FileServer(http.Dir(staticDirPath)))
    
    httpServer := http.Server{
        Handler: c.Handler(r),
    }

    lis, err := net.Listen("tcp", ":" + port)
    if err != nil {
        err = fmt.Errorf("Error while creating listener for port %s. Error: %v", port, err)
        server.logger.Error(err)
        return err
    }

    cm := cmux.New(lis)
    httpListener := cm.Match(cmux.HTTP1Fast())
    grpcListener := cm.Match(cmux.HTTP2())

    go httpServer.Serve(httpListener)
    server.logger.Infof("RESTful gRPC-gateway reverse proxy server listening on %s", port)

    go s.Serve(grpcListener)
    server.logger.Infof("Database gRPC server listening on %s", port)

	if err := cm.Serve(); err != nil {
		server.logger.Fatalf("failed to serve: %v", err)
        return err
	}
    return nil
}

func (server *DatabaseServer) GetDatabaseList(ctx context.Context, in *emptypb.Empty) (*proto.GetDatabaseListResponse, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("GetDatabaseList request", in)

    list := &proto.GetDatabaseListResponse{}
    for _, db := range server.databases {
        list.DatabaseNames = append(list.DatabaseNames, db.GetName())
    }
    return list, nil
}
func (server *DatabaseServer) GetDatabase(ctx context.Context, in *proto.GetDatabaseRequest) (*proto.Database, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("GetDatabase request: %+v", in)
    for _, db := range server.databases {
        if db.GetName() == in.DatabaseName {
            return db.GetModel(), nil
        }
    }

    if in.CreateIfNotExist {
        newDb, err := database.NewDatabase(in.DatabaseName, server.logger)
        if (err != nil) {
            err = fmt.Errorf("Error while creating new database %s: %v", in.DatabaseName, err)
            return nil, err
        }
        server.databases = append(server.databases, newDb)
        return newDb.GetModel(), nil
    }
    err := fmt.Errorf("Database %s not found, and param CreateIfNotExist was not provided", in.DatabaseName)
    logger.Error(err)
    return nil, err
}

func (server *DatabaseServer) LoadDatabase(ctx context.Context, in *proto.LoadDatabaseRequest) (*proto.Database, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("LoadDatabase request: %+v", in)

    loadDir := server.backendDir + "/" + in.Directory
    newDb, err := database.LoadDatabase(loadDir, in.Filaname, server.logger)
    if err != nil {
        err := fmt.Errorf("Error while loading database from %s/%s: %v", in.Directory, in.Filaname, err)
        logger.Error(err)
        return nil, err
    }

    for _, db := range server.databases {
        if newDb.GetName() == db.GetName() {
            logger.Debugf("Database %s already in cache", newDb.GetName())
            return db.GetModel(), nil
        }
    }
    server.databases = append(server.databases, newDb)
    return newDb.GetModel(), nil
}
func (server *DatabaseServer) SaveDatabase(ctx context.Context, in *proto.SaveDatabaseRequest) (*emptypb.Empty, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("SaveDatabase request: %+v", in)

    for _, db := range server.databases {
        if db.GetName() == in.DatabaseName {
            if err := db.Save(in.Directory); err != nil {
                err := fmt.Errorf("Error while save database %s to disk %s/%s",  in.DatabaseName, in.Directory, in.DatabaseName)
                logger.Error(err)
                return &emptypb.Empty{}, err
            }
            return &emptypb.Empty{}, nil
        }
    }

    err := fmt.Errorf("Database %s does not exist", in.DatabaseName)
    logger.Error(err)
    return &emptypb.Empty{}, err
}

func (server *DatabaseServer) GetTable(ctx context.Context, in *proto.GetTableRequest) (*proto.Table, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("GetTable request: %+v", in)

    for _, db := range server.databases {
        if db.GetName() == in.TableIdentifier.DatabaseName {
            table, err := db.GetTableModel(in.TableIdentifier.TableName)
            if err != nil {
                if in.CreateIfNotExist {
                    _, err := db.AddTable(in.TableIdentifier.TableName)
                    if err != nil {
                        err = fmt.Errorf("Error while try to get table %s from database %s. Error: %v", in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName, err)
                            logger.Error(err)
                            return nil, err
                    }
                    return db.GetTableModel(in.TableIdentifier.TableName)
                } 
                err = fmt.Errorf("Table %s in Database %s not found, and param CreateIfNotExist was not provided", 
                    in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName)
                logger.Error(err)
                return nil, err
            }
            return table, nil
        }
    }

    err := fmt.Errorf("Database %s does not exist", in.TableIdentifier.DatabaseName)
    logger.Error(err)
    return nil, err
}

func (server *DatabaseServer) DeleteTable(ctx context.Context, in *proto.DeleteTableRequest) (*emptypb.Empty, error) {
    err := fmt.Errorf("Unimplemented")
    server.logger.Error(err)
    return &emptypb.Empty{}, err
}

func (server *DatabaseServer) AppendRow(ctx context.Context, in *proto.AppendRowRequest) (*emptypb.Empty, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("AppendRow request: %+v", in)

    for _, db := range server.databases {
        if db.GetName() == in.TableIdentifier.DatabaseName {
            table, err := db.GetTable(in.TableIdentifier.TableName)
            if err != nil {
                err = fmt.Errorf("Error while try to get table %s from database %s. Error: %v", in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName, err)
                logger.Error(err)
                return &emptypb.Empty{}, err
            }
            table.AppendRow()
            return &emptypb.Empty{}, nil
        }
    }
    
    err := fmt.Errorf("Database %s does not exist", in.TableIdentifier.DatabaseName)
    logger.Error(err)
    return &emptypb.Empty{}, err
}

func (server *DatabaseServer) AppendColumn(ctx context.Context, in *proto.AppendColumnRequest) (*emptypb.Empty, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("AppendColumn request: %+v", in)

    for _, db := range server.databases {
        if db.GetName() == in.TableIdentifier.DatabaseName {
            table, err := db.GetTable(in.TableIdentifier.TableName)
            if err != nil {
                err = fmt.Errorf("Error while try to get table %s from database %s. Error: %v", in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName, err)
                logger.Error(err)
                return &emptypb.Empty{}, err
            }
            table.AppendColumn()
            return &emptypb.Empty{}, nil
        }
    }
    
    err := fmt.Errorf("Database %s does not exist", in.TableIdentifier.DatabaseName)
    logger.Error(err)
    return &emptypb.Empty{}, err
}

func (server *DatabaseServer) ChangeData(ctx context.Context, in *proto.ChangeDataRequest) (*emptypb.Empty, error) {
    logger := getContextLogger(ctx, server.logger)
    logger.Infof("ChangeData request: %+v", in)

    for _, db := range server.databases {
        if db.GetName() == in.TableIdentifier.DatabaseName {
            table, err := db.GetTable(in.TableIdentifier.TableName)
            if err != nil {
                err = fmt.Errorf("Error while try to get table %s from database %s. Error: %v", in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName, err)
                logger.Error(err)
                return &emptypb.Empty{}, err
            }
            if err = table.SetData(int(in.TableData.RowIndex), int(in.TableData.ColumnIndex), in.TableData.NewData); err != nil {
                err = fmt.Errorf("Error while Set new data %v, to table %s in database %s. Error: %v", 
                        in.TableData.NewData, in.TableIdentifier.TableName, in.TableIdentifier.DatabaseName, err)
                logger.Error(err)
                return &emptypb.Empty{}, err
            }
            return &emptypb.Empty{}, nil
        }
    }
    
    err := fmt.Errorf("Database %s does not exist", in.TableIdentifier.DatabaseName)
    logger.Error(err)
    return &emptypb.Empty{}, err
}
