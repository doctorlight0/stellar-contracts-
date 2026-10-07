import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout";
import Overview from "./pages/overview";
import Contracts from "./pages/contracts";
import ContractDetails from "./pages/contractDetails";
import CheckContract from "./pages/checkContract";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
          <Route path="/check-contract" element={<CheckContract />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;