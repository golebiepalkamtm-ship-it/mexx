"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useState, ChangeEvent } from "react";

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

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, loading, error } = useQuery(GET_SERVICES, {
    variables: { search, category },
    pollInterval: 10000,
  });

  if (error)
    return (
      <div className="text-center p-10 text-red-500">Błąd: {error.message}</div>
    );

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              🛒 Marketplace
            </h1>
            <p className="text-gray-400">
              Kupuj i sprzedawaj usługi za Tokeny.
            </p>
          </div>
          <Link
            href="/marketplace/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg shadow-indigo-900/50"
          >
            + Dodaj Ogłoszenie
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4">
          <input
            placeholder="Szukaj usług..."
            className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-indigo-500 text-white"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          <select
            title="Kategoria"
            className="p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-indigo-500 text-white"
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          >
            <option value="">Wszystkie kategori</option>
            <option value="IT & Tech">IT & Tech</option>
            <option value="Dom & Ogród">Dom & Ogród</option>
            <option value="Edukacja">Edukacja</option>
            <option value="Zdrowie">Zdrowie</option>
            <option value="Rozrywka">Rozrywka</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <p className="col-span-full text-center py-10 text-gray-500">
              Ładowanie ofert...
            </p>
          )}

          {data?.services?.map((service: any) => (
            <Link
              key={service.id}
              href={`/marketplace/${service.id}`}
              className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition shadow-lg flex flex-col"
            >
              <div className="h-40 bg-gray-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 group-hover:scale-110 transition duration-700 pointer-events-none" />
                <span className="text-4xl z-10">💼</span>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white z-10">
                  {service.category || "Inne"}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition line-clamp-1">
                    {service.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Sprzedaje:{" "}
                  <span className="text-indigo-300">
                    @{service.user.username}
                  </span>
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-700 pt-4">
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    📍 {service.location || "Online"}
                  </span>
                  <span className="font-bold text-xl text-yellow-400">
                    {service.price} 💎
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {(!data?.services || data.services.length === 0) && !loading && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-xl">Brak ogłoszeń spełniających kryteria.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
