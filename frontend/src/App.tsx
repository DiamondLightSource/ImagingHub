import { Route, BrowserRouter, Routes } from "react-router-dom";
import { default as TomographyApp } from "../tomography/src/App";
import { App as I14App } from "../i14/src/App";
import { App as EpsicApp } from "../ePSIC/src/App";
import { App as UnifiedApp } from "../unified/src/App";
import { default as Dashboard } from "../dashboard/src/App";
import { default as Layout } from "./Layout";
import { apolloClientUlims } from "./ApolloClient";
import { ApolloProvider } from "@apollo/client/react";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tomography/*" element={<TomographyApp />} />
          <Route path="i14/*" element={<I14App />} />
          <Route path="ePSIC/*" element={<EpsicApp />} />
          <Route
            path="unified/*"
            element={
              <ApolloProvider client={apolloClientUlims}>
                <UnifiedApp />
              </ApolloProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
