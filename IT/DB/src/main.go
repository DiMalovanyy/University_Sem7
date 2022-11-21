package main

import "github.com/DiMalovanyy/University_Sem7/IT/DB/src/server/grpc"

//"fmt"
//"os"

//proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
//"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database"
//"github.com/sirupsen/logrus"

func main() {
    /*
    var logger = logrus.New()
    logger.SetLevel(logrus.DebugLevel)

    db, _ := database.NewDatabase("test", logger)

    table, _ := db.AddTable("test_table")

    table.AppendRow()
    table.AppendRow()
    table.AppendRow()
    table.AppendColumn()
    table.AppendColumn()
    
    db.Dump(os.Stdout)

    table.SetData(0, 1, &proto.Data{
        Data: &proto.Data_IntegerData{
            IntegerData: 1,
        } ,
    })
    table.SetData(2, 1, &proto.Data{
        Data: &proto.Data_IntegerData{
            IntegerData: 2,
        },
    })
    table.SetData(1, 0, &proto.Data{
        Data: &proto.Data_StringData{
            StringData: "hello",
        },
    })

    db.Dump(os.Stdout)
    fmt.Println("-----------------------------------")

    db.Save("./bin")

    newDb, _ := database.LoadDatabase("./bin", "test", logger)
    newDb.ChangeName("another_db")

    newDb.Dump(os.Stdout)
    table.SetData(0, 0, &proto.Data{
        Data: &proto.Data_FloatData{
            FloatData: 0.1,
        },
    }) // <------ Should prduce error (add float to int column)

    table2, _ := newDb.GetTable("test_table")
    table2.SetData(0, 0, &proto.Data{
        Data: &proto.Data_StringData{
            StringData: "test",
        },
    })
    table2.AppendColumn()
    table2.SetData(0, 2, &proto.Data {
        Data: &proto.Data_PictureData {
            PictureData: &proto.PictureData{
                PictureName: "test",
                PictureFormat: "png",
            },
        },
    })
    table2.AppendRow()
    newDb.Dump(os.Stdout)
    */

    databaseServer := grpc.NewDatabaseServer()
    if err := databaseServer.ListenAndServe("50051"); err != nil {
        panic(err)
    }
}
