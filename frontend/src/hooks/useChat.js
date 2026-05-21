import { useState } from "react";
import { sendMessage } from "../services/api";

export const useChat = () => {
  const [messages, setMessages] = useState([]);

  const send = async (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    const res = await sendMessage(text);

    const botMsg = { sender: "bot", text: res.data.response };
    setMessages((prev) => [...prev, botMsg]);
  };

  return { messages, send };
};