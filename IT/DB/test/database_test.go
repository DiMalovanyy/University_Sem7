package test

import (
	"os"
	"testing"

	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/database"
	"github.com/stretchr/testify/assert"
)

func TestCreation(t *testing.T) {
    _, err := database.NewDatabase("test", GetDummyLogger())
    assert.NoError(t, err)
}

func TestAddNewTable(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())
    _, err := db.AddTable("test_table")
    assert.NoError(t, err)
}

func TestAddExistingTable(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())

    table_name := "test_table"
    db.AddTable(table_name)
    
     _, err := db.AddTable(table_name)
     assert.Error(t, err)
}

func TestGetExistingTable(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())
    db.AddTable("test_table")

    _, err := db.GetTable("test_table")
    assert.NoError(t, err)
}

func TestGetNotExistingTable(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())

    _, err := db.GetTable("test_table")
    assert.Error(t, err)
}

func TestSaveToFile(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())

    err := db.Save("./tmp")
    assert.NoError(t, err)
    assert.FileExists(t, "./tmp/test")
    os.Remove("./tmp/test")
}

func TestLoadFromFile(t *testing.T) {
    db, _ := database.NewDatabase("test", GetDummyLogger())
    db.Save("./tmp")

    _, err := database.LoadDatabase("./tmp", "test", GetDummyLogger())
    assert.NoError(t, err)
}

