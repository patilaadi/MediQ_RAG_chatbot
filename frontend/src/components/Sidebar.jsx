import { Menu, Plus, MessageSquare, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import axios from "axios";

const ChatSidebar = ({ open, setOpen }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [user, setUser] = useState({});

  const getProfileImageUrl = (picture) => {
    if (!picture || picture === "null" || picture === "undefined") {
      return "https://i.pravatar.cc/150";
    }

    if (
      picture.startsWith("http://") ||
      picture.startsWith("https://") ||
      picture.startsWith("data:")
    ) {
      return picture;
    }

    return `http://localhost:8080/${picture.replace(/^\/+/, "")}`;
  };

  // ================= PROFILE LOAD =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("email");

        if (!email) return;

        const res = await axios.get(
          `http://localhost:8080/api/auth/user/${email}`,
        );

        if (res.data.user) {
          setUser(res.data.user);
          console.log("User data:", res.data.user);
        }
      } catch (err) {
        console.log("Profile error:", err);
      }
    };

    fetchUser();
  }, [editOpen]);

  // ================= THREADS LOAD =================
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`http://localhost:8080/api/threads/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setThreads(data.threads || []);
      })
      .catch((err) => console.log(err));
  }, []);

  // ================= REALTIME TITLE UPDATE =================
  useEffect(() => {
    const handler = (e) => {
      const { threadId, title } = e.detail;

      setThreads((prev) =>
        prev.map((t) => {
          const id = t._id || t.id;

          if (id === threadId) {
            return { ...t, title };
          }
          return t;
        }),
      );
    };

    window.addEventListener("threadUpdated", handler);

    return () => {
      window.removeEventListener("threadUpdated", handler);
    };
  }, []);

  // ================= CREATE CHAT =================
  const createChat = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch("http://localhost:8080/api/threads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      const newThread = {
        _id: data.threadId,
        title: "New Chat",
      };

      setThreads((prev) => [newThread, ...prev]);

      navigate(`/chat/${user.name}/${data.threadId}`);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <>
      <div className="w-full h-full bg-[#202123] text-white flex flex-col border-r border-gray-800">
        {/* TOP */}
        <div className="p-4 flex items-center justify-between">
          <button onClick={() => setOpen(!open)}>
            <Menu size={22} />
          </button>

          {open && (
            <img src={logo} className="w-14 h-14 rounded-full object-cover" />
          )}
        </div>

        {/* NEW CHAT */}
        <div className="px-3">
          <button
            onClick={createChat}
            className="w-full flex items-center gap-3 bg-[#2A2B32] p-3 rounded-xl"
          >
            <Plus size={20} />
            {open && "New Chat"}
          </button>
        </div>

        {/* THREADS */}
        <div className="flex-1 overflow-y-auto px-2 mt-4">
          {threads.map((chat) => {
            const id = chat._id || chat.id;

            return (
              <button
                key={id}
                onClick={() => navigate(`/chat/${user.name}/${id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#2A2B32]"
              >
                <MessageSquare size={18} />

                {open && (
                  <span className="truncate text-sm">
                    {chat.title || "New Chat"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PROFILE */}
        <div className="relative p-3 border-t border-gray-800">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="  w-full
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            hover:bg-[#2A2B32]
            transition-all"
          >
            <img
              src={
                user?.picture
                  ? `${getProfileImageUrl(user.picture)}?t=${Date.now()}`
                  : "https://ui-avatars.com/api/?name="
              }
              alt="profile"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover"
            />

            {open && (
              <div>
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </button>

          {/* MENU */}
          {showMenu && open && (
            <div className="absolute bottom-20 left-3 right-3 bg-[#2A2B32] rounded-xl">
              <button
                onClick={() => {
                  setEditOpen(true);
                  setShowMenu(false);
                }}
                className="w-full p-3 flex gap-2 hover:bg-[#343541]"
              >
                <User size={18} />
                Personal Info
              </button>

              <button
                onClick={() => {
                  setChangeOpen(true);
                  setShowMenu(false);
                }}
                className="w-full p-3 flex gap-2 hover:bg-[#343541]"
              >
                <User size={18} />
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-3 flex gap-2 text-red-400 hover:bg-red-500/20"
              >
                <LogOut size={18} />
                Logout
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

      <ChangePasswordModal open={changeOpen} setOpen={setChangeOpen} />
    </>
  );
};

export default ChatSidebar;
