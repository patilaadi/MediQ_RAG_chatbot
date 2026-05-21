const MessageBubble = ({ msg }) => {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default MessageBubble;