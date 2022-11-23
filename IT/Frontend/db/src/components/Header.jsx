import { useTheme } from '@emotion/react';
import {
    Box,
    Button,
    Tabs,
    Tab,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { theme } from '../Theme';


const DatabaseList = (props) => {
    const theme = useTheme();
    let databaseList = props.databaseList

    const [databaseTab, setDatabaseTab] = useState(-1)
    const handleDatabaseTabChanged = (event, newDatabaseTab) => {
        setDatabaseTab(newDatabaseTab);
        props.handleUpdateDatabase(databaseList[databaseTab])
    };

    return (
        <Box sx={{
            padding: "20px",
            display: "flex"
        }}>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                width: "100%",
                textAlign: "center",
            }}>
                <Typography variant="h6" color="secondary">
                    Databases
                </Typography>
            </Box>
            <Box sx={{
                flex: 7,
                width: "100%",
            }}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={databaseTab}
                    onChange={handleDatabaseTabChanged}
                    >
                    {props.databaseList.map((databaseVal, databaseIdx) => (
                        <Tab label={databaseVal} key={databaseIdx}/>
                    ))}
                </Tabs> 
            </Box>
        </Box>
    );
}

const Header = (props) => {
    let databases = ["test1", "test2", "test_db"]
    const theme = useTheme()
    return (
        <Box>
            <Box sx={{
                textAlign: 'center',
                padding: '30px',
                webkitBoxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",
                mozBoxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",
                boxShadow: "0px 8px 5px -5px rgba(204, 213, 174, 0.6)",

                display: "flex",
                flexDirection: "row",
            }} backgroundColor={theme.palette.primary.main}>
                <Button color="secondary" variant="outlined" size="large">Add Database</Button>
            </Box>
            <DatabaseList handleUpdateDatabase={props.handleUpdateDatabase} databaseList={databases} />
        </Box>
    );
}


export default Header;