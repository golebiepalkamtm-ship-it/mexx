"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

const GET_SERVICES = gql`
  query GetServices($search: String, $category: String) {
    services(search: $search, category: $category) {
      id
      title
      price
      category
      location
      user {
        username
      }
    }
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, loading, error } = useQuery(GET_SERVICES, {
    variables: { search, category },
    pollInterval: 10000,
  });

  if (error)
    return (
      <div className="text-center p-10 text-primary/60">
        Błąd: {error.message}
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
            <h1 className="text-4xl font-black">
              <span className="text-gradient-brand">Marketplace</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Kupuj i sprzedawaj usługi za Tokeny
            </p>
          </div>
          <Link href="/marketplace/create">
            <motion.div
              className="btn-premium px-8 py-3 rounded-2xl text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Dodaj Ogłoszenie
            </motion.div>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="glass-card rounded-3xl p-4 mb-8 flex flex-col md:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            placeholder="Szukaj usług..."
            className="input-premium flex-1"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <select
            title="Kategoria"
            className="input-premium md:w-48"
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCategory(e.target.value)
            }
          >
            <option value="">Wszystkie kategorie</option>
            <option value="IT & Tech">IT & Tech</option>
            <option value="Dom & Ogród">Dom & Ogród</option>
            <option value="Edukacja">Edukacja</option>
            <option value="Zdrowie">Zdrowie</option>
            <option value="Rozrywka">Rozrywka</option>
          </select>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-3xl bg-surface shimmer"
                />
              ))}
            </>
          )}

          {data?.services?.map((service: any) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Link
                href={`/marketplace/${service.id}`}
                className="group glass-card card-tilt rounded-3xl overflow-hidden flex flex-col block"
              >
                <div className="h-40 bg-surface flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                  <span className="text-4xl z-10 group-hover:scale-110 transition-transform duration-500">
                    💼
                  </span>
                  <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-[10px] font-bold text-white/70 uppercase tracking-wider z-10">
                    {service.category || "Inne"}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-white/40 mb-4">
                    Sprzedaje:{" "}
                    <span className="text-secondary/70">
                      @{service.user.username}
                    </span>
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-4">
                    <span className="text-white/30 text-xs flex items-center gap-1">
                      📍 {service.location || "Online"}
                    </span>
                    <span className="font-black text-xl text-accent">
                      {service.price} 💎
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {(!data?.services || data.services.length === 0) && !loading && (
            <motion.div
              className="col-span-full py-24 text-center glass-card rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-5xl mb-4">💎</p>
              <p className="text-xl font-semibold text-white/50">
                Brak ogłoszeń
              </p>
              <p className="text-sm text-white/25 mt-2">
                Spróbuj zmienić filtry
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
