package main

import (
	"os"

	proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database"
	"github.com/sirupsen/logrus"
)

func main() {
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

}
