"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

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

export default function LivePage() {
  const { data, loading, error } = useQuery(GET_STREAMS, {
    pollInterval: 5000,
  });

  if (loading && !data)
    return <div className="text-center p-10">Ładowanie transmisji...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            Mexx LIVE
          </h1>
          <Link
            href="/live/create"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition"
          >
            Start Transmisji
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.streams?.map((stream: any) => (
            <Link
              key={stream.id}
              href={`/live/${stream.id}`}
              className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 group-hover:scale-105 transition duration-500">
                <span className="text-6xl opacity-50">📹</span>
              </div>

              <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-bold uppercase">
                LIVE
              </div>
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <span>👁️</span> {stream.viewerCount}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-bold text-lg">{stream.title}</h3>
                <p className="text-sm text-gray-300">
                  @{stream.streamer.username}
                </p>
              </div>
            </Link>
          ))}

          {(!data?.streams || data.streams.length === 0) && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-xl">Brak aktywnych transmisji.</p>
              <p>Zacznij jako pierwszy!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
