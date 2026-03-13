"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GET_STREAM = gql`
  query GetStream($id: String!) {
    stream(id: $id) {
      id
      title
      streamer {
        id
        username
      }
      viewerCount
    }
    streamTips(streamId: $id) {
      id
      tokenAmount
      message
      sender {
        username
      }
    }
  }
`;

const SEND_TIP = gql`
  mutation SendTip($streamId: String!, $amount: Int!, $message: String) {
    sendStreamTip(streamId: $streamId, amount: $amount, message: $message)
  }
`;

function TipParticle({ id, onDone }: { id: number; onDone: (id: number) => void }) {
  const x = useMemo(() => Math.random() * 200 - 100, []);
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 1500);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <motion.span
      className="absolute text-2xl pointer-events-none"
      style={{ left: "50%", bottom: "60%" }}
      initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      animate={{ opacity: 0, y: -120, x, scale: 0.5 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      💎
    </motion.span>
  );
}

export default function StreamPage() {
  const { id } = useParams();
  const [tipMessage, setTipMessage] = useState("");
  const [particles, setParticles] = useState<number[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery(GET_STREAM, {
    variables: { id },
    pollInterval: 2000,
  });

  const [sendTip] = useMutation(SEND_TIP, {
    onCompleted: () => setTipMessage(""),
  });

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.streamTips]);

  const removeParticle = useCallback((pid: number) => {
    setParticles((prev) => prev.filter((p) => p !== pid));
  }, []);

  const handleTip = async (amount: number) => {
    const newParticles = Array.from({ length: 5 }, () => Date.now() + Math.random() * 1000);
    setParticles((prev) => [...prev, ...newParticles]);

    try {
      await sendTip({
        variables: {
          streamId: id,
          amount,
          message: tipMessage || "Przesyła napiwek!",
        },
      });
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading && !data)
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          className="text-2xl text-white/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          📡 Łączenie...
        </motion.div>
      </div>
    );
  if (!data?.stream)
    return (
      <div className="h-screen flex items-center justify-center text-primary/60">
        Transmisja zakończona lub nie istnieje.
      </div>
    );

  return (
    <main className="h-screen bg-background text-white flex flex-col md:flex-row pt-16">
      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            className="text-2xl text-white/20"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📡 Symulacja Sygnału Wideo
          </motion.p>
        </div>

        {/* Stream Info Overlay */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-black drop-shadow-lg">
            {data.stream.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="live-badge">LIVE</span>
            <span className="text-white/60 text-sm font-medium">
              @{data.stream.streamer.username}
            </span>
          </div>
        </motion.div>

        {/* Viewer count */}
        <div className="absolute top-4 right-4 z-10 glass px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <span>👁️</span> {data.stream.viewerCount}
        </div>

        {/* Tip particles */}
        <AnimatePresence>
          {particles.map((pid) => (
            <TipParticle key={pid} id={pid} onDone={removeParticle} />
          ))}
        </AnimatePresence>

        {/* Quick Tip Buttons */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 px-6 flex justify-center gap-3 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[10, 50, 100].map((amount) => (
            <motion.button
              key={amount}
              onClick={() => handleTip(amount)}
              className="glass hover-glow text-white font-bold py-2.5 px-7 rounded-full text-sm flex items-center gap-2 border border-accent/20"
              whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(255,209,102,0.3)" }}
              whileTap={{ scale: 0.9 }}
            >
              💎 {amount}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Chat / Events Side */}
      <div className="w-full md:w-80 flex flex-col glass-strong border-l border-white/[0.04] h-[40vh] md:h-full">
        <div className="p-4 border-b border-white/[0.04] font-bold text-sm uppercase tracking-wider text-white/60">
          Czat & Wydarzenia
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center text-white/20 text-xs my-4">
            Witamy na czacie!
          </div>

          <AnimatePresence>
            {data.streamTips?.map((tip: any) => (
              <motion.div
                key={tip.id}
                className="glass rounded-2xl p-3 border border-accent/10"
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="text-accent font-bold text-sm">
                  {tip.sender.username} wpłacił {tip.tokenAmount} 💎
                </p>
                {tip.message && (
                  <p className="text-white/70 text-sm mt-1">{tip.message}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatBottomRef} />
        </div>

        <div className="p-3 border-t border-white/[0.04]">
          <input
            className="input-premium text-sm rounded-full px-4"
            placeholder="Wiadomość z napiwkiem..."
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
          />
        </div>
      </div>
    </main>
  );
}
