"use client";

import { useQuery, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

const GET_FEED = gql`
  query GetFeed {
    feed {
      id
      content
      mediaUrl
      likesCount
      commentsCount
      user {
        username
        profilePhoto
      }
    }
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  },
};

function ShimmerLoader() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto pt-24 px-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-surface"
        >
          <div className="absolute inset-0 shimmer" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <div className="w-32 h-4 rounded-full bg-white/5 shimmer" />
            <div className="w-48 h-3 rounded-full bg-white/5 shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeartBurst({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50 text-5xl"
      style={{ left: x - 24, top: y - 24 }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      ❤️
    </motion.div>
  );
}

export default function Home() {
  const { data, loading, error } = useQuery(GET_FEED);
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleDoubleTap = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setHearts((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 900);
    },
    [],
  );

  if (loading) return <ShimmerLoader />;
  if (error)
    return (
      <motion.div
        className="flex justify-center p-10 text-primary/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Błąd: {error.message}
      </motion.div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-6 md:pt-24">
      <div className="w-full max-w-md">
        <motion.h1
          className="text-3xl font-black mb-8 text-center text-gradient-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          Feed
        </motion.h1>

        <motion.div
          className="flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data?.feed?.map((post: any) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden glass-card group cursor-pointer"
              onDoubleClick={handleDoubleTap}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {post.mediaUrl ? (
                <img
                  src={post.mediaUrl}
                  alt="Post content"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                  <p className="text-xl p-6 text-center font-bold text-white/90 relative z-10">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Heart burst animation layer */}
              <AnimatePresence>
                {hearts.map((h) => (
                  <HeartBurst key={h.id} x={h.x} y={h.y} />
                ))}
              </AnimatePresence>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-bold text-lg drop-shadow-lg">
                      @{post.user?.username || "user"}
                    </p>
                    {post.mediaUrl && (
                      <p className="text-sm text-white/70 mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-5 items-center">
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <button className="text-2xl drop-shadow-lg transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,46,99,0.6)]">
                        ❤️
                      </button>
                      <span className="text-xs font-bold text-white/80 mt-0.5">
                        {post.likesCount}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <button className="text-2xl drop-shadow-lg transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(8,217,214,0.6)]">
                        💬
                      </button>
                      <span className="text-xs font-bold text-white/80 mt-0.5">
                        {post.commentsCount}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <button className="text-2xl drop-shadow-lg transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,209,102,0.6)]">
                        💰
                      </button>
                      <span className="text-xs font-bold text-white/80 mt-0.5">
                        Tip
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {(!data?.feed || data.feed.length === 0) && (
            <motion.div
              className="text-center py-20 glass-card rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-4xl mb-4">✨</p>
              <p className="text-xl font-semibold text-white/60">
                Brak postów
              </p>
              <p className="text-sm text-white/30 mt-2">
                Dodaj coś jako pierwszy!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
