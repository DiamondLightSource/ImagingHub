import { Route, BrowserRouter, Routes } from "react-router-dom";
import { default as TomographyApp } from "../tomography/src/App";
import { App as I14App } from "../i14/src/App";
import { default as Dashboard } from "../dashboard/src/App";
import { default as Layout } from "./Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tomography/*" element={<TomographyApp />} />
          <Route path="i14/*" element={<I14App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
