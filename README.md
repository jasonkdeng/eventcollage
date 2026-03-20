# Mosaic

Mosaic is a warm, scrapbook-style personal connection tracker. Every owner gets one living wall and can add new people through a guest QR flow.

## Stack

- React + Vite + Tailwind CSS
- Supabase (Database, Realtime, Storage)
- qrcode.react, canvas-confetti, react-icons, date-fns, html2canvas

## Project Structure

```txt
src/
	pages/
		Home.jsx
		MosaicPage.jsx
	components/
		OwnerView.jsx
		GuestView.jsx
		PolaroidCard.jsx
		QRCard.jsx
		SocialIcons.jsx
	lib/
		supabase.js
		socials.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add env vars in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In Supabase SQL Editor, run:

- `supabase/schema.sql`

4. Start dev server:

```bash
npm run dev
```

## Routing

- Owner mode: `/mosaic/:id`
- Guest mode: `/mosaic/:id?mode=guest`

## Notes on RLS

- Anyone can insert into `connections` and upload to `selfies`.
- Deleting a connection is restricted to the owner token hash stored on mosaic creation.
- The app stores the raw owner token only in browser local storage and sends it in `x-owner-token` for delete requests.
