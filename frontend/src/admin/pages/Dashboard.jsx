import { useEffect, useState } from "react";

const Dashboard = () => {

  const [stats, setStats] = useState({
    total_users: 0,
    total_chats: 0,
    total_documents: 0,
    faithfulness: 0,
    context_recall: 0,
  });

  useEffect(() => {

    fetch("http://localhost:8080/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data));

  }, []);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Users</p>
            <h1 className="text-3xl font-bold">{stats.total_users}</h1>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Chats</p>
            <h1 className="text-3xl font-bold">{stats.total_chats}</h1>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total PDFs</p>
            <h1 className="text-3xl font-bold">{stats.total_documents}</h1>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Faithfulness</p>
            <h1 className="text-3xl font-bold">{stats.faithfulness}</h1>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Context Recall</p>
            <h1 className="text-3xl font-bold">{stats.context_recall}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;