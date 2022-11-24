import { Dialog, DialogTitle, Box } from "@mui/material";


export const ChangeDataDialog = (props) => {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <Box id="change-data-dialog">
            <DialogTitle>
                TODO
            </DialogTitle>
            </Box>
        </Dialog>
    );
};
