import { 
    Dialog, 
    DialogTitle, 
    Box, 
    Tabs, 
    Tab, 
    TextField,
    Button,
} from "@mui/material";
import { useState} from "react";


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
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    }

    const [addDatabaseTab, setAddDatabaseTab] = useState(0); 
    const handleTabChange = (event, newTab) => {
        setAddDatabaseTab(newTab);
    } 

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
                        <TextField label="Name" variant="outlined" />
                    </Box>
                    <Box sx={{
                            position: "absolute",
                            bottom: "1em",
                        }}>
                            <Button variant="contained">New</Button>
                    </Box> 
                </Box>
            </TabPanel>
            <TabPanel value={addDatabaseTab} index={1}>
                <Box id="load-database-tab">
                    <Box>
                        <Box sx={{
                            paddingBottom: "1em",
                        }}>
                            <TextField label="Name" variant="outlined" />
                        </Box>
                        <Box>
                            <TextField label="Directory" variant="outlined" />
                        </Box>
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        bottom: "1em",
                    }}>
                        <Button variant="contained">Load</Button>
                    </Box>        
                </Box>
            </TabPanel>
            </Box>
        </Dialog>
    );
};
