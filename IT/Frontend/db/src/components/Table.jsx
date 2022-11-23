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


const MyTableContainer = (props) => <Box id="table-container" sx={{
    backgroundColor: "primary",
}} {...props} />


const DatabaseTable = (props) => {
    const theme = useTheme()
    if (!props.table) {
        return <Box />
    }

    const columnsAmount = props.table['rows'].length
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
                                {[...Array(columnsAmount).keys()].map((idx) => (
                                    <TableCell><DataPreview columnIdx={idx} columnType={GetColumnType(props.table['rows'], idx)} /></TableCell>
                                ))}
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {props.table['rows'].map((rowVal, rowIdx) => (
                                <TableRow key={rowIdx}>
                                    {rowVal.data.map((dataVal, dataIdx) => (
                                        <TableCell ><Data data={dataVal} /></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{
                    textAlign: "center",
                }}>
                    <IconButton>
                        <ArrowDownwardIcon color="secondary" sx={{ fontSize: '250%'}} />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{
                flex: widthPoints - columnsAmount,
                textAlign: "left",
                margin: "auto",
            }}>
                <IconButton>
                    <ArrowForwardIcon color="secondary" sx={{ fontSize: '250%'}} />
                </IconButton>
            </Box> 
        </Box>
    );
}

export default DatabaseTable; 