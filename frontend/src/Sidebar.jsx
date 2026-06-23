import { LayoutDashboard, PlusCircle, List, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h1 className="text-xl font-bold mb-8">⚡ CRM System</h1>

      <nav className="space-y-5 text-sm">

        <Link className="flex items-center gap-2 hover:text-gray-300" to="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <a className="flex items-center gap-2 hover:text-gray-300" href="#create">
          <PlusCircle size={18} />
          Create Lead
        </a>

        <a className="flex items-center gap-2 hover:text-gray-300" href="#leads">
          <List size={18} />
          Leads
        </a>

        <Link className="flex items-center gap-2 hover:text-gray-300" to="/">
          <LogOut size={18} />
          Logout
        </Link>

      </nav>
    </div>
  );
}