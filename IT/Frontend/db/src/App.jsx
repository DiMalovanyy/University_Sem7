import { ThemeProvider } from "@emotion/react";
import { theme } from "./Theme";
import { OpenAPIProvider, useOperationMethod } from 'react-openapi-client';
import { MainContent } from "./components/MainContent";


export const App = (props) => {
    return (
        <OpenAPIProvider definition="http://localhost:50051/v1/api/openapi.json" axiosConfigDefaults={{ withCredentials: false, }}>
            <ThemeProvider theme={theme}>
                <MainContent />
            </ThemeProvider>
        </OpenAPIProvider>
    );
}
