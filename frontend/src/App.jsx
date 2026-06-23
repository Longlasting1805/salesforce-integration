import { useEffect, useState } from "react";

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: ""
  });

  const fetchLeads = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:3000/leads");
    const data = await res.json();

    if (data.success) setLeads(data.records);

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createLead = async () => {
    const res = await fetch("http://localhost:3000/create-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      setForm({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: ""
      });
      fetchLeads();
    }
  };

  const deleteLead = async (id) => {
    await fetch(`http://localhost:3000/delete-lead/${id}`, {
      method: "DELETE"
    });
    fetchLeads();
  };

  const editLead = async (id) => {
    const company = prompt("Company:");
    const email = prompt("Email:");
    const phone = prompt("Phone:");

    await fetch(`http://localhost:3000/update-lead/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Company: company, Email: email, Phone: phone })
    });

    fetchLeads();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6 fixed h-full shadow-2xl">
        <h1 className="text-2xl font-bold mb-10">⚡ CRM Pro</h1>

        <div className="space-y-4 text-gray-300">
          <p className="hover:text-white cursor-pointer">📊 Dashboard</p>
          <p className="hover:text-white cursor-pointer">👥 Leads</p>
          <p className="hover:text-white cursor-pointer">🏢 Customers</p>
          <p className="hover:text-white cursor-pointer">⚙️ Settings</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="ml-64 flex-1 p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Salesforce CRM Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your leads like a SaaS product
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-gray-500">Total Leads</p>
            <h2 className="text-3xl font-bold text-gray-800">{leads.length}</h2>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow">
            <p>System Status</p>
            <h2 className="text-2xl font-bold">Active</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow">
            <p>API Connection</p>
            <h2 className="text-2xl font-bold">Connected</h2>
          </div>

        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Lead</h2>

          <div className="grid grid-cols-2 gap-4">

            {["firstName", "lastName", "company", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}

          </div>

          <button
            onClick={createLead}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            + Create Lead
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.Id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {lead.FirstName} {lead.LastName}
                  </td>

                  <td className="p-4">{lead.Company}</td>
                  <td className="p-4 text-blue-600">{lead.Email}</td>
                  <td className="p-4">{lead.Phone}</td>

                  <td className="p-4 flex gap-4">

                    <button
                      onClick={() => editLead(lead.Id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLead(lead.Id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}