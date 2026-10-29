// High-resolution illustrated assets for Mufrodat vocabulary
import imgBook from '../assets/images/mufrodat_book_magic_1793264373954.jpg';
import imgCat from '../assets/images/mufrodat_cat_cute_1793264372940.jpg';
import imgHouse from '../assets/images/mufrodat_house_cozy_1793264390751.jpg';
import imgCar from '../assets/images/mufrodat_car_colorful_1793264391388.jpg';
import imgAirplane from '../assets/images/mufrodat_airplane_sky_1793264418416.jpg';
import imgApple from '../assets/images/mufrodat_apple_fresh_1793264418294.jpg';

export interface VisualVocab {
  id: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
  category: string;
  type: string;
  image: string;
  accentColor: string;
  badgeBg: string;
  exampleArabic: string;
  exampleIndo: string;
}

export const VISUAL_VOCABULARY: VisualVocab[] = [
  {
    id: 'v-book',
    arabic: 'كِتَابٌ',
    transliteration: 'Kitaabun',
    indonesian: 'Buku',
    category: 'Pendidikan & Ilmu',
    type: 'Isim (Kata Benda)',
    image: imgBook,
    accentColor: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    exampleArabic: 'قَرَأَ الْوَلَدُ كِتَابًا مُمْتِعًا',
    exampleIndo: 'Anak itu telah membaca buku yang menarik'
  },
  {
    id: 'v-cat',
    arabic: 'قِطَّةٌ',
    transliteration: 'Qitthotun',
    indonesian: 'Kucing',
    category: 'Hewan Lucu',
    type: 'Isim (Kata Benda)',
    image: imgCat,
    accentColor: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    exampleArabic: 'هَذِهِ قِطَّةٌ صَغِيرَةٌ وَلَطِيفَةٌ',
    exampleIndo: 'Ini adalah kucing yang kecil dan manis'
  },
  {
    id: 'v-house',
    arabic: 'بَيْتٌ',
    transliteration: 'Baytun',
    indonesian: 'Rumah',
    category: 'Tempat & Bangunan',
    type: 'Isim (Kata Benda)',
    image: imgHouse,
    accentColor: 'from-sky-400 to-indigo-500',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    exampleArabic: 'بَيْتُنَا جَمِيلٌ وَدَافِئٌ',
    exampleIndo: 'Rumah kami indah dan hangat'
  },
  {
    id: 'v-car',
    arabic: 'سَيَّارَةٌ',
    transliteration: 'Sayyaarotun',
    indonesian: 'Mobil',
    category: 'Transportasi',
    type: 'Isim (Kata Benda)',
    image: imgCar,
    accentColor: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    exampleArabic: 'رَكِبَ أَبِي سَيَّارَةً سَرِيعَةً',
    exampleIndo: 'Ayahku mengendarai mobil yang cepat'
  },
  {
    id: 'v-airplane',
    arabic: 'طَائِرَةٌ',
    transliteration: 'Thoo-irotun',
    indonesian: 'Pesawat Terbang',
    category: 'Transportasi',
    type: 'Isim (Kata Benda)',
    image: imgAirplane,
    accentColor: 'from-cyan-400 to-blue-600',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    exampleArabic: 'تَطِيرُ الطَّائِرَةُ فِي السَّمَاءِ',
    exampleIndo: 'Pesawat terbang melayang di angkasa'
  },
  {
    id: 'v-apple',
    arabic: 'تُفَّاحَةٌ',
    transliteration: 'Tuffaahatun',
    indonesian: 'Apel',
    category: 'Buah & Makanan',
    type: 'Isim (Kata Benda)',
    image: imgApple,
    accentColor: 'from-pink-500 to-rose-600',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
    exampleArabic: 'أَكَلْتُ تُفَّاحَةً حَمْرَاءَ حُلْوَةً',
    exampleIndo: 'Saya memakan buah apel merah yang manis'
  }
];

export { imgBook, imgCat, imgHouse, imgCar, imgAirplane, imgApple };
