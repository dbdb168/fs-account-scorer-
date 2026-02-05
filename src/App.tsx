import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { CompanyDetail } from "./components/CompanyDetail";
import companiesData from "./data/companies.json";
import type { Company } from "./lib/types";

const companies = companiesData as Company[];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage companies={companies} />} />
        <Route path="/company/:id" element={<CompanyDetail companies={companies} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
