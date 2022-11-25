import { useTheme } from '@emotion/react';
import {
    Box,
    Button,
    Tabs,
    Tab,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { theme } from '../Theme';
import { AddDatabaseDialog } from './dialogs/AddDatabase';

import { useOperationMethod } from 'react-openapi-client';


const DatabaseList = (props) => {
    
    const theme = useTheme();
    const [databaseTab, setDatabaseTab] = useState(-1);

    let databaseList = props.databaseList;

    const handleDatabaseTabChanged = (event, newDatabaseTab) => {
        setDatabaseTab(newDatabaseTab);
        props.handleUpdateDatabase(databaseList[newDatabaseTab])
    };
    

    return (
        <Box sx={{
            padding: "20px",
            display: "flex"
        }}>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                width: "100%",
                textAlign: "center",
            }}>
                <Typography variant="h6" color="secondary">
                    Databases
                </Typography>
            </Box>
            <Box sx={{
                flex: 7,
                width: "100%",
            }}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={databaseTab}
                    onChange={handleDatabaseTabChanged}
                    >
                    {databaseList.map((databaseVal, databaseIdx) => (
                        <Tab label={databaseVal} key={databaseIdx}/>
                    ))}
                </Tabs> 
            </Box>
        </Box>
    );
}

const Header = (props) => {
    const [getDatabaseCall, getDatabaseListResponse] = useOperationMethod('DatabaseService_GetDatabaseList');
    const theme = useTheme();

    const [addDatabaseDialogOpen, setAddDatabaseDialogOpen] = useState(false)
    const handleAddDatabaseClick = () => {
        setAddDatabaseDialogOpen(true);
    }
    const handleAddDatabaseDialogClose = () => {
        setAddDatabaseDialogOpen(false);
    }  


    const [newDatabaseName, setNewDatabaseName] = useState("");
    const [databaseList, setDatabaseList] = useState([]);

    useEffect(() => {
        getDatabaseCall();
    }, []);

    useEffect(() => {
        if (!getDatabaseListResponse.loading && 
            !getDatabaseListResponse.error && 
            getDatabaseListResponse.data) {

            if (databaseList.length === 0) {
                setDatabaseList(getDatabaseListResponse.data.databaseNames);
            }

        }
    }, [getDatabaseListResponse]);

    useEffect(() => {
        if (newDatabaseName !== "") {
            if (!databaseList.includes(newDatabaseName)) {
                setDatabaseList((prev) => [...prev, newDatabaseName]);
                setNewDatabaseName("");
            }
        }
    }, [newDatabaseName])

    const addDatabaseToList = (databaseName) => {
        setNewDatabaseName(databaseName);
    }

    return (
        <Box>
            <Box sx={{
                textAlign: 'center',
                padding: '30px',
                webkitBoxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",
                mozBoxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",
                boxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",

                display: "flex",
                flexDirection: "row",
            }} backgroundColor={theme.palette.primary.main}>
                <Button color="secondary" variant="outlined" size="large" onClick={handleAddDatabaseClick}>Add Database</Button>
            </Box>
            <DatabaseList 
                handleUpdateDatabase={props.handleUpdateDatabase} 
                databaseList={databaseList}
            />
            <AddDatabaseDialog open={addDatabaseDialogOpen} onClose={handleAddDatabaseDialogClose} onAddNewDatabase={addDatabaseToList}/>
        </Box>
    );
}


export default Header;