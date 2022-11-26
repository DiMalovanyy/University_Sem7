import { 
    Tabs,
    Tab,
    Typography,
    Divider,
    useTheme,
    IconButton,
} from "@mui/material";
import { 
    Box,
} from "@mui/system";
import { useEffect, useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DatabaseTable from "./Table";
import { AddTableDialog } from "./dialogs/AddTable";
import { useOperationMethod } from 'react-openapi-client';

const Database = (props) => {
    const theme = useTheme()
    const [tableTab, setTableTab] = useState(-1)
    const handleTableTabChanged = (event, newTableTab) => {
        setTableTab(newTableTab)
    };
    const [addTableDialogOpen, setAddTableDialogOpen] = useState(false)
    const handleAddTableClick = () => {
        setAddTableDialogOpen(true);
    }
    const handleAddTableDialogClose = () => {
        setAddTableDialogOpen(false);
    }

    const [ tables, setTables] = useState([]);

    useEffect(() => {
        if (props.database.hasOwnProperty('tables')) {
            setTables(props.database.tables);
        }
    },[props.database]);


    const handleNewTableAdd = (newTableData) => {
        setTables((prev) => [...prev, newTableData]);
    }


    const [getTableCall, getTableResponse] = useOperationMethod('DatabaseService_GetTable');
    const [needTableUpdate, setNeedTableUpdate] = useState(false);
    const handleTableUpdate = (tableName) => {
        getTableCall([
            {name: 'databaseName', value: props.database.name, in: "path"},
            {name: 'tableName', value: tableName, in: "path"},
        ]);
        setNeedTableUpdate(true);
    }
    useEffect(() => {   
        if (getTableResponse.data && !getTableResponse.error && !getTableResponse.loading && needTableUpdate) {
            setTables((prev) => prev.map( (table) => {
                if (table.name === getTableResponse.data.name) {
                    return getTableResponse.data
                } else {
                    return table;
                }
            }));
            setNeedTableUpdate(false);
        }
    }, [getTableResponse.data, getTableResponse.error, getTableResponse.loading, tables, needTableUpdate]);

    if (!props.database.hasOwnProperty('tables')) {
        return <Box />
    }

    return (
        <Box id="content" sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        }}>
            <Box id="table-list" sx={{
                flex: 1,
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <Box sx={{
                        flex: 5,
                        textAlign: "center",
                    }}>
                        <Typography variant="h6" color="secondary">Tables</Typography>
                    </Box>
                    <Box>
                        <IconButton color="secondary" onClick={handleAddTableClick} >
                            <AddCircleIcon />
                        </IconButton>
                    </Box> 
                </Box>
                <Divider sx={{borderWidth: '1px'}}/>
                <Tabs 
                    orientation="vertical"
                    value={tableTab}
                    onChange={handleTableTabChanged}
                >
                { 
                    tables.map((tableVal, tableIdx) => (
                    <Tab label={tableVal.name} key={tableIdx} />
                ))}
                </Tabs>
            </Box>

            <Box sx={{
                flex: 20,
            }}>
                <DatabaseTable 
                    table={tables[tableTab]} 
                    databaseName={props.database.name}     
                    onTableUpdate={handleTableUpdate} />
            </Box>
            <AddTableDialog 
                open={addTableDialogOpen} 
                onNewTableAdd={handleNewTableAdd}
                onClose={handleAddTableDialogClose} 
                databaseName={props.database.name} 
            />
        </Box> 
    );

};

export default Database;