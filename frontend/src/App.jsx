import { useEffect, useState } from "react";

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/leads");
      const data = await res.json();

      if (data.success) {
        setLeads(data.records);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Salesforce CRM Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your leads in real time
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between mb-4">

        <button
          onClick={fetchLeads}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          {loading ? "Loading..." : "Refresh Leads"}
        </button>

        <span className="text-sm text-gray-500">
          Total Leads: {leads.length}
        </span>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">

        <table className="w-full text-sm text-left">

          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
            </tr>
          </thead>

          <tbody>

            {leads.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.Id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {lead.FirstName || "-"} {lead.LastName || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {lead.Company || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {lead.Email || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {lead.Phone || "-"}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}