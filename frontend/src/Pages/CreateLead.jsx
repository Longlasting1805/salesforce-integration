import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function CreateLead() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createLead = async () => {
    try {
      const res = await fetch("https://salesforce-integration-l793.onrender.com/create-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Lead created successfully");

        setForm({
          firstName: "",
          lastName: "",
          company: "",
          email: "",
          phone: ""
        });
      }
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="max-w-4xl">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <UserPlus size={24} />
          Create Lead
        </h1>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border rounded-lg p-3"
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border rounded-lg p-3"
          />

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="border rounded-lg p-3"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-lg p-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-lg p-3"
          />

        </div>

        <button
          onClick={createLead}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Create Lead
        </button>

      </div>

    </div>

  );
}