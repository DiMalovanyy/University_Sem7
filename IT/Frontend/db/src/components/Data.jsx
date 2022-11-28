import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system"
import { useState } from "react";
import { ChangeDataDialog } from "./dialogs/ChangeData";


const GetColumnFromRows = (rows, columnIdx) => {
    let result = []
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
        case 'intervalData': return "Interval: " + data.intervalData.fromVal + " - " +  data.intervalData.toVal;
        default: return "undefined";
    }
}

export const Data = (props) => {
    const [changeDataDialogOpen, setChangeDataDialogOpen] = useState(false);
    const handleChangeDataDialogClose = () => {
        setChangeDataDialogOpen(false);
    }
    const handleChangeDataClick = () => {
        setChangeDataDialogOpen(true);
    }
    
    const handleDataChanged = (newData) => {
        props.onDataChanged(newData);
    };

    const dataType = dataToStr(props.data);
    return (
        <Box sx={{
            textAlign: "center",
        }}>
            <Button variant="text" color="secondary" onClick={handleChangeDataClick}>
                {dataType}
            </Button>
            <ChangeDataDialog 
                open={changeDataDialogOpen} 
                onClose={handleChangeDataDialogClose} 
                onDataChanged={handleDataChanged} 
                columnType={props.columnType} />
        </Box> 
    );
};

export const DataPreview = (props) => {

    const theme = useTheme()
    return (
        <Box sx={{
            flex: 1,
            textAlign: 'left',
            margin: 'auto',
        }}>
            <Typography>{"(" + props.columnType + ")"}</Typography>
        </Box>
    );
};
