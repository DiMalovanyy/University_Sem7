import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/system"
import { useState } from "react";
import Database from "./components/Database";
import Header from "./components/Header";
import { test_database } from "./test/database";
import { theme } from "./Theme";

const App = (props) => {
    const [database, setDatabase] = useState({})

    const updateDatabase = (databaseName) => {
        setDatabase(test_database)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box id="app" backgroundColor={theme.palette.background.default}>
                <Box id="header">
                    <Header handleUpdateDatabase={updateDatabase} />
                </Box>
                <Box id="content">
                    <Database database={database} />
                </Box>
                <Box id="footer" backgroundColor={theme.palette.primary.main}>
                </Box>
            </Box>
        </ThemeProvider> 
    );
}

export default App
