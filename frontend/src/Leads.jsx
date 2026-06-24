import { useEffect, useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";

export default function Leads() {
const [leads, setLeads] = useState([]);
const [search, setSearch] = useState("");

const [editingLead, setEditingLead] = useState(null);

const [editForm, setEditForm] = useState({
firstName: "",
lastName: "",
company: "",
email: "",
phone: ""
});

useEffect(() => {
fetchLeads();
}, []);

const fetchLeads = async () => {
try {
const response = await fetch("http://localhost:3000/leads");
const data = await response.json();

  if (data.success) {
    setLeads(data.records);
  }
} catch (error) {
  console.log(error);
}

};

const deleteLead = async (id) => {
try {
await fetch("http://localhost:3000/delete-lead/" + id, {
method: "DELETE"
});

  fetchLeads();
} catch (error) {
  console.log(error);
}

};

const startEdit = (lead) => {
setEditingLead(lead);

setEditForm({
  firstName: lead.FirstName || "",
  lastName: lead.LastName || "",
  company: lead.Company || "",
  email: lead.Email || "",
  phone: lead.Phone || ""
});

};

const saveEdit = async () => {
try {
const response = await fetch(
"http://localhost:3000/update-lead/" + editingLead.Id,
{
method: "PATCH",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
FirstName: editForm.firstName,
LastName: editForm.lastName,
Company: editForm.company,
Email: editForm.email,
Phone: editForm.phone
})
}
);

  const data = await response.json();

  if (data.success) {
    setEditingLead(null);
    fetchLeads();
  }
} catch (error) {
  console.log(error);
}

};

const filteredLeads = leads.filter((lead) => {
const text =
(lead.FirstName || "") +
" " +
(lead.LastName || "") +
" " +
(lead.Company || "");

return text.toLowerCase().includes(search.toLowerCase());

});

return (
<div>
<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Leads</h1>

    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
      <Search size={18} />

      <input
        type="text"
        placeholder="Search leads..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none"
      />
    </div>
  </div>

  <div className="bg-white rounded-xl shadow overflow-hidden">
    <table className="w-full">

      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Name</th>
          <th className="p-4 text-left">Company</th>
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-left">Phone</th>
          <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredLeads.map((lead) => (
          <tr key={lead.Id} className="border-t hover:bg-gray-50">

            <td className="p-4">
              {lead.FirstName} {lead.LastName}
            </td>

            <td className="p-4">
              {lead.Company}
            </td>

            <td className="p-4">
              {lead.Email}
            </td>

            <td className="p-4">
              {lead.Phone}
            </td>

            <td className="p-4 flex gap-2">

              <button
                onClick={() => startEdit(lead)}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => deleteLead(lead.Id)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                <Trash2 size={16} />
              </button>

            </td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>

  {editingLead && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[500px]">

        <h2 className="text-2xl font-bold mb-4">
          Edit Lead
        </h2>

        <div className="grid gap-3">

          <input
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                firstName: e.target.value
              })
            }
            className="border p-3 rounded"
            placeholder="First Name"
          />

          <input
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                lastName: e.target.value
              })
            }
            className="border p-3 rounded"
            placeholder="Last Name"
          />

          <input
            value={editForm.company}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                company: e.target.value
              })
            }
            className="border p-3 rounded"
            placeholder="Company"
          />

          <input
            value={editForm.email}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                email: e.target.value
              })
            }
            className="border p-3 rounded"
            placeholder="Email"
          />

          <input
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                phone: e.target.value
              })
            }
            className="border p-3 rounded"
            placeholder="Phone"
          />

        </div>

        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={() => setEditingLead(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={saveEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  )}
</div>

);
}