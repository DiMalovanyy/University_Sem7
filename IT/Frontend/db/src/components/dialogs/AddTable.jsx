import { 
    Dialog,
    DialogTitle, 
    Box, 
    Typography,
    TextField,
    Button,
} from "@mui/material";


export const AddTableDialog = (props) => {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    }

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
                        <TextField label="Name" variant="outlined" />
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        bottom: "1em",
                    }}>
                        <Button variant="contained">Add Table</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};
