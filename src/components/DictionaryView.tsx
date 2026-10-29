import React, { useState } from 'react';
import { Search, Volume2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { speakArabic } from '../utils/audio';
import { VISUAL_VOCABULARY, VisualVocab } from '../data/mufrodatImages';

export const DictionaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Pendidikan & Ilmu', 'Hewan Lucu', 'Tempat & Bangunan', 'Transportasi', 'Buah & Makanan'];

  const filtered = VISUAL_VOCABULARY.filter(item => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.arabic.includes(searchTerm) ||
      item.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indonesian.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>Galeri Mufrodat Bergambar 3D</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
            </h2>
            <p className="text-xs text-slate-500">
              Koleksi kosakata Arab visual dengan gambar ilustrasi warna-warni, harakat lengkap, dan lafal suara asli
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kata (Arab / Indonesia)..."
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-indigo-50/50 rounded-2xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills with Colorful Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Visual Flashcards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item: VisualVocab) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border-2 border-indigo-100/80 shadow-md hover:shadow-xl hover:border-violet-300 transition-all overflow-hidden flex flex-col group transform hover:-translate-y-1"
          >
            {/* Image banner with gradient overlay */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.indonesian}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border ${item.badgeBg}`}>
                  {item.category}
                </span>
              </div>
              <button
                onClick={() => speakArabic(item.arabic)}
                className="absolute bottom-3 right-3 p-2.5 bg-white/90 hover:bg-white text-violet-700 rounded-2xl shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-black cursor-pointer"
                title="Dengarkan pelafalan"
              >
                <Volume2 className="w-4 h-4 text-violet-600" />
                <span>Lafal</span>
              </button>
            </div>

            {/* Word Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {item.indonesian}
                  </h4>
                  <span className="text-xs text-violet-600 font-medium italic">
                    {item.transliteration}
                  </span>
                </div>

                <div
                  dir="rtl"
                  className="font-arabic text-3xl font-black text-violet-950"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {item.arabic}
                </div>
              </div>

              {/* Example sentence */}
              <div className="p-3 bg-white rounded-2xl border border-indigo-100 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider block mb-1">
                  Contoh Kalimat:
                </span>
                <div
                  dir="rtl"
                  className="font-arabic text-lg font-bold text-slate-800 leading-snug"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {item.exampleArabic}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5 text-right">
                  "{item.exampleIndo}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
