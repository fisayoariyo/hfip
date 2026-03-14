# HFIP — Hashmar Farmer Identity Platform

## Quick Start (copy-paste this exactly)

```bash
cd hfip
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## What's inside

```
hfip/
├── app/
│   ├── layout.tsx          ← Root layout + providers
│   ├── page.tsx            ← Landing / home page
│   ├── globals.css         ← Design system tokens (edit colours here)
│   ├── onboarding/
│   │   └── page.tsx        ← 4-step registration wizard
│   ├── dashboard/
│   │   └── page.tsx        ← Farmer's personal dashboard
│   └── admin/
│       └── page.tsx        ← Admin management dashboard
│
├── components/
│   ├── ui/                 ← shadcn/ui primitives (don't edit these)
│   ├── shared/             ← Navbar, FormField, StatusBadge
│   ├── onboarding/         ← Step1–Step4 wizard components
│   ├── dashboard/          ← DigitalIDCard, FarmMapPreview, ProductivitySummary
│   └── admin/              ← FarmerTable with search/filter/export
│
├── context/
│   └── AppContext.tsx      ← Global state (role, farmers, dark mode)
│
├── lib/
│   ├── storage.ts          ← localStorage helpers (swap for API calls later)
│   ├── fakeData.ts         ← Demo seed data + lookup lists
│   ├── generateId.ts       ← HFIP-2026-XXXX ID generator
│   └── utils.ts            ← cn(), formatDate(), formatCurrency()
│
└── types/
    └── index.ts            ← All TypeScript interfaces
```

## Demo walkthrough

1. **Landing page** — Click "Start Registration" to begin onboarding
2. **Onboarding wizard** — Fill in all 4 steps (or click through with defaults)
3. **Farmer Dashboard** — View your digital ID card, farm map, and productivity stats
4. **Admin toggle** — Click "Admin" in the top nav to switch to the admin view
5. **Admin Dashboard** — Search, filter, verify/reject farmers, export CSV

## Connecting to NestJS (Phase 2)

Every `lib/storage.ts` function maps to a future API call:

| Current (localStorage)   | Replace with              |
|--------------------------|---------------------------|
| `createFarmer()`         | `POST /api/farmers`       |
| `updateFarmer(f)`        | `PUT  /api/farmers/:id`   |
| `getFarmers()`           | `GET  /api/farmers`       |
| `verifyFarmer(id)`       | `PATCH /api/farmers/:id/verify` |

## Adding a real map (Phase 2)

In `components/onboarding/Step3Farm.tsx` and `components/dashboard/FarmMapPreview.tsx`,
find the `<!-- Map placeholder -->` div and replace with a Mapbox GL or Google Maps component.

## Changing the accent colour

Open `app/globals.css` and change `--primary: 158 64% 37%` to any HSL value.
Example: blue = `217 91% 50%`, orange = `25 95% 53%`
