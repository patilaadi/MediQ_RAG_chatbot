import {
  Menu,
  Plus,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import axios from "axios";


const normalizeMessages = (msgs) => {
  return msgs.map((m) => ({
    sender: m.sender,
    text: m.text,
  }));
};


const ChatSidebar = ({
  open,
  setOpen,
}) => {


  const [showMenu, setShowMenu] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const navigate = useNavigate();

  const [activeThread, setActiveThread] = useState(null);
  const [threads, setThreads] = useState([]);



  const [user, setUser] = useState({});
  useEffect(() => {

    const fetchUser = async () => {

      try {


        const email = localStorage.getItem("email");
        console.log(email);
        const res = await axios.get(
          `http://localhost:8080/api/auth/user/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);


  useEffect(() => {

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    fetch(`http://localhost:8080/api/threads/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setThreads(data.threads || []);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // Logout
  const handleLogout = () => {

    localStorage.clear();

    window.location.href =
      "/signin";
  };



  const createChat = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const res = await fetch(
        "http://localhost:8080/api/threads/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      const newThread = {
        id: data.threadId,
        title: "New Chat",
      };

      setThreads((prev) => [
        newThread,
        ...prev,
      ]);

      navigate(
        `/chat/${user.name}/${data.threadId}`
      );

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <>
      <div className="w-full h-full bg-[#202123] text-white flex flex-col border-r border-gray-800">

        {/* Top */}
        <div className="p-4 flex items-center justify-between">

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="
            p-2
            hover:bg-[#2A2B32]
            rounded-lg
            transition-all
          "
          >

            <Menu size={22} />

          </button>

          {open && (
            <img
              src={logo}
              alt="profile"
              className="
              w-14
              h-14
              rounded-full
              object-cover
            "
            />
          )}

        </div>

        {/* New Chat */}
        <div className="px-3">

          <button
            onClick={createChat}
            className="
            w-full
            flex
            items-center
            gap-3
            bg-[#2A2B32]
            hover:bg-[#343541]
            p-3
            rounded-xl
            transition-all
          "
          >

            <Plus size={20} />

            {open && (
              <span>New Chat</span>
            )}

          </button>

        </div>

        {/* Recent */}
        {open && (
          <div className="px-4 mt-6 mb-2">

            <h2 className="text-gray-400 text-sm uppercase">

              Recent

            </h2>

          </div>
        )}

        {/* Chats */}
        <div className="flex-1 overflow-y-auto px-2">

          {threads.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {

                setActiveThread(chat.id);

                navigate(
                  `/chat/${user.name}/${chat.id}`
                );

              }}
              className="
                        w-full
                        flex
                        items-center
                        gap-3
                        text-left
                        p-3
                        rounded-xl
                        hover:bg-[#2A2B32]
                        transition-all
                         mb-1
                        "
            >
              <MessageSquare size={18} />

              {open && (
                <span className="truncate text-sm">
                  {chat.title || "New Chat"}
                </span>
              )}
            </button>
          ))}

        </div>

        {/* Profile Section */}
        <div className="relative p-3 border-t border-gray-800">

          {/* Profile Button */}
          <button
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="
            w-full
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            hover:bg-[#2A2B32]
            transition-all
          "
          >

            {/* Profile Image */}
            <img
              src={user?.picture}
              alt="profile"
              className="
              w-10
              h-10
              rounded-full
              object-cover
            "
            />

            {/* Name */}
            {open && (

              <div className="flex-1 text-left">

                <p className="text-sm font-medium">

                  {user?.name}

                </p>

                <p className="text-xs text-gray-400 truncate">

                  {user?.email}

                </p>

              </div>

            )}

          </button>

          {/* Dropdown Menu */}
          {showMenu && open && (

            <div
              className="
              absolute
              bottom-20
              left-3
              right-3
              bg-[#2A2B32]
              border
              border-gray-700
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            >

              {/* Personal Info */}
              <button
                onClick={() => {

                  setEditOpen(true);

                  setShowMenu(false);

                }}

                className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-[#343541]
                transition-all
              "
              >

                <User size={18} />

                <span>

                  Personal Info

                </span>

              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-red-500/20
                text-red-400
                transition-all
              "
              >

                <LogOut size={18} />

                <span>

                  Logout

                </span>

              </button>

            </div>

          )}

        </div>

      </div>
      <EditProfileModal
        open={editOpen}
        setOpen={setEditOpen}
        user={user}
        setUser={setUser}
      />
    </>
  );
};

export default ChatSidebar;