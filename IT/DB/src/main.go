package main

import (
	"os"

	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database"
	"github.com/sirupsen/logrus"
)

func main() {
    var logger = logrus.New()
    logger.SetLevel(logrus.DebugLevel)

    db, _ := database.NewDatabase("test", logger)
    db.AddTable("test_table")

    db.Dump(os.Stdout)
    
}
