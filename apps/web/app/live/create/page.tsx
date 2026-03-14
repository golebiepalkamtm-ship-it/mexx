"use client";

import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const START_STREAM = gql`
  mutation StartStream($input: CreateStreamInput!) {
    startStream(input: $input) {
      id
    }
  }
`;

export default function CreateStreamPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Just Chatting");

  const [startStream, { loading }] = useMutation(START_STREAM, {
    onCompleted: (data) => {
      router.push(`/live/${data.startStream.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startStream({
      variables: {
        input: { title, category },
      },
    });
  };

  return (
    <main className="min-h-screen p-6 pt-8 md:pt-24 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full glass-card rounded-3xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-primary/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              className="text-4xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📡
            </motion.div>
            <h1 className="text-2xl font-black text-gradient-brand">
              Rozpocznij Transmisję
            </h1>
            <p className="text-white/30 text-sm mt-1">Wejdź na żywo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Tytuł transmisji
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-premium"
                placeholder="np. Q&A z widzami"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Kategoria
              </label>
              <select
                aria-label="Kategoria transmisji"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-premium"
              >
                <option>Just Chatting</option>
                <option>Gaming</option>
                <option>Music</option>
                <option>Education</option>
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-4 rounded-2xl text-sm font-bold disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Uruchamianie..." : "Start LIVE"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
