# Mervan Makina

Sanoat tozalash texnikasi sotuvchi kompaniyaning veb-sayti. Toshkent, Sergeli.

Pol yuvish mashinalari, koʻcha supurish texnikasi va sanoat changyutgichlari
katalogi — har biri toʻliq texnik xarakteristikasi va ochiq narxi bilan.

## Texnologiyalar

| | |
|---|---|
| Qurilma | Vite 6 |
| Interfeys | React 19 + TypeScript |
| Uslub | Tailwind CSS v4 |
| Ikonkalar | lucide-react |

Marshrutlash uchun alohida kutubxona ishlatilmaydi — sahifa holati
`AppContext` ichidagi `activePage` orqali boshqariladi. Katalog va buyurtmalar
brauzerning `localStorage` xotirasida saqlanadi; maʼlumotlar tuzilishi
oʻzgarganda `SEED_VERSION` qiymati koʻtariladi va eski nusxa yangilanadi.

## Ishga tushirish

Node.js 20 yoki undan yuqorisi kerak.

```bash
npm install
npm run dev      # http://localhost:3000
```

Boshqa buyruqlar:

```bash
npm run build    # dist/ ichiga yigʻish
npm run preview  # yigʻilgan holatni koʻrish
npm run lint     # tsc --noEmit
```

## Sozlash

`.env.example` faylidan nusxa olib `.env` yarating.

```
VITE_TELEGRAM_BOT_TOKEN=""
VITE_TELEGRAM_CHAT_ID=""
```

Bular boʻsh boʻlsa ham forma ishlaydi: xabar nusxalanadi va mijozning oʻzi
Telegramda yuboradi. Toʻldirilgan boʻlsa — xabar avtomatik yetkaziladi.

Eʼtibor bering: `VITE_` bilan boshlangan qiymatlar JS toʻplami ichiga tushadi
va saytni ochgan har kim ularni oʻqiy oladi. Bot tokeni faqat botning oʻzi
nomidan ish koʻrishga ruxsat bergani uchun asosiy xavf — begona odam sizning
chatingizga spam yuborishi. Bu jiddiy boʻlsa, tokenni oldiga kichik proksi
qoʻyish kerak.

## Tuzilishi

```
src/
  components/   qayta ishlatiladigan boʻlaklar
  pages/        sahifalar
  context/      AppContext — katalog, savat, sozlamalar
  data/         boshlangʻich katalog maʼlumotlari
  lib/          SEO va lead yetkazish yordamchilari
public/images/  mahsulot suratlari
tools/          faqat lokal tekshiruv skriptlari, saytga kirmaydi
```

`tools/` ichidagi skriptlar Playwright talab qiladi. U ataylab
`package.json` ga qoʻshilmagan — aks holda har deployda ~100 MB brauzer
yuklanardi. Kerak boʻlsa: `npm i -D playwright && npx playwright install chromium`.
