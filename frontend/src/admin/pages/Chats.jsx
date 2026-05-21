import { useEffect, useState } from "react";

const Chats = () => {

  const [chats, setChats] = useState([]);

  useEffect(() => {

    fetch("http://localhost:8080/admin/chats")
      .then((res) => res.json())
      .then((data) => setChats(data));

  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Chat Monitoring
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Question</th>
              <th className="p-4 text-left">Answer</th>
              <th className="p-4 text-left">Time</th>
            </tr>
          </thead>

          <tbody>

            {chats.map((chat, index) => (

              <tr key={index} className="border-t">

                <td className="p-4">
                  {chat.question}
                </td>

                <td className="p-4">
                  {chat.answer}
                </td>

                <td className="p-4">
                  {new Date(chat.timestamp).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Chats;