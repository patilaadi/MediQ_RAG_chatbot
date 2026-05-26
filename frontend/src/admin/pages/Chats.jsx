import { useEffect, useMemo, useState } from "react";

const formatDate = (isoDate) => {
  if (!isoDate) return "Unknown";
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const groupThreadsByDate = (threads) => {
  if (!threads?.length) return [];

  const groups = {};

  threads.forEach((thread) => {
    const when = thread.lastMessageAt || thread.createdAt;
    const dateKey = formatDate(when);

    groups[dateKey] = groups[dateKey] || [];
    groups[dateKey].push(thread);
  });

  return Object.entries(groups)
    .map(([date, threads]) => ({ date, threads }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [threadsByUser, setThreadsByUser] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const res = await fetch("http://localhost:8080/admin/chats-data");
        const data = await res.json();
        setUsers(data.users || []);
        setThreadsByUser(data.threadsByUser || {});
      } catch (err) {
        console.error("Failed to load chat metadata", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadChatData();
  }, []);

  useEffect(() => {
    setSelectedThreadId(null);
    setMessages([]);
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedThreadId) return;

    const loadThreadMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(
          `http://localhost:8080/admin/chats/thread/${selectedThreadId}`,
        );
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load thread messages", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadThreadMessages();
  }, [selectedThreadId]);

  const userThreads = useMemo(
    () => threadsByUser[selectedUserId] || [],
    [selectedUserId, threadsByUser],
  );

  const threadGroups = useMemo(
    () => groupThreadsByDate(userThreads),
    [userThreads],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Chat Monitor</h1>
        <p className="text-gray-500 mt-2">
          Select a user to view date-wise chat threads, then choose a thread to
          inspect every message.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_320px_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Users</h2>

          {loadingUsers ? (
            <p className="text-sm text-gray-500">Loading users…</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.userId}
                  onClick={() => setSelectedUserId(user.userId)}
                  className={`w-full rounded-xl border p-3 text-left transition-all hover:border-blue-500 ${
                    selectedUserId === user.userId
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">
                      {user.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.threadCount} chats
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || "no-email@example.com"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Last active: {formatDate(user.lastActive)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Threads</h2>

          {!selectedUserId ? (
            <p className="text-sm text-gray-500">
              Choose a user to browse their threads.
            </p>
          ) : threadGroups.length === 0 ? (
            <p className="text-sm text-gray-500">
              No threads available for this user.
            </p>
          ) : (
            <div className="space-y-6">
              {threadGroups.map((group) => (
                <div key={group.date}>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                    {group.date}
                  </div>
                  <div className="space-y-2">
                    {group.threads.map((thread) => (
                      <button
                        key={thread.threadId}
                        onClick={() => setSelectedThreadId(thread.threadId)}
                        className={`w-full rounded-xl border p-3 text-left transition-all hover:border-blue-500 ${
                          selectedThreadId === thread.threadId
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {thread.title || "New Chat"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last update: {formatDate(thread.lastMessageAt)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Messages</h2>
            {selectedThreadId && (
              <span className="text-xs text-gray-500">
                Thread ID: {selectedThreadId.slice(0, 6)}...
              </span>
            )}
          </div>

          {!selectedThreadId ? (
            <p className="text-sm text-gray-500">
              Click a thread to inspect the complete message sequence.
            </p>
          ) : loadingMessages ? (
            <p className="text-sm text-gray-500">Loading messages…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-500">
              This thread has no saved messages.
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-sm font-semibold capitalize">
                      {msg.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Chats;
