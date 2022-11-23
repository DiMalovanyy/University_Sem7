import { IconButton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const GetColumnFromRows = (rows, columnIdx) => {
    let result = []
    console.log(rows)
    for (let row of rows) {
        for (let i = 0; i < row.data.length; i++) {
            if ( i === columnIdx ) {
                result.push(row.data[i]);
            }
        }   
    }
    return result;
}

export const GetColumnType = (rows, columnIdx) => {
    const column = GetColumnFromRows(rows, columnIdx)
    for (let data of column) {
        const dataStr = dataToStr(data);
        if (dataStr != "-") {
            return dataToName(data);
        }
    }
    return "empty";
}


const dataToName = (data) => {
    const keys = Object.keys(data)
    return keys[0];
}
const dataToStr = (data) => {
    const keys = Object.keys(data)
    switch (keys[0]) {
        case 'emptyData': return "-";
        case 'integerData': return data.integerData;
        case 'floatData': return data.floatData;
        case 'stringData': return data.stringData;
        case 'pictureData': return "Img: " + data.pictureData.pictureName + "." + data.pictureData.pictureFormat;
        case 'intervalData': return "Interval: " + data.intervalData.fromVal + data.intervalData.toVal;
        default: return "undefined";
    }
}

export const Data = (props) => {
    return (
        <Box sx={{
            textAlign: "center",
        }}>
            {dataToStr(props.data)}
        </Box> 
    );
};


export const DataPreview = (props) => {
    const theme = useTheme()
    return (
        <Box id="data-preview">
            <Box sx={{
                display: "flex",
                padding: 0,
                margin: 0,
            }}>
                <Box sx={{
                    flex: 1,
                    textAlign: 'left',
                    margin: 'auto',
                }}>
                    <Typography>{"(" + props.columnType + ")"}</Typography>
                    {/* <Typography>{props.columnIdx}</Typography>  */}
                </Box>
                <Box sx={{
                    flex: 1,
                    textAlign: 'center',
                    margin: 0,
                    padding: 0,
                }}>
                    <IconButton>
                        <HighlightOffIcon color="primary" fontSize="medium"/>
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};
