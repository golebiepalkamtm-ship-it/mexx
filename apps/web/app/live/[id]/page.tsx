"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

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

export default function StreamPage() {
  const { id } = useParams();
  const [tipMessage, setTipMessage] = useState("");
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

  const handleTip = async (amount: number) => {
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
    return <div className="text-center p-10">Łączenie...</div>;
  if (!data?.stream)
    return (
      <div className="text-center p-10 text-red-500">
        Transmisja zakończona lub nie istnieje.
      </div>
    );

  return (
    <main className="h-screen bg-black text-white flex flex-col md:flex-row pt-16">
      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900 border-r border-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl text-gray-500 animate-pulse">
            📡 Symulacja Sygnału Wideo
          </p>
        </div>

        <div className="absolute top-4 left-4 z-10">
          <h1 className="text-2xl font-bold shadow-black drop-shadow-md">
            {data.stream.title}
          </h1>
          <p className="text-red-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            LIVE @{data.stream.streamer.username}
          </p>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center gap-4">
          {[10, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => handleTip(amount)}
              className="bg-yellow-500/80 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full backpack-blur transition transform hover:scale-105"
            >
              💎 {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Chat / Events Side */}
      <div className="w-full md:w-80 flex flex-col bg-gray-900 border-l border-gray-800 h-[40vh] md:h-full">
        <div className="p-4 border-b border-gray-800 font-bold bg-gray-800">
          Czat & Wydarzenia
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center text-gray-500 text-xs my-4">
            Witamy na czacie!
          </div>

          {data.streamTips?.map((tip: any) => (
            <div
              key={tip.id}
              className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded-lg animate-in slide-in-from-right fade-in duration-300"
            >
              <p className="text-yellow-400 font-bold text-sm">
                {tip.sender.username} wpłacił {tip.tokenAmount} 💎
              </p>
              {tip.message && (
                <p className="text-white text-sm mt-1">{tip.message}</p>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <div className="p-3 bg-gray-800 border-t border-gray-700">
          <input
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
            placeholder="Wiadomość z napiwkiem..."
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
          />
        </div>
      </div>
    </main>
  );
}
