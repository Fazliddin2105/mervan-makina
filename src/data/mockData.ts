import { Product, Category, Brand, ServiceItem, BlogPost, FAQItem } from '../types';

export const BRANDS_DATA: Brand[] = [
  {
    id: 'mervan-makina',
    name: 'Mervan Makina',
    logo: '',
    country: 'O\'zbekiston',
    established: '2015',
    description: 'O\'zbekistondagi yetakchi sanoat va kommunal tozalash uskunalari yetkazib beruvchisi. MK seriyali supurish va pol yuvish mashinalari.',
    isOfficialPartner: true,
    featured: true,
    productCount: 11,
    website: 'https://mervanmakina.uz'
  }
];

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'floor-scrubbers',
    name: 'Pol Yuvish Mashinalari',
    iconName: 'Sparkles',
    description: 'Epoksid, kafel, mramor va beton pollar uchun avtomatik va qo\'lda boshqariladigan professional pol yuvish mashinalari.',
    itemCount: 4,
    image: '/images/products/mk-4/1.webp'
  },
  {
    id: 'vacuum-cleaners',
    name: 'Sanoat Changyutgichlari',
    iconName: 'Wind',
    description: 'HEPA filtrli, nam va quruq tozalash uchun mo\'ljallangan chidamli sanoat changyutgichlari.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'pressure-washers',
    name: 'Yuqori Bosimli Yuvish',
    iconName: 'Zap',
    description: 'Issiq va sovuq suvli, 500 bargacha bosimli yuqori samarali yuvish apparatlari.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'carpet-cleaners',
    name: 'Gilam Yuvish Mashinalari',
    iconName: 'Layers',
    description: 'Mehmonxonalar va biznes markazlar gilam va mebellarini chuqur tozalash va yuvish mashinalari.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'ride-on-machines',
    name: 'Haydaladigan (Ride-On) Texnikalar',
    iconName: 'Truck',
    description: 'Katta omborxonalar, aeroport va logistika markazlari uchun akkumulyatorli va dizel o\'tirib haydaladigan texnikalar.',
    itemCount: 3,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'sweepers',
    name: 'Supurish Mashinalari',
    iconName: 'RefreshCw',
    description: 'Ombor ko\'chalari, turargohlar va hududlarni changsiz supuruvchi sanoat supurish mashinalari.',
    itemCount: 3,
    image: '/images/products/mk-1/1.webp'
  },
  {
    id: 'industrial-vacuums',
    name: 'Maxsus Sanoat Vakuum Tizimlari',
    iconName: 'Cpu',
    description: 'Metall qirindilar, moy, sement changi uchun portlashdan himoyalangan 3-fazali sanoat vakuum tizimlari.',
    itemCount: 1,
    image: '/images/products/mk-10/1.webp'
  },
  {
    id: 'steam-cleaners',
    name: 'Bug\'li Tozalagichlar',
    iconName: 'Flame',
    description: 'Kasalxonalar va oziq-ovqat korxonalari uchun 180°C haroratli bug\' bilan dezinfeksiya qiluvchi apparatlar.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'cleaning-chemicals',
    name: 'Professional Kimyoviy Vositalar',
    iconName: 'Droplet',
    description: 'Eko-sertifikatlangan, pol yuvish mashinalari uchun ko\'piklanmaydigan va moy ketkazuvchi konsentratlar.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  },
  {
    id: 'accessories',
    name: 'Aksessuarlar va Ehtiyot Qismlar',
    iconName: 'Wrench',
    description: 'Original rezinasi (squeegee), litiy akkumulyatorlar, cho\'tkalar, shlang va HEPA filtrlar.',
    itemCount: 0,
    image: '/images/products/mk-3/1.webp'
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'mm-mk-1-sweeper',
    name: 'MK-1 Ko\'cha supurish mashinasi',
    model: 'MK-1',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'sweepers',
    // 182 250 000 so'm = 14464.2857 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 14464.2857,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    isFeatured: true,
    voltage: '48 V',
    power: '2200 Vt',
    brushWidth: '1550–2500 mm',
    tankCapacity: '—',
    productivity: '—',
    usageArea: ['Ko\'cha va yo\'llar', 'Avtoturargohlar', 'Ombor majmualari', 'Sanoat hududlari', 'Jamoat maydonlari'],
    machineType: 'Ride-on',
    description: 'Operator kabinasi bilan jihozlangan akkumulyatorli ko\'cha supurish mashinasi: 2200 W dvigatel, 48 V quvvat manbai va 1550-2500 mm sozlanadigan supurish kengligi.',
    longDescription: 'MK-1 ko\'chalar, yo\'llar, sanoat hududlari, avtoturargohlar va ombor majmualarini mexanizatsiyalashgan tarzda tozalash uchun mo\'ljallangan kommunal texnika. Mashina 2200 W quvvatli elektr dvigatel va 48 V akkumulyator tizimida ishlaydi, shu sababli zararli chiqindi gaz chiqarmaydi va shovqin darajasi past. Supurish cho\'tkasining kengligi 1550 mm dan 2500 mm gacha sozlanadi, harakat tezligi esa 9 km/soatgacha yetadi, bu katta maydonlarni qisqa vaqtda tozalash imkonini beradi. Operator kabinasi uzoq davom etadigan smenalarda ishlashni qulay va xavfsiz qiladi. Mashinaning og\'irligi 1550 kg; asfalt, beton, trotuar plitkasi va shunga o\'xshash qattiq qoplamalar uchun mo\'ljallangan.',
    specs: [
      { label: 'Model', value: 'MK 1' },
      { label: 'Brend', value: 'SP' },
      { label: 'Turi', value: 'Supuruvchi tozalash mashinasi' },
      { label: 'Quvvat', value: '2200 Vt' },
      { label: 'Kuchlanish', value: '48 V' },
      { label: 'Ishchi tok kuchi', value: '150–203 A' },
      { label: 'Tozalash kengligi', value: '1550–2500 mm' },
      { label: 'Harakat tezligi', value: '9 km/soat gacha' },
      { label: 'Quvvat manbai turi', value: 'Akkumulyatorli' },
      { label: 'Ish o\'rni', value: 'Operator kabinasi' },
      { label: 'Qadoq o\'lchami', value: '3630 × 2500 × 2600 mm' },
      { label: 'Og\'irligi', value: '1550 kg' },
      { label: 'Qo\'llanilish sohasi', value: 'Ko\'chalar, yo\'llar, avtoturargohlar, omborlar, sanoat hududlari, jamoat joylari' },
      { label: 'Qoplama turi', value: 'Asfalt, beton, yo\'lka plitalari va boshqa qattiq qoplamalar' }
    ],
    images: [
      '/images/products/mk-1/1.webp',
      '/images/products/mk-1/2.webp',
      '/images/products/mk-1/3.webp',
      '/images/products/mk-1/4.webp',
      '/images/products/mk-1/5.webp',
      '/images/products/mk-1/6.webp',
      '/images/products/mk-1/7.webp',
      '/images/products/mk-1/8.webp'
    ],
    videoUrl: 'https://www.youtube.com/embed/ScimFtYriR4?si=W7yTJVSX5FABfp4y'
  },
  {
    id: 'mm-mk-2-sweeper',
    name: 'MK-2 Ko\'cha supurish mashinasi',
    model: 'MK-2',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'sweepers',
    // 361 057 800 so'm = 28655.38095 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 28655.38095,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '72 V',
    power: '5.5 kVt',
    brushWidth: '2000 mm',
    tankCapacity: '358 L',
    productivity: '—',
    usageArea: ['Ko\'cha va yo\'llar', 'Sanoat hududlari', 'Logistika markazlari', 'Katta avtoturargohlar', 'Ochiq maydonchalar'],
    machineType: 'Ride-on',
    description: '72 V litiy akkumulyatorda ishlaydigan supurish mashinasi: 2000 mm supurish kengligi, 240 l chiqindi baki va bir zaryadda 6 soatdan ortiq uzluksiz ish.',
    longDescription: 'MK-2 katta maydonli hududlarni supurish uchun mo\'ljallangan o\'ziyurar mashina. Unda 72 V / 390 A.soat litiy akkumulyator, 72 V / 5,5 kW yurish dvigateli va 72 V / 400 A ga hisoblangan elektron boshqaruv tizimi o\'rnatilgan. Ish organi har biri 72 V / 100 W bo\'lgan to\'rtta cho\'tka motori va vakuum ventilyatoridan iborat, supurish kengligi 2000 mm. Mashinada 358 litrli suv baki va 240 litrli chiqindi baki mavjud, umumiy o\'lchamlari 3830 x 1240 x 2010 mm. Bir zaryad bilan 6 soatdan ortiq uzluksiz ishlaydi, aqlli 72 V / 45 A zaryadlagich bilan to\'liq zaryadlash 6 soat davom etadi, maksimal harakat tezligi 25 km/soat.',
    specs: [
      { label: 'Elektron boshqaruv', value: '72V/400A' },
      { label: 'Batareya', value: '72V/390A·soat (litiy)' },
      { label: 'Yuritma dvigateli', value: '72V/5.5 kVt' },
      { label: 'Cho\'tka dvigateli quvvati', value: '72V/100Vt × 4' },
      { label: 'Vakuum ventilyatori', value: '72V/4000Vt' },
      { label: 'Zaryadlash qurilmasi', value: 'Smart, 72/45A' },
      { label: 'Toza suv baki', value: '358 L' },
      { label: 'Chiqindi baki hajmi', value: '240 L' },
      { label: 'Gabarit o\'lchamlari', value: '3830 × 1240 × 2010 mm' },
      { label: 'Ish vaqti', value: '6 soat +' },
      { label: 'Harakat tezligi', value: '25 km/soat gacha' },
      { label: 'Tozalash kengligi', value: '2000 mm' },
      { label: 'Zaryadlash vaqti', value: '6 soat' }
    ],
    images: [
      '/images/products/mk-2/1.webp',
      '/images/products/mk-2/2.webp',
      '/images/products/mk-2/3.webp',
      '/images/products/mk-2/4.webp'
    ]
  },
  {
    id: 'mk-3-ride-on',
    name: 'MK-3 Pol yuvish mashinasi',
    model: 'MK-3',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'ride-on-machines',
    // 54 158 670 so'm = 4298.30714 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 4298.30714,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '24 V',
    power: '550 Vt',
    brushWidth: '560 mm',
    tankCapacity: '80 L',
    productivity: '3000 m²/soat',
    usageArea: ['Omborxonalar', 'Savdo markazlari', 'Ishlab chiqarish sexlari', 'Yopiq avtoturargohlar', 'Ko\'rgazma va sport zallari'],
    machineType: 'Walk-behind',
    description: 'Orqa o\'q yuritmali pol yuvish mashinasi: soatiga 3000 m² unumdorlik, 560 mm tozalash kengligi, 80 l toza va 85 l iflos suv baklari.',
    longDescription: 'MK-3 - 24 V akkumulyator tizimida ishlaydigan, orqa o\'q yuritmasiga ega pol yuvish mashinasi. Amaldagi ish unumdorligi soatiga 3000 m², tozalash kengligi 560 mm, rakel kengligi esa 900 mm. Mashinada 550 W cho\'tka dvigateli va 500 W suv so\'rish dvigateli o\'rnatilgan, toza suv baki 80 litr, iflos suv baki 85 litr. Ikkita 12 V / 100 A akkumulyator bilan taxminan 3-4 soat ishlaydi, to\'liq zaryadlash 6-8 soat davom etadi. Korpusning po\'lat qalinligi 4 mm, plastik qismlarining qalinligi 5 mm; ish paytidagi shovqin 60 dB dan oshmaydi, mashinaning og\'irligi 240 kg.',
    specs: [
      { label: 'Gabarit o\'lchamlari', value: '1370 × 810 × 1100 mm' },
      { label: 'Kuchlanish', value: '24 V' },
      { label: 'Ish unumdorligi', value: '3000 m²/soat' },
      { label: 'Cho\'tka dvigateli quvvati', value: '550 Vt' },
      { label: 'Toza suv baki', value: '80 L' },
      { label: 'Suv so\'rish dvigateli quvvati', value: '500 Vt' },
      { label: 'Iflos suv baki', value: '85 L' },
      { label: 'Zaryadlash vaqti', value: '6-8 soat' },
      { label: 'Shovqin darajasi', value: '≤60 dB' },
      { label: 'Ish vaqti', value: 'Taxminan 3-4 soat' },
      { label: 'Tozalash kengligi', value: '560 mm' },
      { label: 'Og\'irligi', value: '240 kg' },
      { label: 'Rakel kengligi', value: '900 mm' },
      { label: 'G\'ildirak stupitsasi', value: 'Alyuminiy' },
      { label: 'Batareya', value: '2×12V100A' },
      { label: 'Shinalar', value: 'Neylon' },
      { label: 'Yuritma tizimi', value: 'Orqa o\'q yuritmasi' },
      { label: 'Korpus', value: 'Po\'lat qalinligi 4 mm / plastik molding qalinligi 5 mm' }
    ],
    images: [
      '/images/products/mk-3/1.webp',
      '/images/products/mk-3/2.webp',
      '/images/products/mk-3/3.webp',
      '/images/products/mk-3/4.webp'
    ]
  },
  {
    id: 'mk-4-walk-behind',
    name: 'MK-4 Pol yuvish mashinasi',
    model: 'MK-4',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'floor-scrubbers',
    // 26 477 572 so'm = 2101.3946 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 2101.3946,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '24 V',
    power: '550 Vt',
    brushWidth: '520 mm',
    tankCapacity: '70 L',
    productivity: '2500 m²/soat',
    usageArea: ['Ofis va ma\'muriy binolar', 'Savdo markazlari', 'Omborxonalar', 'Ta\'lim muassasalari', 'Ishlab chiqarish xonalari'],
    machineType: 'Walk-behind',
    description: '24 V akkumulyatorli pol yuvish mashinasi: soatiga 2500 m², 520 mm tozalash kengligi, 70 l toza va 80 l iflos suv baki, 3,5-5 soat ish vaqti.',
    longDescription: 'MK-4 - 24 V akkumulyator tizimida ishlaydigan pol yuvish mashinasi bo\'lib, soatiga 2500 m² maydonni tozalaydi. 19 dyuymli bitta cho\'tka 550 W dvigatel bilan aylanadi, 600 W so\'rish dvigateli va 830 mm kenglikdagi rakel esa suvni yig\'ib oladi; tozalash kengligi 520 mm. Toza suv baki 70 litr, iflos suv baki 80 litr, 24 V / 103 A Tianneng akkumulyatori bilan 3,5-5 soat uzluksiz ishlaydi. Cho\'tkalar neylon va po\'lat simning aralash terilishidan tayyorlangan, cho\'tka ko\'targichi mexanik. Mashinada iflos suv bakining to\'lishi va kuchlanishning pasayishi haqida ogohlantirish tizimlari bor; shovqin darajasi 55 dB dan oshmaydi, og\'irligi 200 kg.',
    specs: [
      { label: 'Gabarit o\'lchamlari', value: '1200 × 830 × 1200 mm' },
      { label: 'Kuchlanish', value: '24 V' },
      { label: 'Ish unumdorligi', value: '2500 m²/soat' },
      { label: 'Cho\'tka dvigateli quvvati', value: '550 Vt' },
      { label: 'Toza suv baki', value: '70 L' },
      { label: 'Suv so\'rish dvigateli quvvati', value: '600 Vt' },
      { label: 'Iflos suv baki', value: '80 L' },
      { label: 'Ish vaqti', value: 'Taxminan 3.5-5 soat' },
      { label: 'Shovqin darajasi', value: '≤55 dB' },
      { label: 'Og\'irligi', value: '200 kg' },
      { label: 'Tozalash kengligi', value: '520 mm' },
      { label: 'Shinalar', value: 'Alyuminiy qotishmali polietilen shinalar' },
      { label: 'Rakel kengligi', value: '830 mm' },
      { label: 'Cho\'tka materiali', value: 'Neylon va po\'lat sim aralashmasi' },
      { label: 'Batareya', value: '24V103A (Tianneng)' },
      { label: 'Cho\'tka ko\'targichi', value: 'Mexanik' },
      { label: 'Iflos suv signalizatsiyasi', value: 'Bor' },
      { label: 'Past kuchlanish signalizatsiyasi', value: 'Bor' },
      { label: 'Cho\'tkalar soni', value: '1 × 19 dyuym' },
      { label: 'Korpus', value: 'Po\'lat qalinligi 4 mm / plastik molding qalinligi 5 mm' }
    ],
    images: [
      '/images/products/mk-4/1.webp',
      '/images/products/mk-4/2.webp'
    ]
  },
  {
    id: 'mk-5-vertical',
    name: 'MK-5 Ixcham pol yuvish mashinasi',
    model: 'MK-5',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'floor-scrubbers',
    // 18 052 890 so'm = 1432.76905 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 1432.76905,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '36 V',
    power: '200 Vt',
    brushWidth: '430 mm',
    tankCapacity: '4 L',
    productivity: '1000 m²/soat',
    usageArea: ['Ofislar', 'Do\'kon va savdo nuqtalari', 'Kafe va restoranlar', 'Tor yo\'lak va dahlizlar', 'Klinika va laboratoriyalar'],
    machineType: 'Compact',
    description: 'Ixcham, 17 kg og\'irlikdagi akkumulyatorli pol yuvish mashinasi: 430 mm tozalash kengligi, ikkita 210 mm disk va soatiga 1000 m² unumdorlik.',
    longDescription: 'MK-5 - 36 V / 8 A litiy akkumulyatorda ishlaydigan ixcham pol yuvish mashinasi. Ikkita 210 mm li disk cho\'tka 200 W dvigatel bilan aylanadi va 430 mm kenglikdagi yo\'lakni tozalaydi, so\'rish reykasining kengligi 450 mm. Ish unumdorligi soatiga 1000 m², bir zaryad bilan 1-2 soat ishlaydi. Toza suv baki 4 litr, iflos suv baki 6,5 litr, cho\'tka bosimi 10 kg. Mashinaning og\'irligi atigi 17 kg, o\'lchamlari 450 x 360 x 1200 mm, shuning uchun tor joylar va kichik maydonlarda ishlatishga qulay.',
    specs: [
      { label: 'Tozalash kengligi', value: '430 mm' },
      { label: 'Toza suv baki', value: '4 L' },
      { label: 'Cho\'tka diametri', value: '210 mm (2 ta)' },
      { label: 'Iflos suv baki', value: '6.5 L' },
      { label: 'Ish unumdorligi', value: '1000 m²/soat' },
      { label: 'Cho\'tka dvigateli quvvati', value: '200 Vt' },
      { label: 'Rakel kengligi', value: '450 mm' },
      { label: 'Batareya', value: '36V8A (litiy)' },
      { label: 'Ish vaqti', value: '1-2 soat' },
      { label: 'Gabarit o\'lchamlari', value: '450 × 360 × 1200 mm' },
      { label: 'Cho\'tka bosimi', value: '10 kg' },
      { label: 'Og\'irligi', value: '17 kg' }
    ],
    images: [
      '/images/products/mk-5/1.webp',
      '/images/products/mk-5/2.webp'
    ]
  },
  {
    id: 'mm-mk-6-scrubber',
    name: 'MK-6 O\'ziyurar pol yuvish mashinasi',
    model: 'MK-6',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'ride-on-machines',
    // 72 211 560 so'm = 5731.0762 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 5731.0762,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '24 V',
    power: '2 × 400 Vt',
    brushWidth: '770 mm',
    tankCapacity: '130 L',
    productivity: '6000 m²/soat',
    usageArea: ['Yirik omborxonalar', 'Ishlab chiqarish sexlari', 'Savdo markazlari', 'Logistika terminallari', 'Aeroport va vokzallar'],
    machineType: 'Walk-behind',
    description: 'Soatiga 6000 m² unumdorlikka ega o\'ziyurar pol yuvish mashinasi: 770 mm tozalash kengligi, 130 l toza va 135 l iflos suv baklari.',
    longDescription: 'MK-6 - katta maydonlarni tozalash uchun mo\'ljallangan, orqa o\'q yuritmasiga ega pol yuvish mashinasi. Har biri 400 W dvigatel bilan aylanadigan ikkita 15 dyuymli cho\'tka 770 mm kenglikdagi yo\'lakni tozalaydi, 1000 mm li rakel va 600 W so\'rish dvigateli suvni yig\'ib oladi. Ish unumdorligi soatiga 6000 m², 24 V / 157 A Tianneng akkumulyatori bilan 4-5 soat uzluksiz ishlaydi. Toza suv baki 130 litr, iflos suv baki 135 litr; cho\'tka va rakel ko\'targichlari elektr yuritmali. Qo\'shimcha ravishda 120 W quvvatli yuqori bosimli yuvish to\'pponchasi, iflos suv va past kuchlanish haqida ogohlantirish tizimlari mavjud, mashinaning og\'irligi 300 kg.',
    specs: [
      { label: 'Gabarit o\'lchamlari', value: '1450 × 1000 × 1300 mm' },
      { label: 'Cho\'tka dvigateli quvvati', value: '2 × 400 Vt' },
      { label: 'Ish unumdorligi', value: '6000 m²/soat' },
      { label: 'Suv so\'rish dvigateli quvvati', value: '600 Vt' },
      { label: 'Toza suv baki', value: '130 L' },
      { label: 'Ish vaqti', value: '4-5 soat' },
      { label: 'Iflos suv baki', value: '135 L' },
      { label: 'Og\'irligi', value: '300 kg' },
      { label: 'Tozalash kengligi', value: '770 mm' },
      { label: 'Shinalar', value: 'Alyuminiy qotishmali polietilen shinalar' },
      { label: 'Rakel kengligi', value: '1000 mm' },
      { label: 'Cho\'tka materiali', value: 'Neylon va po\'lat sim aralashmasi' },
      { label: 'Batareya', value: '24V157A (Tianneng)' },
      { label: 'Rakel ko\'targichi', value: 'Elektr' },
      { label: 'Cho\'tka ko\'targichi', value: 'Elektr' },
      { label: 'Past kuchlanish signalizatsiyasi', value: 'Bor' },
      { label: 'Iflos suv signalizatsiyasi', value: 'Bor' },
      { label: 'Cho\'tkalar soni', value: '2 × 15 dyuym' },
      { label: 'Yuritma tizimi', value: 'Orqa o\'q yuritmasi' },
      { label: 'Yuqori bosimli yuvish to\'pponchasi quvvati', value: '120 Vt' }
    ],
    images: [
      '/images/products/mk-6/1.webp',
      '/images/products/mk-6/2.webp'
    ]
  },
  {
    id: 'mk-7-compact',
    name: 'MK-7 Bir diskli pol yuvish mashinasi',
    model: 'MK-7',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'floor-scrubbers',
    // 18 052 890 so'm = 1432.76905 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 1432.76905,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '24 V',
    power: '300 Vt',
    brushWidth: '350 mm',
    tankCapacity: '15 L',
    productivity: '1350 m²/soat',
    usageArea: ['Ofis binolari', 'Do\'kon va savdo nuqtalari', 'Mehmonxonalar', 'Ta\'lim muassasalari', 'Kichik ishlab chiqarish xonalari'],
    machineType: 'Compact',
    description: '350 mm bir diskli pol yuvish mashinasi: soatiga 1350 m² unumdorlik, 15 l toza va 20 l iflos suv baki, bir zaryadda 2-3 soat ish.',
    longDescription: 'MK-7 - 350 mm diametrli bitta disk cho\'tka bilan ishlaydigan pol yuvish mashinasi. Cho\'tka 300 W dvigatel bilan aylanadi, cho\'tka bosimi 25 kg, tozalash kengligi 350 mm. 500 W so\'rish dvigateli 200 mbar vakuum hosil qiladi, so\'rish reykasining kengligi 450 mm. Toza suv baki 15 litr, iflos suv baki 20 litr, ish unumdorligi soatiga 1350 m². 24 V / 32 A akkumulyator bilan 2-3 soat ishlaydi; mashinaning o\'lchamlari 900 x 580 x 700 mm, og\'irligi 60 kg.',
    specs: [
      { label: 'Tozalash kengligi', value: '350 mm' },
      { label: 'Iflos suv baki', value: '20 L' },
      { label: 'Cho\'tka diametri', value: '350 mm (1 ta)' },
      { label: 'Cho\'tka dvigateli quvvati', value: '300 Vt' },
      { label: 'Ish unumdorligi', value: '1350 m²/soat' },
      { label: 'Vakuum so\'rish kuchi', value: '200 mbar' },
      { label: 'Rakel kengligi', value: '450 mm' },
      { label: 'Batareya', value: '24V32A (2 dona)' },
      { label: 'Ish vaqti', value: '2-3 soat' },
      { label: 'Gabarit o\'lchamlari', value: '900 × 580 × 700 mm' },
      { label: 'Cho\'tka bosimi', value: '25 kg' },
      { label: 'Og\'irligi', value: '60 kg' },
      { label: 'Toza suv baki', value: '15 L' },
      { label: 'Suv so\'rish dvigateli quvvati', value: '500 Vt' }
    ],
    images: [
      '/images/products/mk-7/1.webp',
      '/images/products/mk-7/2.webp'
    ]
  },
  {
    id: 'mm-mk-8-transporter',
    name: 'MK-8 Gusenitsali yuk ko\'targich-transport aravasi',
    model: 'MK-8',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'ride-on-machines',
    // 130 000 000 so'm = 10317.4603 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 10317.4603,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    isFeatured: true,
    voltage: '24 V',
    power: '1100 Vt',
    brushWidth: '—',
    tankCapacity: '—',
    productivity: '—',
    usageArea: ['Qurilish maydonchalari', 'Omborxonalar', 'Ishlab chiqarish korxonalari', 'Logistika majmualari', 'Montaj va servis ishlari'],
    machineType: 'Walk-behind',
    description: 'Gusenitsali o\'ziyurar yuk ko\'targich: 200 kg yuk ko\'taradi, 3,8 metr balandlikka chiqaradi va 30° gacha qiyalikda harakatlanadi.',
    longDescription: 'MK-8 - tor sharoitlarda, qurilish maydonchalarida, ishlab chiqarish korxonalari va omborlarda, shuningdek murakkab relyefli hududlarda yuklarni ko\'tarish va tashish uchun mo\'ljallangan o\'ziyurar texnika. Gusenitsali yurish qismi tuproq, zinapoya va notekis qoplamalarda ishonchli harakatlanish imkonini beradi. Mashina 1100 W quvvatli elektr dvigatel va 24 V akkumulyator tizimida ishlaydi, yuk gidravlik yurish motori yordamida silliq va aniq ko\'tariladi. Maksimal yuk ko\'tarish quvvati 200 kg, ko\'tarish balandligi 3,8 m, maksimal ko\'tarilish burchagi 30°. Bitta to\'liq zaryad 7-8 soat uzluksiz ishlashga yetadi; o\'lchamlari 1,22 x 0,8 x 1,75 m, og\'irligi 630 kg, zaryadlash 220 V tarmoqdan amalga oshiriladi.',
    specs: [
      { label: 'Model', value: 'MK8 Crawler Walking Lift Truck' },
      { label: 'Turi', value: 'Gusenitsali ko\'tarma-transport aravachasi' },
      { label: 'Quvvat', value: '1100 Vt' },
      { label: 'Yuk ko\'tarish qobiliyati', value: '200 kg' },
      { label: 'Zaryadlash kuchlanishi', value: '220 V' },
      { label: 'Kuchlanish', value: '24 V' },
      { label: 'Yuritma tizimi', value: 'Gidravlik yurish motori' },
      { label: 'Maksimal ko\'tarilish burchagi', value: '30°' },
      { label: 'Ko\'tarish balandligi', value: '3,8 m' },
      { label: 'Gabarit o\'lchamlari', value: '1,22 × 0,8 × 1,75 m' },
      { label: 'Ish vaqti', value: '7–8 soat' },
      { label: 'Og\'irligi', value: '630 kg' },
      { label: 'Qo\'llanilish sohasi', value: 'Omborlar, qurilish maydonlari, ishlab chiqarish korxonalari, logistika komplekslari' },
      { label: 'Kafolat', value: '1 yil' },
      { label: 'Servis xizmati', value: '2 yil' }
    ],
    images: [
      '/images/products/mk-8/1.webp',
      '/images/products/mk-8/2.webp',
      '/images/products/mk-8/3.webp',
      '/images/products/mk-8/4.webp',
      '/images/products/mk-8/5.webp',
      '/images/products/mk-8/6.webp',
      '/images/products/mk-8/7.webp'
    ],
    videoUrl: 'https://www.youtube.com/embed/7ZxNE1rQCxc?si=XICVTtaq7ToJCNW5'
  },
  {
    id: 'mm-mk-9-single-disc',
    name: 'MK-9 A-002 Bir diskli pol tozalash va sayqallash mashinasi',
    model: 'MK9 A-002',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'floor-scrubbers',
    // 10 323 000 so'm = 819.2857 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 819.2857,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    isFeatured: true,
    voltage: '110–220 V',
    power: '1100 Vt',
    brushWidth: '17 dyuym (≈43 sm)',
    tankCapacity: '—',
    productivity: '—',
    usageArea: ['Savdo markazlari', 'Mehmonxonalar', 'Ofis binolari', 'Tibbiyot muassasalari', 'Ta\'lim muassasalari'],
    machineType: 'Walk-behind',
    description: 'Bir diskli pol tozalash mashinasi: 43 sm ish kengligi, 1100 W dvigatel, 154 ayl/min aylanish tezligi va 12 metrli quvvat kabeli.',
    longDescription: 'MK-9 A-002 - qattiq pol qoplamalarini yuvish, chuqur tozalash va sayqallash uchun mo\'ljallangan professional bir diskli mashina. Unda 1100 W quvvatli elektr dvigatel o\'rnatilgan, 17 dyuymli (taxminan 43 sm) cho\'tka 154 ayl/min tezlikda aylanadi va qoplamaga shikast yetkazmasdan ishlov beradi. Mashina 110-220 V tarmoqdan 50-60 Hz chastotada ishlaydi, 12 metrli kabel esa rozetkani tez-tez almashtirmasdan keng radiusda ishlash imkonini beradi. Plitka, marmar, granit, beton, quyma pol va linoleum kabi qattiq qoplamalar uchun mos keladi. Mashinaning og\'irligi 48 kg, ergonomik dastasi va vaznning muvozanatli taqsimlanishi uzoq muddat ishlashda qulaylik beradi.',
    specs: [
      { label: 'Model', value: 'MK9 A-002' },
      { label: 'Brend', value: 'Magwell' },
      { label: 'Turi', value: 'Bir diskli pol yuvish mashinasi' },
      { label: 'Quvvat', value: '1100 Vt' },
      { label: 'Kuchlanish', value: '110–220 V' },
      { label: 'Chastota', value: '50–60 Hz' },
      { label: 'Cho\'tka diametri', value: '17 dyuym (≈43 sm)' },
      { label: 'Cho\'tka aylanish tezligi', value: '154 ayl/daq' },
      { label: 'Kabel uzunligi', value: '12 m' },
      { label: 'Dastak o\'lchami (qadoqda)', value: '375 × 126 × 1133 mm' },
      { label: 'Qadoq o\'lchami', value: '540 × 440 × 375 mm' },
      { label: 'Og\'irligi', value: '48 kg' },
      { label: 'Qo\'llanilish sohasi', value: 'Savdo markazlari, mehmonxonalar, ofislar, tibbiyot muassasalari, maktablar, omborlar, ishlab chiqarish binolari' },
      { label: 'Qoplama turi', value: 'Plitka, marmar, granit, beton, linoleum va boshqa qattiq qoplamalar' },
      { label: 'Kafolat', value: '1 yil' },
      { label: 'Servis xizmati', value: '2 yil' }
    ],
    images: [
      '/images/products/mk-9/1.webp',
      '/images/products/mk-9/2.webp',
      '/images/products/mk-9/3.webp',
      '/images/products/mk-9/4.webp',
      '/images/products/mk-9/5.webp',
      '/images/products/mk-9/6.webp',
      '/images/products/mk-9/7.webp'
    ],
    videoUrl: 'https://www.youtube.com/embed/7Mr-KYX8rkw?si=wWB0o-VIu8ehaz-7'
  },
  {
    id: 'mm-mk-10-leaf-vacuum',
    name: 'MK-10 Barg yig\'uvchi bog\' changyutgichi',
    model: 'MK10 JEF-XL00201',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'industrial-vacuums',
    // 39 000 000 so'm = 3095.2381 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 3095.2381,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    isFeatured: true,
    voltage: '—',
    power: '6,5 ot kuchi',
    brushWidth: '800 mm',
    tankCapacity: '—',
    productivity: '—',
    usageArea: ['Parklar va xiyobonlar', 'Ko\'cha va yo\'llar', 'Maysazorlar', 'Sport maydonchalari', 'Turar joy hovlilari'],
    machineType: 'Walk-behind',
    description: 'O\'ziyurar bog\' changyutgichi: 196 sm³ benzinli dvigatel, 800 mm qamrov kengligi, 260 litrli chiqindi qopi va 3 metrli so\'rish shlangi.',
    longDescription: 'MK-10 park, xiyobon, hovli, sport maydonchalari va bog\'larda barg, o\'rilgan o\'t hamda mayda o\'simlik chiqindilarini yig\'ish uchun mo\'ljallangan o\'ziyurar mashina. Unda Locin ishlab chiqargan 196 sm³ hajmli, 6,5 ot kuchiga ega to\'rt taktli OHV benzin dvigateli o\'rnatilgan, u qo\'l starteri bilan ishga tushiriladi. O\'ziyurar konstruksiya va rul boshqaruvi operatorning jismoniy yukini sezilarli kamaytiradi. Uzunligi 3 metr, diametri 127 mm bo\'lgan so\'rish shlangi qiyin joylarni tozalash imkonini beradi, 260 litrli qop esa tez-tez to\'xtamasdan ishlashga yetadi. Qamrov kengligi 800 mm, mashinaning og\'irligi 85 kg.',
    specs: [
      { label: 'Model', value: 'MK10 JEF-XL00201' },
      { label: 'Turi', value: 'O\'ziyurar bog\' changyutgichi' },
      { label: 'Dvigatel', value: 'Locin 196 sm³, 4 taktli OHV' },
      { label: 'Quvvat', value: '6,5 ot kuchi' },
      { label: 'Ishga tushirish', value: 'Qo\'lda ishga tushirish (Recoil starter)' },
      { label: 'Harakatlanish', value: 'O\'ziyurar, rul bilan boshqariladi' },
      { label: 'So\'rish shlangi', value: 'Uzunligi 3 m, diametri 127 mm' },
      { label: 'Chiqindi xaltasi hajmi', value: '260 L' },
      { label: 'Tozalash kengligi', value: '800 mm' },
      { label: 'Og\'irligi', value: '85 kg' },
      { label: 'Qo\'llanilish sohasi', value: 'Bog\'lar, yo\'llar, maysazorlar, sport maydonchalari, hovlilar' },
      { label: 'Yig\'iladigan chiqindi turi', value: 'Barglar, o\'rilgan o\'t, mayda o\'simlik chiqindilari' },
      { label: 'Kafolat', value: '1 yil' },
      { label: 'Servis xizmati', value: '2 yil' }
    ],
    images: [
      '/images/products/mk-10/1.webp',
      '/images/products/mk-10/2.webp',
      '/images/products/mk-10/3.webp',
      '/images/products/mk-10/4.webp',
      '/images/products/mk-10/5.webp',
      '/images/products/mk-10/6.webp',
      '/images/products/mk-10/7.webp'
    ],
    videoUrl: 'https://www.youtube.com/embed/sBA0xl09yBs?si=ybK4YvTluVHI1h1-'
  },
  {
    id: 'mm-mk-1-universal-sweeper',
    name: 'MK-1 Universal ko\'cha supurish mashinasi',
    model: 'MK-1',
    brand: 'Mervan Makina',
    brandId: 'mervan-makina',
    category: 'sweepers',
    // 192 564 160 so'm = 15282.86984 USD x 12600 (EXCHANGE_RATES.UZS)
    priceUSD: 15282.86984,
    rating: 0,
    reviewsCount: 0,
    inStock: true,
    stockCount: 1,
    voltage: '—',
    power: '2,2 kVt',
    brushWidth: '—',
    tankCapacity: '200 L',
    productivity: '20 000 m²/soat',
    usageArea: ['Ko\'cha va yo\'laklar', 'Turar joy hovlilari', 'Bog\' va xiyobonlar', 'Korxona hududlari', 'Avtoturargohlar'],
    machineType: 'Ride-on',
    description: 'Elektr yuritmali universal supurish mashinasi: soatiga 20 000 m², 200 l suv va 240 l chiqindi baki, yuqori bosimli yuvish apparati bilan to\'liq komplekt.',
    longDescription: 'MK-1 universal supurish mashinasi 2,2 kW quvvatli elektr dvigatel va avtomatik uzatmalar qutisi bilan jihozlangan. Bir soat davomida 20 000 m² maydonni supuradi, bitta zaryad zapasi esa 6-8 soatga yetadi. Mashinada 200 litrli suv baki va 240 litrli olinadigan chiqindi baki mavjud. To\'liq komplektga 10 metrli shlangga ega yuqori bosimli yuvish apparati, ko\'cha supurish uchun to\'rtta cho\'tka, changyutgich, daraxt va o\'simliklarni suv yoki eritma bilan purkash moslamasi hamda changni bosish uchun suv forsunkalari kiradi. Shu tarkib tufayli bitta mashina bilan supurish, yuvish va purkash ishlarini bajarish mumkin.',
    specs: [
      { label: 'Dvigatel turi', value: 'Elektr' },
      { label: 'Quvvat', value: '2,2 kVt' },
      { label: 'Ish unumdorligi', value: '20 000 m²/soat' },
      { label: 'Ish vaqti', value: '6-8 soat' },
      { label: 'Uzatmalar qutisi', value: 'Avtomatik' },
      { label: 'Toza suv baki', value: '200 L' },
      { label: 'Chiqindi baki hajmi', value: '240 L' },
      { label: 'Komplektatsiya', value: 'Karcher (yuqori bosimli apparat) 10 m shlang bilan, ko\'cha supurish uchun 4 ta cho\'tka, changyutgich, daraxt va o\'simliklar uchun suv/dori purkagich, olinadigan chiqindi baki, changga qarshi suv forsunkalari' }
    ],
    images: [
      '/images/products/mk-1-legacy/1.webp',
      '/images/products/mk-1-legacy/2.webp',
      '/images/products/mk-1-legacy/3.webp',
      '/images/products/mk-1-legacy/4.webp'
    ]
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'installation',
    title: 'Uskunalarni Joyida O\'rnatish va Xodimlarni O\'qitish',
    icon: 'CheckCircle2',
    summary: 'To\'g\'ridan-to\'g\'ri yetkazib berish, ishga tushirish, elektr ko\'rigi va korxona xodimlari uchun amaliy o\'quv mashg\'uloti.',
    fullDetails: 'Bizning sertifikatlangan mutaxassislarimiz uskunalarni yig\'ib beradi, suv va elektr ulanishini tekshiradi hamda xodimlarga xavfsizlik va foydalanish bo\'yicha o\'quv sertifikati beradi.',
    benefits: ['Uzluksiz ishga tushirish', 'Sertifikatlangan operator nishonlari', 'Akkumulyatorni asrash qo\'llanmasi'],
    responseHours: '24 soat ichida'
  },
  {
    id: 'maintenance',
    title: 'Yillik Servis va Texnik Xizmat Ko\'rsatish (YTXK)',
    icon: 'ShieldCheck',
    summary: 'Har chorakda rejali profilaktika ko\'rigi, filtrlarni almashtirish va ehtiyot qismlarni ustuvor yetkazish.',
    fullDetails: 'Barcha obyektlaringizdagi uskunalar 99.8% shay holatda bo\'lishini ta\'minlaymiz. Favqulodda holatlar uchun zaxira uskunasi ham taqdim etiladi.',
    benefits: ['Bepul almashtiriladigan filtrlar', '4 soat ichida usta yetib borishi', '3 yillik uzaytirilgan kafolat'],
    responseHours: '2 - 4 soat ichida'
  },
  {
    id: 'repair',
    title: 'Ko\'chma Servis va Tezkor Ta\'mirlash',
    icon: 'Wrench',
    summary: 'Sizning omboringiz yoki zavodingizga bevosita yetib boruvchi mobil servis mashinalari.',
    fullDetails: 'Original tashxis uskunalari, almashtirish rezinalari va motorlar bilan jihozlangan 8 ta maxsus servis avtomobili.',
    benefits: ['Joyida diagnostika xulosasi', 'Original zavod ehtiyot qismlari', 'Katta ta\'mir paytida vaqtinchalik uskuna'],
    responseHours: 'Shu kunning o\'zida'
  },
  {
    id: 'rental',
    title: 'Sanoat Texnikasini Ijara va Lizingga Berish',
    icon: 'Truck',
    summary: '1 kundan 36 oygacha bo\'lgan muddatga pol yuvish va supurish mashinalarini ijaraga olish.',
    fullDetails: 'Boshlang\'ich katta xarajatlarsiz moslashuvchan lizing imkoniyatlari. Rejali texnik xizmat va sug\'urta narx ichida.',
    benefits: ['Soliqdan chegiriladigan xarajat', 'Har yili yangi modelga almashtirish', 'To\'liq servis xizmati kiritilgan'],
    responseHours: 'Tezkor hisob-kitob'
  },
  {
    id: 'consultation',
    title: 'Obyekt Auditi va Tozalash ROI Konsultatsiyasi',
    icon: 'BarChart3',
    summary: 'Maydon, pol turi va sarf-xarajatlarni hisoblab, texnika tanlash bo\'yicha bepul muhandislik auditi.',
    fullDetails: 'Muhandislarimiz pol qoplamasini o\'rganadi, kimyoviy chidamliligini va qo\'l mehnati o\'rniga uskunaning iqtisodiy samaradorligini (ROI) hisoblaydi.',
    benefits: ['Shaxsiy ROI hisobot paketi', 'Pol qoplamasi moslik testi', 'Byudjetni optimallashtirish rejasi'],
    responseHours: 'Onlayn band qilish'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'O\'tirib Haydaladigan va Qo\'lda Boshqariladigan Pol Yuvish Mashinasini Qanday Tanlash Kerak?',
    slug: 'choose-ride-on-vs-walk-behind-floor-scrubber',
    summary: 'Maydon (m²), yo\'lak kengligi va ishchi kuchi xarajatlarini inobatga olgan holda to\'g\'ri texnikani tanlash bo\'yicha qo\'llanma.',
    content: `Tijorat obyekti yoki sanoat korxonasini boshqarishda pol yuvish texnikasini to\'g\'ri tanlash tozalik darajasi va oylik ishchi kuchi xarajatlariga bevosita ta'sir qiladi.

### Asosiy qoidalar:
1. **2,000 m² gacha bo'lgan obyektlar**: MK-4 yoki MK-7 kabi piyoda boshqariladigan mashinalar tor eshiklar, kabinetlar va ixcham ombor yo'laklarida juda qulay.
2. **3,500 m² dan katta obyektlar**: MK-3 yoki MK-6 kabi kattaroq mashinalar bir smenada ancha katta maydonni qamrab oladi.

### Iqtisodiy hisob-kitob (ROI)
Qo'lda boshqariladigan mashina soatiga taxminan 2,200 m² tozalaydi. O'tirib haydaladigan mashina esa soatiga 5,800 m² maydonni tozalash imkonini beradi. 10,000 m² li logistika markazida u 7 oy ichida o'z xarajatini to'liq qoplaydi.`,
    category: 'Sanoat Tozalash',
    author: 'Inzh. Timur Alimov',
    authorRole: 'Sanoat Muhandisligi Boshlig\'i',
    date: '2026-07-10',
    readTime: '5 daqiqa o\'qish',
    image: '/images/scrubber-hero.jpg',
    tags: ['Pol yuvish', 'ROI', 'Ombor boshqaruvi']
  },
  {
    id: 'b2',
    title: 'Sanoat Pol Yuvish Mashinalarida Litiy-Iyon (LiFePO4) Akkumulyatorlarining Afzalliklari',
    slug: 'lithium-ion-vs-agm-batteries-scrubber-driers',
    summary: 'Nima uchun zamonaviy logistika markazlari 3 barobar uzoq xizmat qiluvchi litiy texnologiyasiga o\'tmoqda?',
    content: `Ilgari sanoat texnikalarida og'ir kislotali yoki AGM akkumulyatorlar ishlatilardi. Bugungi kunda litiy-iyon (LiFePO4) batareyalari sohada inqilob qildi.

### Litiy Akkumulyatorlarning Afzalliklari:
- **Tezkor quvvatlash**: Tushlik vaqtidagi 30 daqiqalik quvvatlash ham batareyaga zarar yetkazmaydi.
- **3 barobar uzoq umr**: Kislotali batareyalar 800 sikl xizmat qilsa, litiy batareyalar 3,500+ siklga chidaydi.
- **Doimiy yuqori quvvat**: Batareya quvvati 1% qolgunga qadar so'rish va yuvish quvvati pasaymaydi.
- **Servissiz foydalanish**: Suv quyish yoki kislota to'kilishi xavfi yo'q.`,
    category: 'Texnik Qo\'llanma',
    author: 'Shohrux Karimov',
    authorRole: 'Akkumulyator Tizimlari Mutaxassisi',
    date: '2026-06-28',
    readTime: '4 daqiqa o\'qish',
    image: '/images/scrubber-hero.jpg',
    tags: ['Litiy Batareya', 'Texnik Servis', 'Texnologiya']
  },
  {
    id: 'b3',
    title: 'Pol Yuvish Rezinasi (Squeegee) Xizmat Muddatini 200% Ga Uzaytirish Borasida 5 Maslahat',
    slug: '5-essential-maintenance-tips-squeegee-life',
    summary: 'Polni quruq holda qoldirish va motorni asrash uchun kundalik texnik parvarish qoidalari.',
    content: `Yuvishdan so'ng polning 100% quruq qolishi suv so'rish rezinasi (squeegee) va vakuum motoriga bog'liq.

1. **Kir Suv Bakini Har Kuni Yving**: Qum va loy shlang va rezinalarni tez yemirishi oldi olinadi.
2. **Rezina Tomonlarini Burib Turing**: Har 2 haftada rezinani burib o'rnating, uning 4 ta chetidan unumli foydalaning.
3. **Burchak va Egilishni Sozlang**: Rezina yerga yassilashib ketmasdan, yengil egilib tortishi kerak.
4. **Moyga Chidamli Linatex Ishlating**: Moyli pollar uchun qizil Linatex rezinamizdan foydalaning.`,
    category: 'Foydali Maslahatlar',
    author: 'Dilshod Niyozov',
    authorRole: 'Bosh Servis Ustasi',
    date: '2026-06-15',
    readTime: '3 daqiqa o\'qish',
    image: '/images/products/mk-1/1.webp',
    tags: ['Ehtiyot qismlar', 'Profilaktika', 'Maslahatlar']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Texnikalarga qancha muddatli kafolat beriladi?',
    answer: 'Kafolat muddati modelga qarab farq qiladi. Aniq shartlarni mahsulot sahifasidagi xarakteristikalar bo\'limidan ko\'rishingiz yoki telefon orqali aniqlashtirishingiz mumkin.',
    category: 'Kafolat'
  },
  {
    id: 'faq-2',
    question: 'Ehtiyot qismlar va rezinalar qancha vaqtda yetkazib beriladi?',
    answer: 'Ehtiyot qismlar, rezinalar, cho\'tkalar va batareyalar bo\'yicha mavjudlik va yetkazib berish muddatini telefon orqali aniqlashtiring.',
    category: 'Yetkazib berish'
  },
  {
    id: 'faq-3',
    question: 'Xarid qilishdan oldin texnikani o\'z korxonamizda sinab ko\'rish (demo-test) mumkinmi?',
    answer: 'Albatta! Korxonalar, zavodlar va savdo markazlari uchun bepul bevosita joyida demo-test ko\'rsatuvini tashkillashtiramiz. Mobil servis avtomobilimiz texnikani obyektizga olib boradi va xodimlaringiz uni polingizda sinab ko\'rishadi.',
    category: 'Uskunalar'
  },
  {
    id: 'faq-4',
    question: 'Yillik Texnik Xizmat Ko\'rsatish (YTXK) shartnomasiga nimalar kiradi?',
    answer: 'YTXK shartnomasi yiliga 4 marotaba to\'liq profilaktika ko\'rigi, filtrlarni bepul almashtirish, favqulodda chaqiruvga 4 soatda yetib borish va ta\'mirlash 24 soatdan oshganda vaqtinchalik zaxira texnikasini berishni o\'z ichiga oladi.',
    category: 'Servis va Ijara'
  },
  {
    id: 'faq-5',
    question: 'Korxonalar uchun lizing yoki bo\'lib to\'lash imkoniyati bormi?',
    answer: 'Ha, yuridik shaxslar uchun 12 oydan 36 oygacha bo\'lgan B2B lizing va QQS bilan rasmiy pul o\'tkazish (perechislenie) orqali xarid qilish imkoniyati mavjud.',
    category: 'Lizing va To\'lov'
  }
];
