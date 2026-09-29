# RVR COLORIDO 2K26 — Digital Event Platform

> **National Cultural & Sports Fest — "Where Talent Meets Competition"**  
> Organized by **RVR & JC College of Engineering**, Guntur, Andhra Pradesh.

---

## 🌟 Overview

**RVR COLORIDO 2K26** is a modern, responsive, full-stack digital event management web application built for a premier national-level college festival. The platform powers end-to-end festival operations — from public event discovery, rulebook inspection, and online participant registrations to a secure role-protected admin back-office with real-time analytics, participant management, CSV exports, announcements, live results, gallery, and sponsorship tracking.

---

## ✨ Features

### 🏛️ Public-Facing Portal
- **High-Impact Landing Page**: Dynamic hero banner with countdown, animated stats counter, featured cultural & sports showcases, festival timeline preview, live bulletin ticker, and sponsor showcase.
- **Cultural Events Showcase**: Browse across categories including **Fine Arts, Music (Solo/Group), Dance (Solo/Group), Choreoday, Dramatics, Fashion Show, Tekraft, and Literary** competitions with instant category filtering.
- **Sports Events Hub**: Dedicated Boys & Girls filters for **Basketball, Volleyball, Table Tennis, Badminton, Throwball, and TenniKoit** championships.
- **Comprehensive Event Detail Pages**: Full rules breakdown, venue info, timing, team size limits, coordinator contacts, and one-click direct registration.
- **Online Participant Registration**: Interactive registration form with real-time validation, automatic generation of unique Registration IDs (`CLR26-XXXXX`), confirmation badges, and email verification indicators.
- **Festival Schedule**: Interactive day-wise and track-wise event schedule breakdown.
- **Official Announcements**: Categorized announcements with priority indicators (`Urgent`, `High`, `Medium`, `Low`).
- **Live Results Board**: Real-time position badges (1st, 2nd, 3rd), colleges, scores, and judge remarks.
- **Multimedia Gallery**: Responsive grid showcase of stage performances, sports moments, and festival highlights.
- **Sponsors & Partners**: Tiered showcase of Title, Gold, Silver, and Supporting sponsors.
- **Contact & Helpdesk**: Campus map location, official helpline numbers, email addresses, and an interactive query form.

### 🛡️ Secure Admin Dashboard
- **Protected Authentication**: Email & password authentication managed via Supabase Auth with server-side cookie sessions and route middleware protection.
- **Overview Analytics**: Real-time metrics on total registrations, approved participants, active events, and published announcements.
- **Event Manager**: Full CRUD interface to create, edit, remove events, and toggle registration status with a single switch.
- **Participant & Registration Manager**: Filter by event and status (`Pending`, `Confirmed`, `Cancelled`), view full participant dossier, change status in real-time, and **Export all registrations to CSV** with one click.
- **Announcement Dispatcher**: Publish urgent alerts and campus news with instant visibility toggle.
- **Results Publisher**: Post podium standings, winner details, and scores.
- **Gallery Uploader**: Upload photo memories directly into Supabase Storage buckets.
- **Sponsor Manager**: Maintain sponsor tiers, logos, and partner links.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens |
| **Database** | [Supabase (PostgreSQL)](https://supabase.com/) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) with `@supabase/ssr` cookies |
| **Cloud Storage** | [Supabase Storage](https://supabase.com/storage) for gallery media |
| **Icons** | [Lucide React](https://lucide.dev/) + Custom Social Icons |
| **Hosting** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
rvr-colorido-2k26/
├── public/                 # Static public assets
├── src/
│   ├── actions/            # Next.js Server Actions (events, registrations, etc.)
│   ├── app/                # App Router routes and pages
│   │   ├── about/          # About COLORIDO 2K26
│   │   ├── admin/          # Admin back-office
│   │   │   ├── announcements/ # Admin announcements CRUD
│   │   │   ├── dashboard/     # Live stats & metric cards
│   │   │   ├── events/        # Admin event manager
│   │   │   ├── gallery/       # Admin gallery upload & management
│   │   │   ├── login/         # Secure administrator login
│   │   │   ├── registrations/ # Registration table, filters, CSV export
│   │   │   ├── results/       # Admin results management
│   │   │   └── sponsors/      # Admin sponsors CRUD
│   │   ├── announcements/  # Public announcements feed
│   │   ├── contact/        # Contact info & contact form
│   │   ├── events/         # Event catalog
│   │   │   ├── cultural/   # Cultural events with subcategory filters
│   │   │   ├── sports/     # Sports events with gender filters
│   │   │   └── [slug]/     # Dynamic event detail pages
│   │   ├── gallery/        # Photo gallery
│   │   ├── registration/   # Public participant registration flow
│   │   ├── results/        # Official winners & results board
│   │   ├── schedule/       # Festival timeline & agenda
│   │   ├── sponsors/       # Partner & sponsor showcase
│   │   ├── globals.css     # Design system, theme variables & utilities
│   │   ├── layout.tsx      # Root layout (Navbar, Footer, SEO metadata)
│   │   ├── loading.tsx     # Route transition loader
│   │   ├── not-found.tsx   # Custom 404 page
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable UI components
│   │   ├── icons/          # Social media SVG components
│   │   ├── ui/             # Loading spinners, error & empty states
│   │   ├── event-card.tsx  # Dynamic event card
│   │   ├── footer.tsx      # Footer with links & disclaimer
│   │   ├── navbar.tsx      # Responsive navigation bar
│   │   └── page-header.tsx # Header banner for inner pages
│   ├── lib/
│   │   └── supabase/       # Browser and Server Supabase clients
│   ├── middleware.ts       # Auth token refresh & /admin route guard
│   └── types/              # Comprehensive TypeScript interfaces
├── supabase/
│   ├── schema.sql          # PostgreSQL schema, RLS policies & triggers
│   └── seed.sql            # Sample festival events, rules & announcements
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.18.0 or newer recommended)
- **npm**, **pnpm**, or **yarn**
- A free **[Supabase](https://supabase.com)** account

---

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/rvr-colorido-2k26.git
cd rvr-colorido-2k26
npm install
```

---

### 3. Setup Supabase Database

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard) and click **"New Project"**.
2. Give your project a name (e.g. `rvr-colorido-2k26`), set a secure database password, and choose your preferred region.
3. Once the database is ready:
   - Navigate to the **SQL Editor** in the left sidebar.
   - Click **"New query"**.
   - Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it into the editor.
   - Click **"Run"** to create all tables (`events`, `registrations`, `announcements`, `results`, `gallery`, `sponsors`, `profiles`) and Row-Level Security (RLS) policies.
4. **Seed Sample Festival Data**:
   - In the SQL Editor, create another new query.
   - Copy the entire contents of [`supabase/seed.sql`](supabase/seed.sql) and paste it.
   - Click **"Run"**. This populates the database with cultural events (Fine Arts, Music, Dance, Dramatics, Tekraft, Literary), sports championships (Basketball, Volleyball, Throwball, etc.), sample announcements, and sponsors.
5. **Setup Storage Bucket (For Gallery)**:
   - In the left sidebar, navigate to **Storage**.
   - Click **"New bucket"**.
   - Set the bucket name to exactly: `colorido`.
   - Toggle **"Public bucket"** to **ON**.
   - Click **Save**.

---

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of the project (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:

```env
# Find these in Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

> 💡 **Where to find these keys?**  
> In your Supabase dashboard, click the gear icon (Project Settings) at the bottom left, then click **API**. You will see the **Project URL** and the **`anon` `public` API Key**.

---

### 5. Create an Administrator Account

To log into the `/admin` dashboard:
1. In the Supabase Dashboard, go to **Authentication** > **Users**.
2. Click **"Add user"** > **"Create user"**.
3. Enter an email (e.g. `admin@rvrjc.ac.in`) and a secure password.
4. Toggle **"Auto Confirm User?"** to **ON** (or check your email to confirm).
5. Open the **SQL Editor** and grant this user the `admin` role in the `profiles` table:
   ```sql
   INSERT INTO profiles (id, full_name, role)
   VALUES ('<PASTE-USER-UID-FROM-USERS-TAB>', 'Festival Coordinator', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

- **Public Festival Portal**: `http://localhost:3000`
- **Cultural Events**: `http://localhost:3000/events/cultural`
- **Sports Events**: `http://localhost:3000/events/sports`
- **Participant Registration**: `http://localhost:3000/registration`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

---

### 7. Production Build Validation

To verify all TypeScript types and build optimizations:

```bash
npm run build
```

---

## 🔒 Security & Data Protection

- **Row Level Security (RLS)** is strictly enforced on all PostgreSQL tables.
- **Public Users** have read-only access to events, schedules, published announcements, published results, gallery, and sponsors.
- **Registration Submissions** are allowed anonymously via an open INSERT policy with server-side validation.
- **Admin Actions** (updating event rules, confirming registrations, publishing results, uploading gallery items) are locked to authenticated sessions with matching RLS policies.
- **Middleware Guard**: Automatically redirects unauthenticated requests attempting to enter `/admin/*` to `/admin/login`.

---

## 📋 Sample Data Disclaimer

All sample participant names, phone numbers, email addresses, and event dates contained in `seed.sql` and the codebase are realistic dummy demonstration data created for testing and showcasing the platform's features. They do not represent official announcements of RVR & JC College of Engineering.

---

## 📄 License

This project was built for educational and demonstration purposes for college cultural and sports event management.
