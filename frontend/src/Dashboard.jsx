import { useEffect, useState } from "react";

export default function Dashboard() {
const [totalLeads, setTotalLeads] = useState(0);
const [companies, setCompanies] = useState(0);
const [newLeads, setNewLeads] = useState(0);

useEffect(() => {
loadDashboard();
}, []);

const loadDashboard = async () => {
try {
const response = await fetch("https://salesforce-integration-l793.onrender.com/leads");
const data = await response.json();

  if (data.success) {
    const leads = data.records;

    setTotalLeads(leads.length);

    const uniqueCompanies = new Set(
      leads.map((lead) => lead.Company)
    );

    setCompanies(uniqueCompanies.size);

    setNewLeads(
      leads.length >= 10 ? 10 : leads.length
    );
  }
} catch (error) {
  console.log(error);
}

};

return (
<div>

  <h1 className="text-3xl font-bold mb-6">
    Dashboard
  </h1>

  <div className="grid md:grid-cols-3 gap-5">

    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-gray-500">
        Total Leads
      </h2>

      <p className="text-4xl font-bold mt-2">
        {totalLeads}
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-gray-500">
        New Leads
      </h2>

      <p className="text-4xl font-bold mt-2">
        {newLeads}
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-gray-500">
        Companies
      </h2>

      <p className="text-4xl font-bold mt-2">
        {companies}
      </p>
    </div>

  </div>

</div>

);
}