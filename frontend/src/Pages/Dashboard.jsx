import { useEffect, useState } from "react";

export default function Dashboard() {
  const [totalLeads, setTotalLeads] = useState(0);
  const [companies, setCompanies] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://salesforce-integration-l793.onrender.com/leads"
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to load leads");
      }

      const leads = data.records || [];

      setTotalLeads(leads.length);

      const uniqueCompanies = new Set(
        leads.map((lead) => lead.Company)
      );

      setCompanies(uniqueCompanies.size);

      setNewLeads(leads.length >= 10 ? 10 : leads.length);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        {error}
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
    <h1 className="text-2xl sm:text-3xl font-bold mb-6">
      Dashboard
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm sm:text-base">
          Total Leads
        </h2>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {totalLeads}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm sm:text-base">
          New Leads
        </h2>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {newLeads}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm sm:text-base">
          Companies
        </h2>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {companies}
        </p>
      </div>
    </div>
  </div>
)
};