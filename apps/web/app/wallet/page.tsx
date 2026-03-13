"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

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

export default function WalletPage() {
  const { data, loading, error, refetch } = useQuery(GET_WALLET);
  const [depositTokens, { loading: depositing }] = useMutation(DEPOSIT_TOKENS);

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
    return <div className="text-center p-10">Ładowanie portfela...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Portfel Tokenów</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl flex flex-col items-center">
          <p className="text-purple-200 text-lg uppercase tracking-widest font-semibold mb-2">
            Twoje Saldo
          </p>
          <h2 className="text-6xl font-bold mb-4">
            {data?.myWallet?.balance || 0} <span className="text-3xl">🪙</span>
          </h2>
          <p className="text-sm opacity-70">
            Ostatnia aktualizacja:{" "}
            {data?.myWallet?.updatedAt
              ? new Date(data.myWallet.updatedAt).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* Top Up Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Doładuj Tokeny</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[100, 500, 1000, 5000].map((amount) => (
              <button
                key={amount}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 transition flex flex-col items-center gap-2 group"
                onClick={() => handleDeposit(amount)}
                disabled={depositing}
              >
                <span className="text-3xl group-hover:scale-110 transition">
                  💎
                </span>
                <span className="font-bold text-xl">{amount}</span>
                <span className="text-xs text-gray-400">
                  {(amount / 10).toFixed(2)} PLN
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold">Historia Transakcji</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {data?.myTransactions?.map((tx: any) => (
              <div
                key={tx.id}
                className="p-4 flex justify-between items-center bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount > 0
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {tx.amount > 0 ? "⬇" : "⬆"}
                  </div>
                  <div>
                    <p className="font-bold">{tx.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-lg ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </div>
            ))}
            {data?.myTransactions?.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Brak transakcji.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
