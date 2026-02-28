# 👗 BanglaDress AI

> বাংলাদেশি থ্রি পিস ড্রেসের জন্য AI-চালিত ইকমার্স প্লাটফর্ম

AI-powered Bangladeshi three-piece dress e-commerce platform with virtual try-on, designer dashboard, and SSLCommerz payment integration.

## ✨ Features

- 👗 **Design Showcase** — 100+ Bangladeshi dress designs with category filter
- 🤖 **AI Dress Generator** — Generate custom dress designs via Replicate (SDXL)
- 📸 **AI Virtual Try-On** — Try dresses on your own photo
- 👤 **Designer Dashboard** — Upload designs, track sales & orders
- ✅ **Admin Panel** — Approve/reject pending designs
- 💳 **SSLCommerz Payment** — Full payment loop with bKash/card support
- 📍 **Measurements System** — Detailed size hints per design
- 📦 **Order Tracking** — Customer order history with status

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Replicate API (SDXL for generation, try-on)
- **Payment**: SSLCommerz
- **Language**: TypeScript

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/wordtoimageai/bangla-dress-ai.git
cd bangla-dress-ai

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Fill in your Supabase, Replicate, SSLCommerz keys

# 4. Setup database
# Run supabase/schema.sql in Supabase SQL editor
# Run supabase/seed.sql to add 10 sample designs

# 5. Start development server
npm run dev
```

## 📁 Folder Structure

```
bangla-dress-ai/
├── app/
│   ├── page.tsx                    # Home page
│   ├── showcase/page.tsx           # Design gallery
│   ├── generator/page.tsx          # AI dress generator
│   ├── product/[id]/page.tsx       # Product detail + try-on
│   ├── checkout/page.tsx           # Checkout + payment
│   ├── orders/page.tsx             # Order history
│   ├── admin/page.tsx              # Admin approval panel
│   ├── designer/
│   │   ├── dashboard/page.tsx        # Designer dashboard
│   │   └── upload/page.tsx           # Upload new design
│   └── api/
│       ├── ai/generate/route.ts      # AI image generation
│       ├── ai/tryon/route.ts         # AI virtual try-on
│       ├── designer/upload/route.ts  # Design upload API
│       ├── admin/approve/route.ts    # Admin approve API
│       ├── designs/[id]/route.ts     # Design detail API
│       └── payments/                 # SSLCommerz callbacks
├── components/
│   ├── design-card.tsx             # Design grid card
│   └── tryon-viewer.tsx            # AI try-on component
├── lib/
│   ├── supabase-client.ts          # Supabase browser client
│   ├── supabase-server.ts          # Supabase server client
│   ├── sslcommerz.ts               # Payment integration
│   └── validation.ts               # Zod schemas
├── supabase/
│   ├── schema.sql                  # Database schema
│   └── seed.sql                    # 10 sample designs
├── .env.example                    # Environment variables template
└── package.json
```

## 🔑 Environment Variables

See `.env.example` for all required variables:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `REPLICATE_API_KEY` (for AI generation & try-on)
- `SSLCOMMERZ_STORE_ID` & `SSLCOMMERZ_STORE_PASS`

## 💰 Monetization (Freemium)

| Plan | Price | Features |
|------|-------|----------|
| Free | ৳0 | Browse designs, 3 AI generations/month |
| Designer | ৳500/month | Unlimited uploads, dashboard |
| Premium | ৳299/month | Unlimited AI generation + try-on |

## 📞 Contact

Built with ❤️ for Bangladesh by [wordtoimageai](https://github.com/wordtoimageai)
