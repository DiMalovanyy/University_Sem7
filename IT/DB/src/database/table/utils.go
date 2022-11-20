package table

import (

	proto "github.com/DiMalovanyy/University_Sem7/IT/DB/genproto"
)


func getColumnsFromRows(rows []*proto.Row) []column {
    columnSize := len(rows)
    var columnsAmount int
    if len(rows) == 0 {
        columnsAmount = 0
    } else {
        columnsAmount = len(rows[0].Data)
    }

    columns := make([]column, columnsAmount)
    for columnIdx := range columns {
        data := make([]*proto.Data, columnSize)
        columns[columnIdx] = column{
            Data: &data,
        }
    }

    for rowIdx, row := range rows {
        for dataIdx, data := range row.Data {
            switch data.Data.(type) {
            case *proto.Data_EmptyData: break;
            default: 
                columns[dataIdx].TypeStr = getDataStringType(data)
            }
            (*(columns[dataIdx].Data))[rowIdx] = data
        }
    }

    return columns
}

func getDataStringType(data *proto.Data) string {
    switch data.Data.(type) {
    case *proto.Data_EmptyData: return "EmptyData"
    case *proto.Data_IntegerData: return "IntegerData"
    case *proto.Data_FloatData: return "FloatData"
    case *proto.Data_StringData: return "StringData"
    case *proto.Data_IntervalData: return "IntervalData"
    case *proto.Data_PictureData: return "PictureData"
    default: return "Undefined"
}
}
