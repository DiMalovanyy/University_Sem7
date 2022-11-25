import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import Database from "./Database";
import Header from "./Header";
import { useOperationMethod } from 'react-openapi-client';
import { Box } from "@mui/system";



export const MainContent = (props) => {
    const theme = useTheme();
    const [database, setDatabase] = useState({})
    const [getDbCall, responseGetDb ] = useOperationMethod('DatabaseService_GetDatabase');

    const updateDatabase = (databaseName) => {
        getDbCall([
            {name: 'databaseName', value: databaseName, in: "path"},
        ]);
    }

    useEffect(() => {
        if (!responseGetDb.loading && !responseGetDb.error && responseGetDb.data) {
            setDatabase(responseGetDb.data);
        }
    }, [responseGetDb]);

    return (
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
    )

}