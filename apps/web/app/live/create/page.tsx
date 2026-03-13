"use client";

import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Rozpocznij Transmisję
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tytuł transmisji
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:border-red-500 outline-none"
              placeholder="np. Q&A z widzami"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Kategoria
            </label>
            <select
              aria-label="Kategoria transmisji"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:border-red-500 outline-none"
            >
              <option>Just Chatting</option>
              <option>Gaming</option>
              <option>Music</option>
              <option>Education</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Uruchamianie..." : "Start LIVE"}
          </button>
        </form>
      </div>
    </main>
  );
}
