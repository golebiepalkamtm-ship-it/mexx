"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { motion } from "framer-motion";

const GET_STREAMS = gql`
  query GetStreams {
    streams {
      id
      title
      category
      viewerCount
      startedAt
      streamer {
        username
      }
    }
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function LivePage() {
  const { data, loading, error } = useQuery(GET_STREAMS, {
    pollInterval: 5000,
  });

  if (loading && !data)
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-3xl bg-surface shimmer"
            />
          ))}
        </div>
      </div>
    );

  return (
    <main className="min-h-screen p-6 pt-8 md:pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <span className="relative">
                <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
                <span className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
              </span>
              <span className="text-gradient-brand">LIVE</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Transmisje na żywo</p>
          </div>
          <Link href="/live/create">
            <motion.div
              className="btn-premium px-8 py-3 rounded-2xl text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📡</span> Start Transmisji
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data?.streams?.map((stream: any) => (
            <motion.div key={stream.id} variants={itemVariants}>
              <Link
                href={`/live/${stream.id}`}
                className="group relative aspect-video rounded-3xl overflow-hidden glass-card block"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-surface group-hover:scale-110 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-primary/5" />
                  <span className="text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    📹
                  </span>
                </div>

                <div className="absolute top-3 left-3 z-10">
                  <span className="live-badge">LIVE</span>
                </div>
                <div className="absolute top-3 right-3 z-10 glass px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span>👁️</span> {stream.viewerCount}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-white/50">
                    @{stream.streamer.username}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}

          {(!data?.streams || data.streams.length === 0) && (
            <motion.div
              className="col-span-full py-24 text-center glass-card rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-5xl mb-4">📡</p>
              <p className="text-xl font-semibold text-white/50">
                Brak aktywnych transmisji
              </p>
              <p className="text-sm text-white/25 mt-2">
                Zacznij jako pierwszy!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
