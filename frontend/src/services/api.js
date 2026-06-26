const BASE_URL = "https://salesforce-integration-l793.onrender.com";

export const getLeads = async () => {
  const res = await fetch(`${BASE_URL}/leads`);
  return res.json();
};

export const createLead = async (data) => {
  const res = await fetch(`${BASE_URL}/create-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};