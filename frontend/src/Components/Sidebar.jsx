import {
  LayoutDashboard,
  PlusCircle,
  List,
  LogOut
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10">
        ⚡ProspectHub
      </h1>

      <nav className="space-y-4">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/create-lead"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <PlusCircle size={18} />
          Create Lead
        </Link>

        <Link
          to="/leads"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <List size={18} />
          Leads
        </Link>

        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </Link>

      </nav>

    </div>
  );
}