"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CREATE_SERVICE = gql`
  mutation CreateService($createServiceInput: CreateServiceInput!) {
    createService(createServiceInput: $createServiceInput) {
      id
      title
    }
  }
`;

export default function CreateServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "IT & Tech",
  });

  const [createService, { loading }] = useMutation(CREATE_SERVICE, {
    onCompleted: () => router.push("/marketplace"),
    refetchQueries: ["GetServices"],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createService({
        variables: {
          createServiceInput: {
            title: formData.title,
            description: formData.description,
            price: parseInt(formData.price),
            location: formData.location,
            category: formData.category,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania ogłoszenia");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen p-6 pt-8 md:pt-24 flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl glass-card rounded-3xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💼
            </motion.div>
            <h1 className="text-3xl font-black text-gradient-brand">
              Dodaj Ogłoszenie
            </h1>
            <p className="text-white/30 text-sm mt-1">
              Sprzedawaj usługi za tokeny
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Tytuł ogłoszenia
              </label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-premium"
                placeholder="np. Zaprojektuję logo..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Cena (Tokeny)
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Kategoria
                </label>
                <select
                  name="category"
                  aria-label="Kategoria ogłoszenia"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-premium"
                >
                  <option value="IT & Tech">IT & Tech</option>
                  <option value="Dom & Ogród">Dom & Ogród</option>
                  <option value="Edukacja">Edukacja</option>
                  <option value="Zdrowie">Zdrowie</option>
                  <option value="Rozrywka">Rozrywka</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Lokalizacja
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-premium"
                placeholder="np. Warszawa / Online"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Opis szczegółowy
              </label>
              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="input-premium resize-none"
                placeholder="Opisz swoją usługę..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-4 rounded-2xl text-sm font-bold disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Publikowanie..." : "Opublikuj Ogłoszenie"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
