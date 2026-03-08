# Andrew Scott — Portfolio

Modern, minimal portfolio: React (Vite), TypeScript, Tailwind CSS, Framer Motion. Dark mode, mobile-first, SEO/OG ready.

## Run

```bash
npm install
npm run dev
```

Build: `npm run build`. Preview production: `npm run preview`.

## Deploy on Vercel

1. **Push the project to GitHub** (if you haven’t already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Vercel:** Go to [vercel.com](https://vercel.com) → Sign in (e.g. with GitHub) → **Add New Project** → **Import** your repo. Vercel will detect Vite and set Build Command and Output Directory automatically.

3. **Deploy:** Click **Deploy**. Your site will get a URL like `your-project.vercel.app`. Optional: add a custom domain in Project Settings → Domains.

**Or deploy from the terminal:** Install the Vercel CLI (`npm i -g vercel`), run `vercel` in the project folder, and follow the prompts.

## Add later

- **Resume**: Put your PDF at `public/resume.pdf`. The Hero “Resume” button points to `/resume.pdf`.
- **OG image**: Add `public/og-image.png` (1200×630) for LinkedIn/social sharing. Meta tags already reference `/og-image.png`.
- **Case studies**: Edit `src/pages/CaseStudy.tsx` to render full content per `slug`, or add a new route and component under `src/pages/` and register it in `App.tsx`. Project data lives in `src/data/projects.ts`.
- **Writing**: Add posts by extending `src/components/Writing.tsx` or adding a `/writing` route and listing entries from data or markdown.

## Stack

- Vite 7, React 19, TypeScript
- Tailwind CSS v4 (@tailwindcss/vite)
- Framer Motion (scroll-triggered animations)
- React Router (home + `/work/:slug` case study stub)
