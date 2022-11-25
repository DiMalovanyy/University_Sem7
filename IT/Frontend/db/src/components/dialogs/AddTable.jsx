import { 
    Dialog,
    DialogTitle, 
    Box, 
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useOperationMethod } from 'react-openapi-client';


export const AddTableDialog = (props) => {
    const { onClose, open, onNewTableAdd, databaseName} = props;

    const handleClose = () => {
        onClose();
    }

    const [tableName, setTableName ] = useState("")
    const handleChangeTableName = (event) => {
        setTableName(event.target.value);
    }
    const [addTableCall, addTableResponse ] = useOperationMethod('DatabaseService_GetTable');
    const [addTableButtonClicked, setAddTableButtonClicked] = useState(false);
    const handleAddTable = () => {
        addTableCall([
            {name: 'databaseName', value: databaseName, in: "path"},
            {name: 'tableName', value: tableName, in: "path"},
            {name: 'createIfNotExist', value: true, in: "query"},
        ]);
        setAddTableButtonClicked(true);
        onClose();
    };

    useEffect(() => {
        if (
            !addTableResponse.error && 
            !addTableResponse.loading && 
            addTableResponse.data &&
            tableName != "" && 
            addTableButtonClicked) {
                onNewTableAdd(addTableResponse.data);
                setAddTableButtonClicked(false);
                setTableName("");
        }
    }, [addTableResponse]);

    return (
        <Dialog onClose={handleClose} open={open}>
            <Box id="add-table-dialog">
                <DialogTitle>  
                    <Box textAlign="center">
                        <Typography variant="h5" color="primary">Add Table</Typography>
                    </Box>
                </DialogTitle>
                <Box>
                    <Box>
                        <TextField label="Name" variant="outlined" value={tableName} onChange={handleChangeTableName} />
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        bottom: "1em",
                    }}>
                        <Button variant="contained" onClick={handleAddTable}>Add Table</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};
