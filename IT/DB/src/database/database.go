package database

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"

	pb "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database/table"
	"github.com/sirupsen/logrus"
	"google.golang.org/protobuf/proto"
)

type Database struct {
    database *pb.Database // Owning database
    logger *logrus.Entry
}

func NewDatabase(name string, baseLogger *logrus.Entry) (*Database, error) {
    logger := baseLogger.WithFields(logrus.Fields{"database": name})
    databasePb := &pb.Database{
        Name: name,
        Tables: []*pb.Table{},
    }

    logger.Infof("Databse %s created", name)
    return &Database{
        database: databasePb, 
        logger: logger,
    }, nil
}

func LoadDatabase(directory string, name string, baseLogger* logrus.Entry) (*Database, error) {
    logger := baseLogger.WithFields(logrus.Fields{"database": name})

    filepath := directory + "/" + name
    inData, err := ioutil.ReadFile(filepath)
    if err != nil {
        logger.Errorf("Could not read file %s. Error: %v", filepath, err)
        return nil, err
    }
    databasePb := &pb.Database{}
    if err = proto.Unmarshal(inData, databasePb); err != nil {
        logger.Errorf("Could not deserialize file %s. Error: %v", filepath, err)
        return nil, err
    }

    logger.Infof("Database successfully read from file %s", filepath)
    return &Database{
        database: databasePb,
        logger: logger,
    }, nil
}

func (db Database) GetName() string {
    return db.database.Name 
}

func (db Database) GetModel() *pb.Database {
    return db.database
}

func (db *Database) ChangeName(newName string) {
    db.logger = db.logger.WithFields(logrus.Fields{"database": newName})
    db.logger.Debugf("Database name Changed %s -> %s.", db.database.Name, newName)
    db.database.Name = newName
}

func (db Database) GetTableNames() []string {
    tableNames := []string{}
    for _, tablePb := range db.database.Tables {
        tableNames = append(tableNames, tablePb.Name)
    }
    return tableNames
}

func (db Database) GetTableModel(tableName string) (*pb.Table, error) {
    for _, tablePb := range db.database.Tables {
        if tablePb.Name == tableName {
            return tablePb, nil
        }
    }
    err := fmt.Errorf("Could not found %s table in database %s", tableName, db.GetName())
    return nil, err
}

func (db *Database) Save(directory string) error {
    outData, err := proto.Marshal(db.database)
    if err != nil {
        db.logger.Errorf("Could not deserialize database: %v", err)
        return err
    }
    filepath := directory + "/" + db.database.Name
    if err = ioutil.WriteFile(filepath, outData, 0644); err != nil {
        db.logger.Errorf("Could not write database to disk file %s: %v", filepath, err)
        return err
    }
    db.logger.Infof("Database successfully write to disk. File: %s", filepath)
    return nil
}

func (db *Database) GetTable(tableName string) (*table.Table, error) {
    if tables := db.database.GetTables(); tables != nil {
        for _, tablePb := range tables {
            if tablePb.Name == tableName {
                db.logger.Debugf("Table %s found in database", tableName)
                return table.GetTable(tablePb, db.logger) 
            }
        }
    } else {
        return nil, errors.New("There is no defined tables in database internal structure")
    }

    err := fmt.Errorf("There is no %s table in database", tableName)
    db.logger.Error(err)
    return nil, err
}

func (db *Database) AddTable(tableName string) (*table.Table, error) {
    if tables := db.database.GetTables(); tables != nil {
        for _, tablePb := range tables {
            if tablePb.Name == tableName {
                err := fmt.Errorf("Table %s already exist in db", tableName)
                db.logger.Warn(err)
                return nil, err
            }
        }
    } else {
        return nil, errors.New("There is no defined tables in database internal structure")
    }

    tablePb := &pb.Table{
        Name: tableName,
        Rows: []*pb.Row{},
    }

    db.database.Tables = append(db.database.Tables, tablePb)
    db.logger.Infof("Table %s created.", tableName)

    tb, err := table.GetTable(tablePb, db.logger)
    return tb, err
}

func (db *Database) Dump(writer io.Writer) {
    writer.Write([]byte("\tDatabase: " + db.database.Name + "\n\n"))
    for _, tablePb := range db.database.Tables {
        table, err := table.GetTable(tablePb, db.logger)
        if (err != nil) {
            continue
        }
        table.Dump(writer)
    }
}
