import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { SendHorizonal, Paperclip } from "lucide-react";
import TypingLoader from "./TypingLoader";

import { formatName } from "../utils/modifyName";

const ChatBox = () => {
  const { name } = useParams();
  const { threadId } = useParams();
  const cleanName = formatName(name);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);



  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: `Hello ${cleanName} 👋 , how can I help you today?`,
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("msg", currentMessage);
      formData.append("threadId", threadId);
      formData.append("userId", userId);

      const res = await fetch("http://localhost:8080/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          msg: currentMessage,
          threadId: threadId,
           userId: userId,
        }),
      });

      const data = await res.json();

      const fullText = data.answer;

      // empty assistant message
      let botMessage = {
        sender: "assistant",
        text: "",
      };

      setMessages((prev) => [...prev, botMessage]);

      // typing effect
      for (let i = 0; i < fullText.length; i++) {

        await new Promise((resolve) =>
          setTimeout(resolve, 15)
        );

        botMessage.text += fullText[i];

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...botMessage,
          };
          return updated;
        });
      }

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "⚠️ Server error",
        },
      ]);

    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {

  if (!threadId) return;

  fetch(`http://localhost:8080/api/threads/${threadId}`)

    .then(res => res.json())

    .then(data => {

      if (
        data.messages &&
        data.messages.length > 0
      ) {

        setMessages(data.messages);

      } else {

        setMessages([
          {
            sender: "assistant",
            text: `Hello ${cleanName} 👋 , how can I help you today?`,
          },
        ]);

      }

    });

}, [threadId]);

  return (
    <div className="flex flex-col h-full bg-[#343541]">

      {/* Header */}
      <div className="h-16 border-b border-gray-700 flex items-center px-6 text-white font-semibold text-lg">
        MediQ AI
      </div>

      {/* Messages */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          py-6
        "
      >

        <div
          className="
            w-full
            max-w-4xl
            mx-auto
            space-y-6
          "
        >

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`
                flex
                ${msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                }
              `}
            >

              <div
                className={`
                  max-w-[75%]
                  px-5
                  py-4
                  rounded-2xl
                  text-white
                  shadow-lg
                  ${msg.sender === "user"
                    ? "bg-green-600 rounded-br-md"
                    : "bg-[#444654] rounded-bl-md"
                  }
                `}
              >

                {msg.text}

              </div>

            </div>

          ))}
          {loading && messages[messages.length - 1]?.sender !== "assistant" && (

            <TypingLoader />

          )}
          <div ref={chatEndRef} />

        </div>

      </div>

      {/* Input Area */}
      <div className="w-full px-4 pb-6 bg-[#343541]">

        <div
          className="
            max-w-4xl
            mx-auto
            bg-[#40414F]
            rounded-3xl
            border
            border-gray-700
            shadow-2xl
            flex
            items-end
            px-4
            py-3
            gap-3
          "
        >

          {/* Attachment */}
          <button
            className="
              text-gray-400
              hover:text-white
              transition-all
              pb-2
            "
          >

            <Paperclip size={22} />

          </button>

          {/* Textarea */}
          <textarea
            rows={1}
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message MediQ AI..."
            className="
              flex-1
              bg-transparent
              text-white
              placeholder-gray-400
              outline-none
              resize-none
              overflow-hidden
              max-h-40
              py-2
            "
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="
              w-10
              h-10
              rounded-full
              bg-white
              text-black
              flex
              items-center
              justify-center
              hover:scale-105
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >

            <SendHorizonal size={18} />

          </button>

        </div>

        {/* Footer */}
        <p
          className="
            text-center
            text-xs
            text-gray-500
            mt-3
          "
        >

          MediQ AI can make mistakes.
          Verify important medical information.

        </p>

      </div>

    </div>
  );
};

export default ChatBox;