"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] },
  },
};

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

  const isMe = (senderId: string) => {
    return senderId !== otherUserId;
  };

  if (loading && !data)
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          className="text-white/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Ładowanie...
        </motion.div>
      </div>
    );

  return (
    <main className="flex flex-col h-screen bg-background text-white pt-16 pb-20 md:pb-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {data?.messages?.map((msg: any) => {
            const me = isMe(msg.senderId);
            return (
              <motion.div
                key={msg.id}
                className={`flex ${me ? "justify-end" : "justify-start"}`}
                variants={bubbleVariants}
                initial="hidden"
                animate="visible"
              >
                <div
                  className={`max-w-[70%] p-3.5 rounded-2xl ${
                    me
                      ? "bg-gradient-to-br from-primary/80 to-primary/60 rounded-br-sm"
                      : "glass rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-50 block mt-1.5 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 glass-strong border-t border-white/[0.04]">
        <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="input-premium flex-1 rounded-full px-6"
          />
          <motion.button
            type="submit"
            disabled={!inputMessage.trim()}
            className="btn-premium w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ➤
          </motion.button>
        </form>
      </div>
    </main>
  );
}
