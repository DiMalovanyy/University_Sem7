package table

import (
	"fmt"
	"io"

	proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
	prettyTable "github.com/jedib0t/go-pretty/v6/table"
	"github.com/sirupsen/logrus"
)

type Table struct {
    table *proto.Table  // Not owning
    logger *logrus.Entry
}

func GetTable(table *proto.Table, baseLogger *logrus.Entry) (*Table, error) {
    logger := baseLogger.WithFields(logrus.Fields{"table": table.Name})
    return &Table{
        table: table,
        logger: logger,
    }, nil
}

func (t *Table) Validate() error {

    if t.table.Rows == nil || len(t.table.Rows) == 0 {
        err := fmt.Errorf("Table does not contains raws")
        t.logger.Error(err)
        return err
    }

    columnsAmount := len(t.table.Rows[1].Data)
    for rowIndex, row := range t.table.Rows {
        if len(row.Data) != columnsAmount {
            err := fmt.Errorf("The Row with index %d columns amount not equal to table defined: %d != %d", rowIndex, len(row.Data), columnsAmount)
            t.logger.Error(err)
            return err
        }
    }
    t.logger.Debug("Table Valid")
    return nil
}


func (t *Table) Dump(writer io.Writer) error {

    tableOut := prettyTable.NewWriter()
    tableOut.SetOutputMirror(writer)
    tableOut.SetStyle(prettyTable.StyleLight)
    tableOut.SetTitle(t.table.Name)

    rowFooter := prettyTable.Row{"", "", "Total", 10000}
    tableOut.AppendFooter(rowFooter)

    tableOut.Render()

    return nil
}
