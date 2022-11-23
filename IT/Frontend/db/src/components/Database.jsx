import { 
    Tabs,
    Tab,
    Typography,
    Divider,
    useTheme,
    IconButton,
} from "@mui/material";
import { 
    Box,
} from "@mui/system";
import { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DatabaseTable from "./Table";


const Database = (props) => {
    const theme = useTheme()
    const [tableTab, setTableTab] = useState(-1)
    const handleTableTabChanged = (event, newTableTab) => {
        setTableTab(newTableTab)
    };
    
    if (!props.database.hasOwnProperty('tables')) {
        return <Box />
    }

    return (
        <Box id="content" sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        }}>
            <Box id="table-list" sx={{
                flex: 1,
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <Box sx={{
                        flex: 5,
                        textAlign: "center",
                    }}>
                        <Typography variant="h6" color="secondary">Tables</Typography>
                    </Box>
                    <Box>
                        <IconButton color="secondary" >
                            <AddCircleIcon />
                        </IconButton>
                    </Box> 
                </Box>
                <Divider sx={{borderWidth: '1px'}}/>
                <Tabs 
                    orientation="vertical"
                    value={tableTab}
                    onChange={handleTableTabChanged}
                >
                { 
                    props.database.hasOwnProperty('tables') && props.database['tables'].map((tableVal, tableIdx) => (
                    <Tab label={tableVal.name} key={tableIdx} />
                ))}
                </Tabs>
            </Box>

            <Box sx={{
                flex: 20,
            }}>
                <DatabaseTable table={props.database['tables'][tableTab]} />
            </Box>
        
        </Box> 
    );

};

export default Database;