"use client";

import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      email
      username
      status
    }
  }
`;

export default function ProfilePage() {
  const { data, loading, error } = useQuery(GET_PROFILE, {
    fetchPolicy: "network-only", // For now, to force auth check
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (loading) return <div className="p-24">Ładowanie profilu...</div>;
  // Note: 'me' query is not implemented yet in backend, using placeholder for now.
  // Actually, I haven't implemented 'me' query in UsersResolver!

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Twój Profil</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col gap-4">
          <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-center font-semibold">Tymczasowy Widok</p>
          <p className="text-gray-400 text-center">
            Implementacja backendu dla 'me' w toku.
          </p>
        </div>
      </div>
    </div>
  );
}
