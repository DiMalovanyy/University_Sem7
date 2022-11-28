import { Dialog, DialogTitle, Box, Tabs, Typography, Tab, Button, TextField} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`change-data-tabpanel`}
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


const IntegerData = (props) => {
    useEffect(() => {
        props.onDataChanged({});
    }, []);

    const [integerData, setIntegerData] = useState(0);
    const handleIntegerDataChanged = (event) => {
        setIntegerData(event.target.value);
        props.onDataChanged({"integerData": event.target.value });
    }

    return (
        <Box id="data-input-box">
            <TextField label="Integer" variant="outlined" value={integerData} onChange={handleIntegerDataChanged}/>
        </Box>
    )
}

const FloatData = (props) => {
    useEffect(() => {
        props.onDataChanged({});
    }, []);

    const [floatData, setFloatData] = useState(0.0);
    const handleFloatDataChanged = (event) => {
        setFloatData(event.target.value);
        props.onDataChanged({"floatData": event.target.value });
    }

    return (
        <Box id="data-input-box">
            <TextField label="Float" variant="outlined" value={floatData} onChange={handleFloatDataChanged}/>
        </Box>
    )

}

const StringData = (props) => {
    useEffect(() => {
        props.onDataChanged({});
    }, []);

    const [stringData, setStringData] = useState("");
    const handleStringDataChanged = (event) => {
        setStringData(event.target.value);
        props.onDataChanged({"stringData": event.target.value });
    }

    return (
        <Box id="data-input-box">
            <TextField label="String" variant="outlined" value={stringData} onChange={handleStringDataChanged}/>
        </Box>
    )
}

const PictureData = (props) => {
    useEffect(() => {
        props.onDataChanged({});
    }, []);
    return (
        <Box>
            <Box id="data-input-box">
                <TextField label="Picture Name" variant="outlined" />
            </Box>
            <Box id="data-input-box">
                <TextField label="Picture Format" variant="outlined" />
            </Box>
        </Box>
    )
}

const IntervalData = (props) => {
    useEffect(() => {
        props.onDataChanged({});
    }, []);
    return (
        <Box>
            <Box id="data-input-box">
                <TextField label="From" variant="outlined" />
            </Box>
            <Box id="data-input-box">
                <TextField label="To" variant="outlined" />
            </Box>
        </Box>
    )
}

const NoData = (props) =>  {
    const [dataTab, setDataTab] = useState(0);
    const handleChangeDataTab = (event, val) => { setDataTab(val); }
    return (
        <Box>
            <Tabs value={dataTab} onChange={handleChangeDataTab}>
                <Tab label={"Integer"} />
                <Tab label={"Float"} />
                <Tab label={"String"} />
                <Tab label={"Interval"} />
                <Tab label={"Picture"} />
            </Tabs>
            <TabPanel value={dataTab} index={0}>
                <IntegerData onDataChanged={props.onDataChanged}/>
            </TabPanel>
            <TabPanel value={dataTab} index={1}>
                <FloatData onDataChanged={props.onDataChanged}/>
            </TabPanel>
            <TabPanel value={dataTab} index={2}>
                <StringData onDataChanged={props.onDataChanged}/>
            </TabPanel>
            <TabPanel value={dataTab} index={3}>
                <IntervalData onDataChanged={props.onDataChanged}/>
            </TabPanel>
            <TabPanel value={dataTab} index={4}>
                <PictureData onDataChanged={props.onDataChanged}/>
            </TabPanel>
        </Box>
    );
}


const Data = (props) => {
    switch (props.columnType) {
        case 'empty': return <NoData onDataChanged={props.onDataChanged} />;
        case 'integerData': return <IntegerData onDataChanged={props.onDataChanged}/>;
        case 'floatData': return <FloatData onDataChanged={props.onDataChanged}/>
        case 'stringData': return <StringData onDataChanged={props.onDataChanged}/>
        case 'pictureData': return <PictureData onDataChanged={props.onDataChanged}/>
        case 'IntervalData': return <IntervalData onDataChanged={props.onDataChanged}/>
        default: <Box> Undefined DataType </Box>
    }
}

export const ChangeDataDialog = (props) => {
    console.log("change data dialog rerender");
    const { onClose, open } = props;
    const handleClose = () => { onClose(); }

    const columnType = props.columnType;

    const [newData, setNewData] = useState({})
    const handleDataUpdate = (newData) => {
        setNewData(newData);
    }
    const handleChangeClick = () => {
        props.onDataChanged(newData);
        onClose();
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <Box id="change-data-dialog">
                <Data onDataChanged={handleDataUpdate} columnType={columnType}/>
                <Box sx={{
                        position: "absolute",
                        bottom: "1em",
                    }}>
                        <Button variant="contained" onClick={handleChangeClick}>Change</Button>
                </Box>
            </Box>
        </Dialog>
    );
};
