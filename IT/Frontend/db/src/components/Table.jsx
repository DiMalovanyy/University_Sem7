import { 
    TableContainer, 
    TableRow,
    Paper, 
    Table,
    TableBody,
    TableCell,
    TableHead,
    useTheme,
    IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { Data, DataPreview, GetColumnType } from "./Data";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useOperationMethod } from 'react-openapi-client';
import { useEffect, useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MyTableContainer = (props) => <Box id="table-container" sx={{
    backgroundColor: "primary",
}} {...props} />


const DatabaseTable = (props) => {
    const theme = useTheme()
    const table = props.table;

    const [addRowCall, addRowResponse] = useOperationMethod('DatabaseService_AppendRow');
    const handleAddRow = () => {
        addRowCall([
            {name: 'databaseName', value: props.databaseName, in: "path"},
            {name: 'tableName', value: table.name, in: "path"},
        ]);
    }
    const [addColumnCall, addColumnResponse] = useOperationMethod('DatabaseService_AppendColumn');
    const handleAddColumn = () => {
        addColumnCall([
            {name: 'databaseName', value: props.databaseName, in: "path"},
            {name: 'tableName', value: table.name, in: "path"},
        ]);
    }
    const [deleteRowCall, deleteRowResponse] = useOperationMethod('DatabaseService_DeleteRow')
    const handleDeleteRow = (rowIdx) => {
        deleteRowCall([
            {name: 'databaseName', value: props.databaseName, in: "path"},
            {name: 'tableName', value: table.name, in: "path"},
            {name: 'id', value: rowIdx, in: "path"},  
        ])
    }
    const [deleteColumnCall, deleteColumnResponse] = useOperationMethod('DatabaseService_DeleteColumn')
    const handleDeleteColumn = (columnIdx) => {
       deleteColumnCall([
            {name: 'databaseName', value: props.databaseName, in: "path"},
            {name: 'tableName', value: table.name, in: "path"},
            {name: 'id', value: columnIdx, in: "path"},  
       ])
    }

    const [changeDataCall, changeDataResponse] = useOperationMethod('DatabaseService_ChangeData');
    const handleDataChanged = (newData, columnIdx, rowIdx) => {
        const tableData = {
            'rowIndex': rowIdx,
            'columnIndex': columnIdx,
            'newData': newData,
        };
        console.log(tableData);
        changeDataCall([
            {name: 'databaseName', value: props.databaseName, in: "path"},
            {name: 'tableName', value: table.name, in: "path"},
        ], tableData);
    }

    useEffect(() => {
        if (changeDataResponse.data && !changeDataResponse.error && !changeDataResponse.loading) {
            props.onTableUpdate(table.name);
        }
    }, [changeDataResponse.data, changeDataResponse.error, changeDataResponse.loading]);

    useEffect(() => {
        if (addColumnResponse.data && !addColumnResponse.error && !addColumnResponse.loading) {
            props.onTableUpdate(table.name)
        }
    }, [addColumnResponse.data, addColumnResponse.error, addColumnResponse.loading]);

    useEffect(() => {
        if (addRowResponse.data && !addRowResponse.error && !addRowResponse.loading) {
            props.onTableUpdate(table.name)
        }
    }, [addRowResponse.data, addRowResponse.error, addRowResponse.loading]);

    useEffect(() => {
        if (deleteRowResponse.data && !deleteRowResponse.error && !deleteRowResponse.loading) {
            props.onTableUpdate(table.name)
        }
    }, [deleteRowResponse.data, deleteRowResponse.error, deleteRowResponse.loading]);

    useEffect(() => {
        if (deleteColumnResponse.data && !deleteColumnResponse.error && !deleteColumnResponse.loading) {
            props.onTableUpdate(table.name)
        }
    }, [deleteColumnResponse.data, deleteColumnResponse.error, deleteColumnResponse.loading]);

    if (!table) {
        return <Box />
    }

    const columnsAmount = table.rows.length === 0 ? 0 : table.rows[0].data.length;
    const widthPoints = 30;
    return (
        <Box sx={{
            display: "flex",
        }}>
            <Box id="table" sx={{
                flex: columnsAmount + 15,
            }}>
                <TableContainer component={MyTableContainer} >
                    <Table sx={{
                    }}>
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor: "#DCB58F",
                            }}>
                                <TableCell></TableCell> 
                                {[...Array(columnsAmount).keys()].map((idx) => (
                                    <TableCell>
                                        <Box id="data-preview">
                                            <Box sx={{
                                                display: "flex",
                                                padding: 0,
                                                margin: 0,
                                            }}>
                                                <DataPreview columnIdx={idx} columnType={GetColumnType(table['rows'], idx)} />
                                                <Box sx={{
                                                    flex: 1,
                                                    textAlign: 'center',
                                                    margin: 0,
                                                    padding: 0,
                                                }}>
                                                    <IconButton onClick={() => handleDeleteColumn(idx)}>
                                                        <HighlightOffIcon color="primary" fontSize="medium"/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {props.table['rows'].map((rowVal, rowIdx) => (
                                <TableRow key={rowIdx}>
                                    <TableCell sx={{
                                        backgroundColor: "#DCB58F",
                                    }}>
                                        <IconButton onClick={() => handleDeleteRow(rowIdx)}>
                                            <HighlightOffIcon color="primary" fontSize="medium"/>
                                        </IconButton>
                                    </TableCell>
                                    {rowVal.data.map((dataVal, dataIdx) => (
                                        <TableCell >
                                            <Data 
                                                data={dataVal} 
                                                columnType={GetColumnType(table.rows, dataIdx)}
                                                onDataChanged={(newData) => { handleDataChanged(newData, dataIdx, rowIdx)}}
                                            />
                                            </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{
                    textAlign: "center",
                }}>
                    <IconButton onClick={handleAddRow}>
                        <ArrowDownwardIcon color="secondary" sx={{ fontSize: '250%'}} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{
                flex: widthPoints - columnsAmount,
                textAlign: "left",
                margin: "auto",
            }}>
                <IconButton onClick={handleAddColumn}>
                    <ArrowForwardIcon color="secondary" sx={{ fontSize: '250%'}} />
                </IconButton>
            </Box> 
        </Box>
    );
}

export default DatabaseTable; 