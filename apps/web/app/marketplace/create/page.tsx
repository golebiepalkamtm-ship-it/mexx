"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

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
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'IT & Tech'
  });

  const [createService, { loading }] = useMutation(CREATE_SERVICE, {
      onCompleted: () => router.push('/marketplace'),
      refetchQueries: ['GetServices']
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createService({
        variables: {
          createServiceInput: {
            title: formData.title,
            description: formData.description,
            price: parseInt(formData.price), // Int for Tokens
            location: formData.location,
            category: formData.category
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert('Błąd podczas dodawania ogłoszenia');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pt-24 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Dodaj Ogłoszenie</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tytuł ogłoszenia</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none transition"
              placeholder="np. Zaprojektuję logo..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cena (Tokeny)</label>
                <input
                name="price"
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none transition"
                placeholder="100"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Kategoria</label>
                <select
                    name="category"
                    aria-label="Kategoria ogłoszenia"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none transition"
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
             <label className="block text-sm font-medium text-gray-400 mb-1">Lokalizacja</label>
             <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none transition"
              placeholder="np. Warszawa / Online"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-1">Opis szczegółowy</label>
             <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none transition"
              placeholder="Opisz swoją usługę..."
             />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Publikowanie...' : 'Opublikuj Ogłoszenie'}
          </button>
        </form>
      </div>
    </main>
  );
}
