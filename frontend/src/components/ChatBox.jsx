import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { SendHorizontal, Paperclip } from "lucide-react";
import TypingLoader from "./TypingLoader";

import { formatName } from "../utils/modifyName";

const ChatBox = () => {
  const { name, threadId } = useParams();
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

      // 🔥 send real DB/title to sidebar
      window.dispatchEvent(
        new CustomEvent("threadUpdated", {
          detail: {
            threadId,
            title: data.title, // ✅ use backend title
          },
        }),
      );
      const fullText = data.answer;

      // empty assistant message
      let botMessage = {
        sender: "assistant",
        text: "",
      };

      setMessages((prev) => [...prev, botMessage]);

      // typing effect
      for (let i = 0; i < fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15));

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

  // File upload refs & state
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysisOptions, setShowAnalysisOptions] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const getAnalysisText = (opt) => {
    if (!analysis) return "";
    const key = opt.toLowerCase();
    let val = analysis[key] || analysis[`${key}s`] || analysis[`${key}_text`];
    if (Array.isArray(val)) return val.join("\n\n");
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return val || "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Only PDF files are allowed." },
      ]);
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("analyze", "true");

      const res = await fetch("http://localhost:8080/api/upload-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: `Upload failed: ${data.message || ""}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: `Uploaded ${file.name}` },
        ]);
        if (data.analysis) {
          setAnalysis(data.analysis);
          setShowAnalysisOptions(true);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "assistant", text: "Report uploaded. Analysis not available." },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Upload error" },
      ]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAnalysisSelect = (opt) => {
    setShowAnalysisOptions(false);
    if (!analysis) return;
    if (opt === "Ask") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "You can now ask follow-up questions about the uploaded report.",
        },
      ]);
      // focus the textarea for the user to type
      return;
    }

    const text = getAnalysisText(opt);
    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text: text || "No information available for this section.",
      },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!threadId) return;

    fetch(`http://localhost:8080/api/threads/${threadId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages?.length > 0) {
          setMessages(
            data.messages.map((m) => ({
              sender: m.role,
              text: m.content,
            })),
          );
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
                ${msg.sender === "user" ? "justify-end" : "justify-start"}
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
                  ${
                    msg.sender === "user"
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
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileClick}
              className="
                text-gray-400
                hover:text-white
                transition-all
                pb-2
              "
              title="Upload PDF report"
            >
              <Paperclip size={22} />
            </button>
            {uploading && (
              <span className="text-xs text-gray-300">Uploading...</span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            <SendHorizontal size={18} />
          </button>
        </div>

        {showAnalysisOptions && (
          <div className="max-w-4xl mx-auto mt-2 flex gap-2">
            {["Causes", "Precautions", "Medicines", "Ask"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnalysisSelect(opt)}
                className="bg-[#2A2B32] text-white px-3 py-2 rounded-md hover:bg-[#3a3b41]"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <p
          className="
            text-center
            text-xs
            text-gray-500
            mt-3
          "
        >
          MediQ AI can make mistakes. Verify important medical information.
        </p>
      </div>
    </div>
  

  );
};

export default ChatBox;
