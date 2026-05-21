import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";


const ChatPage = () => {

  const [open, setOpen] = useState(true);
  return (
      <div className="w-screen h-screen flex overflow-hidden bg-[#343541]">

      {/* Sidebar */}
      <div
        className={`
          ${
            open
              ? "w-72"
              : "w-20"
          }
          transition-all
          duration-300
          flex-shrink-0
        `}
      >

        <Sidebar
          open={open}
          setOpen={setOpen}
        />

      </div>

      {/* Chat Area */}
      <div className="flex-1 h-full transition-all duration-300">

        <ChatBox />

      </div>

    </div>
  );
};

export default ChatPage;