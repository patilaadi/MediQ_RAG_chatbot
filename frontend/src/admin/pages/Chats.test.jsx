import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chats from "./Chats";

describe("Chats admin page", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("loads users and then shows threads and messages when clicked", async () => {
    const chatDataResponse = {
      users: [
        {
          userId: "user-1",
          name: "Jane Doe",
          email: "jane@example.com",
          threadCount: 1,
          lastActive: "2026-01-01T09:00:00Z",
        },
      ],
      threadsByUser: {
        "user-1": [
          {
            threadId: "thread-1",
            title: "Annual Checkup",
            createdAt: "2026-01-01T08:00:00Z",
            lastMessageAt: "2026-01-01T09:00:00Z",
          },
        ],
      },
    };

    const threadMessagesResponse = {
      threadId: "thread-1",
      messages: [
        {
          role: "user",
          content: "Hello, I need help with symptoms.",
          createdAt: "2026-01-01T08:00:00Z",
        },
        {
          role: "assistant",
          content: "Please describe your symptoms in detail.",
          createdAt: "2026-01-01T08:00:15Z",
        },
      ],
    };

    fetch.mockImplementation((url) => {
      if (url.includes("/admin/chats-data")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(chatDataResponse),
        });
      }
      if (url.includes("/admin/chats/thread/thread-1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(threadMessagesResponse),
        });
      }
      return Promise.reject(new Error("Unexpected fetch request: " + url));
    });

    render(<Chats />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Jane Doe"));

    await waitFor(() => {
      expect(screen.getByText("Annual Checkup")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Annual Checkup"));

    await waitFor(() => {
      expect(
        screen.getByText("Hello, I need help with symptoms."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please describe your symptoms in detail."),
      ).toBeInTheDocument();
    });
  });
});
