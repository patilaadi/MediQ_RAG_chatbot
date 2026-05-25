import { NavLink} from "react-router-dom";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  const linkClass = ({ isActive }) =>
    `
    px-4
    py-3
    rounded-xl
    transition-all
    duration-200
    font-medium
    ${
      isActive
        ? "bg-[#343541] text-white"
        : "text-gray-300 hover:bg-[#2A2B32] hover:text-white"
    }
  `;

  return (
    <div className="w-64 h-screen bg-[#202123] text-white p-5 fixed left-0 top-0 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">MediQ Admin</h1>

      <div className="space-y-3 flex flex-col flex-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/chats" className={linkClass}>
          Chats
        </NavLink>

        <NavLink to="/admin/documents" className={linkClass}>
          Documents
        </NavLink>

        <NavLink to="/admin/analytics" className={linkClass}>
          Analytics
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          Settings
        </NavLink>
      </div>
      <button
        onClick={handleLogout}
        className="mt-auto w-full p-3 flex gap-2 text-red-400 rounded-xl hover:bg-red-500/20"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};;

export default Sidebar;