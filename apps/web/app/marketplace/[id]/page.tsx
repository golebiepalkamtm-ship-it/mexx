"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    variables: { id },
  });

  const [purchase, { loading: purchaseLoading }] = useMutation(
    PURCHASE_SERVICE,
    {
      onCompleted: () => {
        alert("Zakup udany! Środki zostały przekazane.");
        router.push("/marketplace");
      },
      onError: (err) => alert("Błąd zakupu: " + err.message),
    },
  );

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="md:col-span-2 h-64 rounded-3xl bg-surface shimmer" />
          <div className="h-48 rounded-3xl bg-surface shimmer" />
        </div>
      </div>
    );
  if (error || !data?.service)
    return (
      <div className="min-h-screen flex items-center justify-center text-primary/60">
        Ogłoszenie nie istnieje.
      </div>
    );

  const { service } = data;

  return (
    <main className="min-h-screen p-6 pt-8 md:pt-24 flex justify-center">
      <motion.div
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block glass px-4 py-1.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider mb-4">
                {service.category || "Inne"}
              </span>
              <h1 className="text-3xl font-black mb-4">{service.title}</h1>
              <div className="flex items-center gap-3 text-white/40 text-sm mb-8">
                <span>📍 {service.location || "Online"}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>
                  Dodane przez:{" "}
                  <span className="text-secondary/70">
                    @{service.user.username}
                  </span>
                </span>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

              <div className="text-white/60 leading-relaxed">
                <p className="whitespace-pre-line">
                  {service.description || "Brak opisu"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Action */}
        <div className="space-y-6">
          <motion.div
            className="glass-card rounded-3xl p-6 sticky top-24 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-6">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                  Cena usługi
                </p>
                <p className="text-5xl font-black text-accent">
                  {service.price}{" "}
                  <span className="text-2xl">💎</span>
                </p>
              </div>

              <motion.button
                onClick={() =>
                  purchase({ variables: { id: service.id } })
                }
                disabled={purchaseLoading}
                className="w-full btn-premium py-4 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {purchaseLoading ? "Przetwarzanie..." : "KUP TERAZ"}
              </motion.button>

              <p className="text-[11px] text-center text-white/25 mt-4 leading-relaxed">
                Płatność natychmiastowa. Środki zostaną przelane na
                portfel sprzedającego.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
