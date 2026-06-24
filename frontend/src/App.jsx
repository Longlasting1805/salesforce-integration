import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import CreateLead from "./CreateLead";
import Leads from "./Leads";
import Layout from "./Layout";

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