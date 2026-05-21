import { Link } from "react-router-dom";

const Sidebar = () => {

  return (
    <div className="w-64 h-screen bg-[#202123] text-white p-5">

      <h1 className="text-2xl font-bold mb-10">
        MediQ Admin
      </h1>

      <div className="space-y-5 flex flex-col">

        <Link to="/admin">
          Dashboard
        </Link>

        <Link to="/admin/chats">
          Chats
        </Link>

        <Link to="/admin/documents">
          Documents
        </Link>

        <Link to="/admin/analytics">
          Analytics
        </Link>

        <Link to="/admin/settings">
          Settings
        </Link>

      </div>

    </div>
  );
};

export default Sidebar;