package table

import (
	"fmt"
	"io"
	"strconv"

	proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
	"github.com/DiMalovanyy/University_Sem7/IT/DB/src/utils"
	prettyTable "github.com/jedib0t/go-pretty/v6/table"
	"github.com/sirupsen/logrus"
)

type column struct {
    Data *[]*proto.Data
    TypeStr string
}

type Table struct {
    name string
    rowsAmount int
    columnsAmount int

    rows *[]*proto.Row
    columns []column
    logger *logrus.Entry
}

func GetTable(table *proto.Table, baseLogger *logrus.Entry) (*Table, error) {
    logger := baseLogger.WithFields(logrus.Fields{"table": table.Name})

    rows := &table.Rows
    columns := getColumnsFromRows(*rows)
    return &Table{
        name: table.Name,
        rowsAmount: len(*rows),
        columnsAmount: len(columns),
        rows: rows,
        columns: columns,
        logger: logger,
    }, nil
}

func (t *Table) AppendRow() int {
    rowData := make([]*proto.Data, t.columnsAmount)
    for dataIdx := range rowData {
        rowData[dataIdx] = &proto.Data{
            Data: &proto.Data_EmptyData{},
        }
    }
    row := &proto.Row {
        Data: rowData,
    }
    (*t.rows) = append(*(t.rows), row)

    for columnIdx := range t.columns {
        *(t.columns[columnIdx].Data) = append(*(t.columns[columnIdx].Data), rowData[columnIdx])
    }
    newRowIdx := t.rowsAmount
    t.rowsAmount++
    t.logger.Debugf("New Empty Row with index %d appended to database", newRowIdx)
    return newRowIdx
}

func (t *Table) DeleteRow(rowIndex int) error {
    if rowIndex >= len(*t.rows) {
        err := fmt.Errorf("Index %d out of range", rowIndex)
        t.logger.Error(err)
        return err
    }
    (*t.rows) = append((*(t.rows))[:rowIndex], (*(t.rows))[rowIndex + 1:]...)

    for columnIdx  := range t.columns {
        *(t.columns[columnIdx].Data) = append((*(t.columns[columnIdx].Data))[:rowIndex], (*(t.columns[columnIdx].Data))[rowIndex+ 1:]...)
    }
    return nil;
}

func (t *Table) AppendColumn() int {
    newColumIdx := t.columnsAmount 
    columnData := make([]*proto.Data, t.rowsAmount) 

    for rowIdx := range *(t.rows) {
        // Create Data at the end of each row (at newColumIdx)
        (*(t.rows))[rowIdx].Data = append((*(t.rows))[rowIdx].Data, &proto.Data{
            Data: &proto.Data_EmptyData{},
        })
        columnData[rowIdx] = (*(t.rows))[rowIdx].Data[newColumIdx]
    }
    t.columns = append(t.columns, column{
        Data: &columnData,
    })
    t.columnsAmount++
    t.logger.Debugf("New Empty Column with index %d appended to database", newColumIdx)
    return newColumIdx
}

func (t *Table) DeleteColumn(columnIndex int) error {

    if columnIndex >= len(t.columns) {
        err := fmt.Errorf("Index %d out of range", columnIndex)
        t.logger.Error(err)
        return err
    }
    for rowIdx := range *(t.rows) {
        (*(t.rows))[rowIdx].Data = append((*(t.rows))[rowIdx].Data[:columnIndex], (*(t.rows))[rowIdx].Data[columnIndex + 1:]...)
    }
    t.columns = append(t.columns[:columnIndex], t.columns[columnIndex + 1:]...)
    return nil;
}

func (t *Table) SetData(rowIdx int, columnIdx int, data *proto.Data) error{
    if rowIdx >= t.rowsAmount {
        err := fmt.Errorf("[SetData] Row index %d out of range.", rowIdx)
        t.logger.Error(err)
        return err
    }
    if columnIdx >= t.columnsAmount {
        err := fmt.Errorf("[SetData] Column index %d out of range.", columnIdx)
        t.logger.Error(err)
        return err
    }

    switch data.Data.(type) {
    case *proto.Data_EmptyData: break;
    default: {
        if len(t.columns[columnIdx].TypeStr) > 0 && getDataStringType(data) != t.columns[columnIdx].TypeStr {
            err := fmt.Errorf("[SetData] New value type differs from column. %s != %s", getDataStringType(data), t.columns[columnIdx].TypeStr)
            t.logger.Error(err)
            return err
        }
    }
    }

    t.columns[columnIdx].TypeStr = getDataStringType(data)
    (*(t.rows))[rowIdx].Data[columnIdx].Data = data.Data
    
    t.logger.Infof("Value %v set to {%d, %d}", data, rowIdx, columnIdx)
    return nil
}

func (t Table) Validate() error {
    if t.rows == nil || len(*t.rows) == 0 {
        err := fmt.Errorf("Table does not contains rows")
        t.logger.Error(err)
        return err
    }
    for rowIndex, row := range *t.rows {
        if len(row.Data) != t.columnsAmount {
            err := fmt.Errorf("The Row with index %d columns amount not equal to table defined: %d != %d", rowIndex, len(row.Data), t.columnsAmount)
            t.logger.Error(err)
            return err
        }
    }
    
    for columnIdx, column := range t.columns {
        for dataIdx, data := range *(column.Data) {
            switch data.Data.(type) {
            case *proto.Data_EmptyData: break;
            default: {
                if getDataStringType(data) != column.TypeStr {
                    err := fmt.Errorf(
                        "Column with index %d has cell that has differ type from others column cells. Cell {%d, %d} has type %s, but column has type %s", 
                        columnIdx, dataIdx, columnIdx, getDataStringType(data), column.TypeStr)  
                    t.logger.Error(err)
                    return err
                }
            }
            }
        }
    }

    t.logger.Debug("Table Valid")
    return nil
}


func (t Table) Dump(writer io.Writer) error {
    if err := t.Validate(); err != nil {
        return err
    }
    t.logger.Debugf("Dump table")

    tableOut := prettyTable.NewWriter()
    tableOut.SetOutputMirror(writer)
    tableOut.SetStyle(prettyTable.StyleLight)
    tableOut.SetTitle(t.name)

    tableHeader := []interface{}{" "}
    for rowIdx := range t.columns {
        tableHeader = append(tableHeader, strconv.Itoa(rowIdx) + "\t(" + t.columns[rowIdx].TypeStr + ")")
    }

    tableOut.AppendHeader(tableHeader)

    for rowIdx, row := range *(t.rows) {
        rowLine := []interface{}{rowIdx}
        for _, data := range row.Data {
            rowLine = append(rowLine, data)
        }
        tableOut.AppendRow(rowLine)
    }

    tableOut.Render()

    t.DumpByColumns(writer)
    return nil
}

func (t Table) DumpByColumns(writer io.Writer)  error {
    if err := t.Validate(); err != nil {
        return err
    }
    t.logger.Debugf("Dump table by columns")

    tableOut := prettyTable.NewWriter()
    tableOut.SetOutputMirror(writer)
    tableOut.SetStyle(prettyTable.StyleLight)
    tableOut.SetTitle(t.name + "  *by columns")

    tableHeader := []interface{}{" "}
    rawIdxRange := utils.MakeRange(0, t.rowsAmount - 1)
    tableHeader = append(tableHeader, rawIdxRange...)
    tableOut.AppendHeader(tableHeader)

    for columnIdx, column := range t.columns {
        columnLine := []interface{}{columnIdx}
        for _, data := range *(column.Data) {
            columnLine = append(columnLine, data)
        }
        tableOut.AppendRow(columnLine)
    }
    
    tableOut.Render()
    return nil
}
