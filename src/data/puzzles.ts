import { imgBook, imgCat, imgHouse, imgCar, imgAirplane, imgApple } from './mufrodatImages';

export interface Puzzle {
  id: string;
  title: string;
  category: string;
  difficulty: 'pemula' | 'menengah' | 'mahir';
  type: 'scramble' | 'guess' | 'riddle';
  arabicText: string;
  transliteration: string;
  translation: string;
  scrambledWords: string[];
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  imageUrl?: string;
  colorTheme?: string; // e.g. 'violet', 'amber', 'rose', 'sky', 'indigo'
}

export const INITIAL_PUZZLES: Puzzle[] = [
  {
    id: 'puz-cat-1',
    title: 'Kucing Lucu di Rumah',
    category: 'Hewan & Rumah',
    difficulty: 'pemula',
    type: 'guess',
    arabicText: 'قِطَّةٌ جَمِيلَةٌ',
    transliteration: 'Qitthotun jamiilatun',
    translation: 'Seekor kucing yang manis / cantik',
    scrambledWords: ['قِطَّةٌ', 'جَمِيلَةٌ'],
    options: ['قِطَّةٌ (Kucing)', 'كَلْبٌ (Anjing)', 'أَرْنَبٌ (Kelinci)', 'طَائِرٌ (Burung)'],
    correctAnswer: 'قِطَّةٌ (Kucing)',
    hint: 'Hewan berkaki empat yang suka mendengkur dan mengeong.',
    explanation: 'Kata "Qitthotun" (قِطَّةٌ) adalah Isim Muannats (berakhiran ta marbuthoh), sehingga sifatnya juga muannats "Jamiilatun" (جَمِيلَةٌ).',
    imageUrl: imgCat,
    colorTheme: 'amber'
  },
  {
    id: 'puz-car-1',
    title: 'Mobil Merah Melaju',
    category: 'Transportasi',
    difficulty: 'pemula',
    type: 'guess',
    arabicText: 'سَيَّارَةٌ سَرِيعَةٌ',
    transliteration: 'Sayyaarotun sarii\'atun',
    translation: 'Mobil yang cepat',
    scrambledWords: ['سَيَّارَةٌ', 'سَرِيعَةٌ'],
    options: ['سَيَّارَةٌ (Mobil)', 'دَرَّاجَةٌ (Sepeda)', 'قِطَارٌ (Kereta)', 'حَافِلَةٌ (Bus)'],
    correctAnswer: 'سَيَّارَةٌ (Mobil)',
    hint: 'Kendaraan roda empat bermesin untuk bepergian di jalan raya.',
    explanation: 'Kata "Sayyarah" (سَيَّارَةٌ) adalah kata benda muannats yang berarti mobil. Jamaknya adalah Sayyarat (سَيَّارَاتٌ).',
    imageUrl: imgCar,
    colorTheme: 'rose'
  },
  {
    id: 'puz-apple-1',
    title: 'Buah Apel Merah yang Segar',
    category: 'Buah & Makanan',
    difficulty: 'pemula',
    type: 'guess',
    arabicText: 'تُفَّاحَةٌ حَمْرَاءُ',
    transliteration: 'Tuffaahatun hamroo-u',
    translation: 'Buah apel yang merah',
    scrambledWords: ['تُفَّاحَةٌ', 'حَمْرَاءُ'],
    options: ['تُفَّاحَةٌ (Apel)', 'بُرْتُقَالٌ (Jeruk)', 'مَوْزٌ (Pisang)', 'عِنَبٌ (Anggur)'],
    correctAnswer: 'تُفَّاحَةٌ (Apel)',
    hint: 'Buah bulat manis berwarna merah renyah dengan daun hijau.',
    explanation: '"Tuffahah" (تُفَّاحَةٌ) berarti apel. Kata sifat warna merah untuk muannats adalah Hamroo\' (حَمْرَاءُ), sedangkan mudzakkarnya adalah Ahmar (أَحْمَرُ).',
    imageUrl: imgApple,
    colorTheme: 'fuchsia'
  },
  {
    id: 'puz-airplane-1',
    title: 'Pesawat di Angkasa',
    category: 'Transportasi & Langit',
    difficulty: 'pemula',
    type: 'scramble',
    arabicText: 'تَطِيرُ الطَّائِرَةُ فِي السَّمَاءِ',
    transliteration: 'Tathiiru ath-thoo-iratu fii as-samaa-i',
    translation: 'Pesawat terbang itu melayang di langit',
    scrambledWords: ['فِي', 'السَّمَاءِ', 'تَطِيرُ', 'الطَّائِرَةُ'],
    correctAnswer: 'تَطِيرُ الطَّائِرَةُ فِي السَّمَاءِ',
    hint: 'Susun: Fi\'il mudhari\' (terbang) + Subjek (pesawat) + Harf Jar (di) + Langit.',
    explanation: 'تَطِيرُ (Fi\'il mudhari\' muannats), الطَّائِرَةُ (Fa\'il marfu\' dhommah), فِي (Harf jar), السَّمَاءِ (Isim majrur kasrah).',
    imageUrl: imgAirplane,
    colorTheme: 'sky'
  },
  {
    id: 'puz-book-1',
    title: 'Membaca Kitab Ajaib',
    category: 'Pendidikan & Ilmu',
    difficulty: 'pemula',
    type: 'scramble',
    arabicText: 'قَرَأَ التِّلْمِيذُ كِتَابًا نَافِعًا',
    transliteration: 'Qara-a at-tilmiidzu kitaaban naafi\'an',
    translation: 'Murid laki-laki itu membaca buku yang bermanfaat',
    scrambledWords: ['كِتَابًا', 'قَرَأَ', 'نَافِعًا', 'التِّلْمِيذُ'],
    correctAnswer: 'قَرَأَ التِّلْمِيذُ كِتَابًا نَافِعًا',
    hint: 'Awali dengan kata kerja masa lampau (qara-a) diikuti pelaku murid.',
    explanation: 'قَرَأَ (Fi\'il madhi), التِّلْمِيذُ (Fa\'il marfu\'), كِتَابًا (Maf\'ul bih manshub fathatain), نَافِعًا (Na\'at/sifat).',
    imageUrl: imgBook,
    colorTheme: 'violet'
  },
  {
    id: 'puz-house-1',
    title: 'Rumah yang Nyaman & Hangat',
    category: 'Rumah & Tempat',
    difficulty: 'pemula',
    type: 'scramble',
    arabicText: 'يَسْكُنُ أَحْمَدُ فِي بَيْتٍ جَمِيلٍ',
    transliteration: 'Yaskunu Ahmadu fii baytin jamiilin',
    translation: 'Ahmad tinggal di dalam rumah yang indah',
    scrambledWords: ['فِي', 'بَيْتٍ', 'يَسْكُنُ', 'أَحْمَدُ', 'جَمِيلٍ'],
    correctAnswer: 'يَسْكُنُ أَحْمَدُ فِي بَيْتٍ جَمِيلٍ',
    hint: 'Susun: Tinggal (yaskunu) + Ahmad + di + rumah + indah.',
    explanation: 'يَسْكُنُ (Fi\'il mudhari\'), أَحْمَدُ (Fa\'il), فِي (Harf jar), بَيْتٍ (Majrur), جَمِيلٍ (Na\'at majrur kasratain).',
    imageUrl: imgHouse,
    colorTheme: 'indigo'
  },
  {
    id: 'puz-riddle-book',
    title: 'Teka-Teki Logika: Sahabat Setia Berisi Ilmu',
    category: 'Fawazir & Logika',
    difficulty: 'menengah',
    type: 'riddle',
    arabicText: 'أَنَا لَا أَتَكَلَّمُ، وَلَكِنِّي أُخْبِرُكَ بِكُلِّ شَيْءٍ، وَأَحْفَظُ لَكَ الْعِلْمَ',
    transliteration: 'Ana laa atakallamu, wa laakinni ukhbiruka bikulli syai-in',
    translation: 'Aku tidak berbicara, tetapi aku mengabarkan segala hal kepadamu dan menjaga ilmu. Siapakah aku?',
    scrambledWords: ['الْكِتَابُ', 'الْقَلَمُ', 'الْمِرْآةُ', 'السَّاعَةُ'],
    options: ['الْكِتَابُ (Buku)', 'الْقَلَمُ (Pena)', 'السَّاعَةُ (Jam dinding)', 'الْمِرْآةُ (Cermin)'],
    correctAnswer: 'الْكِتَابُ (Buku)',
    hint: 'Benda berjilid penuh lembaran kertas dengan huruf-huruf bercahaya.',
    explanation: 'Jawaban yang tepat adalah Al-Kitaab (الْكِتَابُ). Pepatah Arab terkenal: خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ (Sebaik-baik teman duduk sepanjang masa adalah buku).',
    imageUrl: imgBook,
    colorTheme: 'violet'
  },
  {
    id: 'puz-riddle-cloud',
    title: 'Teka-Teki Logika: Yang Menangis Tanpa Mata',
    category: 'Fawazir & Alam',
    difficulty: 'menengah',
    type: 'riddle',
    arabicText: 'أَمْشِي بِلَا رِجْلَيْنِ، وَأَبْكِي بِلَا عَيْنَيْنِ، فَمَنْ أَنَا؟',
    transliteration: 'Amsyii bilaa rijlayni, wa abkii bilaa \'aynayni, faman anaa?',
    translation: 'Aku berjalan tanpa dua kaki, dan aku menangis tanpa dua mata. Siapakah aku?',
    scrambledWords: ['السَّحَابُ', 'الشَّمْسُ', 'الرِّيحُ', 'الْبَحْرُ'],
    options: ['السَّحَابُ (Awan/Mendung)', 'الشَّمْسُ (Matahari)', 'الرِّيحُ (Angin)', 'الْقَمَرُ (Bulan)'],
    correctAnswer: 'السَّحَابُ (Awan/Mendung)',
    hint: 'Berjalan di angkasa tertiup angin lalu menurunkan tetesan hujan sebagai tangisan.',
    explanation: 'السَّحَابُ (Awan): bergerak di angkasa dan menangis dalam kiasan puitis yaitu meneteskan rintik hujan (الْمَطَرُ).',
    imageUrl: imgAirplane,
    colorTheme: 'cyan'
  }
];
