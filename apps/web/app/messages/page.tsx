"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { motion } from "framer-motion";

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

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function MessagesPage() {
  const { data, loading, error } = useQuery(GET_CONVERSATIONS, {
    pollInterval: 5000,
  });

  if (loading)
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface shimmer" />
          ))}
        </div>
      </div>
    );

  return (
    <main className="min-h-screen p-6 pt-8 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-black mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-gradient-brand">Wiadomości</span>
        </motion.h1>

        <div className="glass-card rounded-3xl overflow-hidden">
          {data?.conversations?.length === 0 ? (
            <motion.div
              className="py-24 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-5xl mb-4">💬</p>
              <p className="text-xl font-semibold text-white/50">
                Brak wiadomości
              </p>
              <p className="text-sm text-white/25 mt-2">
                Znajdź kogoś na Marketplace!
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="divide-y divide-white/[0.04]"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {data?.conversations?.map((conv: any) => (
                <motion.div key={conv.user.id} variants={itemVariants}>
                  <Link
                    href={`/messages/${conv.user.id}`}
                    className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {conv.user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base">
                          {conv.user.username}
                        </h3>
                        <span className="text-[10px] text-white/30">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm line-clamp-1">
                        {conv.lastMessage || "Brak treści"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
