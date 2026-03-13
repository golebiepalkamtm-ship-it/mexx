"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GET_WALLET = gql`
  query GetMyWallet {
    myWallet {
      balance
      updatedAt
    }
    myTransactions {
      id
      type
      amount
      createdAt
    }
  }
`;

const DEPOSIT_TOKENS = gql`
  mutation DepositTokens($amount: Int!) {
    depositTokens(amount: $amount) {
      balance
    }
  }
`;

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function WalletPage() {
  const { data, loading, error, refetch } = useQuery(GET_WALLET);
  const [depositTokens, { loading: depositing }] =
    useMutation(DEPOSIT_TOKENS);

  const [selectedPack, setSelectedPack] = useState<number | null>(null);

  const handleDeposit = async (amount: number) => {
    try {
      await depositTokens({ variables: { amount } });
      refetch();
      alert(`Doładowano ${amount} tokenów!`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-48 rounded-3xl bg-surface shimmer" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-surface shimmer" />
            ))}
          </div>
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
          <span className="text-gradient-brand">Portfel</span>
        </motion.h1>

        {/* Balance Card */}
        <motion.div
          className="relative rounded-3xl p-8 mb-10 overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-white/60 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Twoje Saldo
            </p>
            <h2 className="text-6xl font-black mb-3">
              {data?.myWallet?.balance || 0}{" "}
              <span className="text-3xl">🪙</span>
            </h2>
            <p className="text-sm text-white/40">
              Ostatnia aktualizacja:{" "}
              {data?.myWallet?.updatedAt
                ? new Date(data.myWallet.updatedAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </motion.div>

        {/* Top Up Section */}
        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4 text-white/60">
            Doładuj Tokeny
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[100, 500, 1000, 5000].map((amount, i) => (
              <motion.button
                key={amount}
                className="glass-card hover-glow rounded-2xl p-6 flex flex-col items-center gap-2 group disabled:opacity-50"
                onClick={() => handleDeposit(amount)}
                disabled={depositing}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  💎
                </span>
                <span className="font-black text-xl">{amount}</span>
                <span className="text-[11px] text-white/30">
                  {(amount / 10).toFixed(2)} PLN
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.04]">
            <h3 className="text-lg font-bold text-white/60">
              Historia Transakcji
            </h3>
          </div>
          <motion.div
            className="divide-y divide-white/[0.04]"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {data?.myTransactions?.map((tx: any) => (
              <motion.div
                key={tx.id}
                className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                variants={itemVariants}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                      tx.amount > 0
                        ? "bg-green-500/10 text-green-400"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {tx.amount > 0 ? "⬇" : "⬆"}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tx.type}</p>
                    <p className="text-[11px] text-white/30">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-black text-lg ${tx.amount > 0 ? "text-green-400" : "text-primary"}`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </motion.div>
            ))}
            {data?.myTransactions?.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-5xl mb-3">🪙</p>
                <p className="text-white/30">Brak transakcji</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
