import { 
    Dialog, 
    DialogTitle, 
    Box, 
    Tabs, 
    Tab, 
    TextField,
    Button,
} from "@mui/material";
import { useEffect, useState} from "react";

import { useOperationMethod } from 'react-openapi-client';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`add-database-tabpanel`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </Box>
    );
}

export const AddDatabaseDialog = (props) => {
    const { onClose, open, onAddNewDatabase } = props;
    const handleClose = () => {
        onClose();
    }

    const [addDatabaseTab, setAddDatabaseTab] = useState(0); 
    const handleTabChange = (event, newTab) => {
        setAddDatabaseTab(newTab);
    } 

    const [newDatabaseName, setNewDatabaseName] = useState("")
    const handleNewDatabaseNameChanged = (event) => {
        setNewDatabaseName(event.target.value);
    }
    const [createNewDbCall, responseNewDbCall ] = useOperationMethod('DatabaseService_GetDatabase');
    const [newDatabaseButtonClicked, setNewDatabaseButtonClicked] = useState(false); 
    const handleNewDatabaseCreation = () => {
        createNewDbCall([
            {name: 'databaseName', value: newDatabaseName, in: "path"},
            {name: "createIfNotExist", value: true, in: "query"}
        ]);
        setNewDatabaseButtonClicked(true);
        onClose();
    }

    useEffect(() => {
        if (!responseNewDbCall.loading && 
            responseNewDbCall.data && 
            !responseNewDbCall.error && 
            newDatabaseName !== "" && 
            newDatabaseButtonClicked) { 
            onAddNewDatabase(newDatabaseName);
            setNewDatabaseName("");
            setNewDatabaseButtonClicked(false);
        }
    }, [responseNewDbCall, newDatabaseButtonClicked])

    const [loadDatabaseName, setLoadDatabaseName] = useState("");
    const [loadDatabaseDir, setLoadDatabaseDir] = useState("");
    const handleLoadDatabaseNameChanged = (event) => {
        setLoadDatabaseName(event.target.value);
    }
    const handleLoadDatabaseDirChanged = (event) => {
        setLoadDatabaseDir(event.target.value);
    }
    const [loadDbCall, responseLoadDbCall ] = useOperationMethod('DatabaseService_LoadDatabase');
    const [loadDatabaseButtonClicked, setLoadDatabaseButtonClicked] = useState(false); 
    const handleLoadDatabase = () => { 
        loadDbCall([
            {name: "directory", value: loadDatabaseDir, in: "path"}, 
            {name: "filaname", value: loadDatabaseName, in: "path"} 
        ]);
        setLoadDatabaseButtonClicked(true);
        onClose();
    }
    useEffect(() => {
        if (!responseLoadDbCall.loading && 
            responseLoadDbCall.data && 
            !responseLoadDbCall.error &&
            loadDatabaseButtonClicked &&
            loadDatabaseDir !== "" &&
            loadDatabaseName !== "") {
            onAddNewDatabase(loadDatabaseName);
            setLoadDatabaseDir("");
            setLoadDatabaseName("");
        }
    }, [responseLoadDbCall, loadDatabaseButtonClicked])

    return (
        <Dialog onClose={handleClose} open={open}>
            <Box id="add-database-dialog">
            <DialogTitle>
                <Box>
                    <Tabs value={addDatabaseTab} onChange={handleTabChange}>
                        <Tab label="New " />
                        <Tab label="Load" />
                    </Tabs>
                </Box>
            </DialogTitle>
            <TabPanel value={addDatabaseTab} index={0}>
                <Box id="add-new-database-tab">
                    <Box>
                        <TextField label="Name" variant="outlined" value={newDatabaseName} onChange={handleNewDatabaseNameChanged} />
                    </Box>
                    <Box sx={{
                            position: "absolute",
                            bottom: "1em",
                        }}>
                            <Button variant="contained" onClick={handleNewDatabaseCreation}>New</Button>
                    </Box> 
                </Box>
            </TabPanel>
            <TabPanel value={addDatabaseTab} index={1}>
                <Box id="load-database-tab">
                    <Box>
                        <Box sx={{
                            paddingBottom: "1em",
                        }}>
                            <TextField label="Name" variant="outlined" value={loadDatabaseName} onChange={handleLoadDatabaseNameChanged} />
                        </Box>
                        <Box>
                            <TextField label="Directory" variant="outlined" value={loadDatabaseDir} onChange={handleLoadDatabaseDirChanged} />
                        </Box>
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        bottom: "1em",
                    }}>
                        <Button variant="contained" onClick={handleLoadDatabase}>Load</Button>
                    </Box>        
                </Box>
            </TabPanel>
            </Box>
        </Dialog>
    );
};
