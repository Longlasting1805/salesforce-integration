import { useEffect, useState } from "react";
import { Trash2, Edit, Save, X, UserPlus } from "lucide-react";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: ""
  });

  const fetchLeads = async () => {
    const res = await fetch("http://localhost:3000/leads");
    const data = await res.json();
    if (data.success) setLeads(data.records);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const reset = () => {
    setEditId(null);
    setForm({
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: ""
    });
  };

  const createLead = async () => {
    await fetch("http://localhost:3000/create-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    reset();
    fetchLeads();
  };

  const updateLead = async () => {
    await fetch(`http://localhost:3000/update-lead/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    reset();
    fetchLeads();
  };

  const deleteLead = async (id) => {
    await fetch(`http://localhost:3000/delete-lead/${id}`, {
      method: "DELETE"
    });

    fetchLeads();
  };

  const startEdit = (lead) => {
    setEditId(lead.Id);
    setForm({
      firstName: lead.FirstName,
      lastName: lead.LastName,
      company: lead.Company,
      email: lead.Email,
      phone: lead.Phone
    });
  };

  return (
    <div className="space-y-6">

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserPlus size={20} />
          {editId ? "Edit Lead" : "Create Lead"}
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <input className="border p-2 rounded" name="firstName"
            value={form.firstName} onChange={handleChange} placeholder="First Name" />

          <input className="border p-2 rounded" name="lastName"
            value={form.lastName} onChange={handleChange} placeholder="Last Name" />

          <input className="border p-2 rounded" name="company"
            value={form.company} onChange={handleChange} placeholder="Company" />

          <input className="border p-2 rounded" name="email"
            value={form.email} onChange={handleChange} placeholder="Email" />

          <input className="border p-2 rounded" name="phone"
            value={form.phone} onChange={handleChange} placeholder="Phone" />

          <div className="col-span-2 flex gap-3">

            {editId ? (
              <>
                <button
                  onClick={updateLead}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save size={16} />
                  Update
                </button>

                <button
                  onClick={reset}
                  className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={createLead}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <UserPlus size={16} />
                Create
              </button>
            )}

          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.Id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {lead.FirstName} {lead.LastName}
                </td>

                <td className="p-3 text-gray-600">{lead.Company}</td>
                <td className="p-3 text-blue-600">{lead.Email}</td>
                <td className="p-3">{lead.Phone}</td>

                <td className="p-3 flex gap-3">

                  <button
                    onClick={() => startEdit(lead)}
                    className="text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLead(lead.Id)}
                    className="text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}