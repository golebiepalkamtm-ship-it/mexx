"use client";

import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';

const GET_SERVICE = gql`
  query GetService($id: String!) {
    service(id: $id) {
      id
      title
      description
      price
      location
      category
      user {
        username
      }
    }
  }
`;

const PURCHASE_SERVICE = gql`
  mutation PurchaseService($id: String!) {
    purchaseService(serviceId: $id)
  }
`;

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_SERVICE, {
      variables: { id }
  });

  const [purchase, { loading: purchaseLoading }] = useMutation(PURCHASE_SERVICE, {
      onCompleted: () => {
          alert('Zakup udany! Środki zostały przekazane.');
          router.push('/marketplace');
      },
      onError: (err) => alert('Błąd zakupu: ' + err.message)
  });

  if (loading) return <div className="text-center p-20">Ładowanie...</div>;
  if (error || !data?.service) return <div className="text-center p-20 text-red-500">Ogłoszenie nie istnieje.</div>;

  const { service } = data;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24 flex justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                    <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider">{service.category || "Inne"}</span>
                    <h1 className="text-3xl font-bold mt-2 mb-4">{service.title}</h1>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                        <span>📍 {service.location || 'Online'}</span>
                        <span>•</span>
                        <span>Dodane przez: <span className="text-indigo-300">@{service.user.username}</span></span>
                    </div>

                    <hr className="border-gray-700 my-6" />

                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p className="whitespace-pre-line leading-relaxed">{service.description || "Brak opisu"}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Action */}
            <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 sticky top-24">
                    <div className="text-center mb-6">
                        <p className="text-gray-400 text-sm">Cena usługi</p>
                        <p className="text-4xl font-black text-yellow-500">{service.price} 💎</p>
                    </div>

                    <button
                        onClick={() => purchase({ variables: { id: service.id }})}
                        disabled={purchaseLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {purchaseLoading ? 'Przetwarzanie...' : 'KUP TERAZ'}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        Płatność natychmiastowa. Środki zostaną przelane na portfel sprzedającego.
                    </p>
                </div>
            </div>
        </div>
    </main>
  );
}
