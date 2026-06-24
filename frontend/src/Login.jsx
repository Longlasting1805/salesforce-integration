import { ShieldCheck } from "lucide-react";

export default function Login() {

    const login = () => {
        window.location.href = "http://localhost:3000/login";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">

            <div className="bg-white p-10 rounded-xl w-[360px] text-center">

                <div className="flex justify-center mb-4">
                    <ShieldCheck size={40} />
                </div>

                <h1 className="text-3xl font-bold mb-4">CRM Login</h1>

                <button
                    onClick={login}
                    className="bg-blue-600 text-white px-6 py-3 rounded w-full"
                >
                    Login with Salesforce
                </button>

            </div>

        </div>
    );
}