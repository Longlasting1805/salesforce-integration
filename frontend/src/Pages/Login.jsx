import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();


    const login = async () => {
        try {
            console.log("Sending login request...");
            const res = await fetch(
                "https://salesforce-integration-l793.onrender.com/app-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                }
            );

            const data = await res.json();
            console.log(data);


            if (data.success) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                alert("Invalid credentials");
            }
        } catch (err) {
            console.error(err);

            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Unknown error");
            }
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-white p-10 rounded-xl w-[380px]">

                <div className="flex justify-center mb-4 mr-4">
                    <ShieldCheck size={40} />
                </div>

                <h1 className="text-3xl font-bold text-center mb-6 mr-4">
                    ⚡ProspectHub
                </h1>

                <h1 className="text-1xl font-sm text-center mb-6">Manage Every Prospect. Close More Deals.</h1>

                <button
                    onClick={login}
                    className="bg-blue-600 text-white px-6 py-3 rounded w-full">
                    Continue to CRM
                </button>

            </div>
        </div>

    );
}