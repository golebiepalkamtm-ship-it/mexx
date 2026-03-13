"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      user {
        id
        username
        profilePhoto
      }
      lastMessage
      lastMessageAt
    }
  }
`;

export default function MessagesPage() {
  const { data, loading, error } = useQuery(GET_CONVERSATIONS, {
    pollInterval: 5000, // Simple polling for MVP
  });

  if (loading)
    return <div className="text-center p-10">Ładowanie czatów...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wiadomości</h1>

        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          {data?.conversations?.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Brak wiadomości. Znajdź kogoś na Marketplace!
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {data?.conversations?.map((conv: any) => (
                <Link
                  key={conv.user.id}
                  href={`/messages/${conv.user.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-750 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl">
                    {conv.user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-lg">
                        {conv.user.username}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {conv.lastMessage || "Brak treści"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
