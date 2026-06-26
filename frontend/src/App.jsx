import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import CreateLead from "./Pages/CreateLead";
import Leads from "./Pages/Leads";
import Layout from "./Components/Layout";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/create-lead"
          element={
            <Layout>
              <CreateLead />
            </Layout>
          }
        />

        <Route
          path="/leads"
          element={
            <Layout>
              <Leads />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}