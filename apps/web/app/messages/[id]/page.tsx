"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_MESSAGES = gql`
  query GetMessages($otherUserId: String!) {
    messages(otherUserId: $otherUserId) {
      id
      content
      senderId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(sendMessageInput: $input) {
      id
      content
      createdAt
    }
  }
`;

export default function ChatPage() {
  const { id: otherUserId } = useParams();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { otherUserId },
    pollInterval: 3000,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setInputMessage("");
      refetch();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    await sendMessage({
      variables: {
        input: {
          receiverId: otherUserId as string,
          content: inputMessage,
        },
      },
    });
  };

  // Safe check to avoid hydration errors or auth issues (basic)
  // In real app, we would get current user ID from context
  const isMe = (senderId: string) => {
    // Temporary workaround: we assume outgoing message if not from otherUser
    // Better way: compare with currentUser from Auth Context
    return senderId !== otherUserId;
  };

  if (loading && !data)
    return <div className="text-center p-10">Ładowanie...</div>;

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white pt-16 pb-20 md:pb-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {data?.messages?.map((msg: any) => {
          const me = isMe(msg.senderId);
          return (
            <div
              key={msg.id}
              className={`flex ${me ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  me
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="flex-1 p-3 rounded-full bg-gray-900 border border-gray-600 focus:border-blue-500 outline-none px-6"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
          >
            ➤
          </button>
        </form>
      </div>
    </main>
  );
}
