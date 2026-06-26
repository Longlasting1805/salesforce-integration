import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                    body: JSON.stringify({
                        email,
                        password
                    })
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

                <div className="flex justify-center mb-4">
                    <ShieldCheck size={40} />
                </div>

                <h1 className="text-3xl font-bold text-center mb-6">
                    ProspectLeadsHub CRM
                </h1>

                Welcome back.

                Manage your prospects,
                track every lead,
                and grow your business.

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={login}
                    className="bg-blue-600 text-white px-6 py-3 rounded w-full"
                >
                    Login
                </button>

                <div className="mt-6 text-sm bg-gray-100 p-3 rounded">
                    <p className="font-semibold mb-2">Demo Account</p>
                    <p>Email: recruiter@demo.com</p>
                    <p>Password: recruiter123</p>
                </div>

            </div>
        </div>

    );
}