# Knowledge Sharing App

A full-stack web application built with Next.js 16, TypeScript, Tailwind CSS, NextAuth.js, and Supabase for sharing knowledge through articles, code snippets, and learning resources.

## Features

- 🔐 **User Authentication** - Secure sign-up and login with NextAuth.js
- 📝 **Articles** - Create and share in-depth articles
- 💻 **Code Snippets** - Share code with syntax highlighting
- 📚 **Learning Resources** - Curate and share learning materials
- 🔍 **Search & Filter** - Find resources easily with search and tag filtering
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ☁️ **Cloud Deployment** - Ready to deploy on Vercel

## Tech Stack

- **Framework:** Next.js 16 (App Router with Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js v4
- **Database:** Supabase (PostgreSQL)
- **Architecture:** Server Components (SSR) + Client Components (interactivity)
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd knowledge-sharing-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Go to the SQL Editor and run the schema from `supabase-schema.sql`

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
knowledge-sharing-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── articles/            # Article CRUD endpoints
│   │   ├── code-snippets/       # Code snippet endpoints
│   │   ├── learning-resources/  # Learning resource endpoints
│   │   └── auth/                # NextAuth configuration
│   ├── articles/                # Article pages
│   ├── code-snippets/           # Code snippet pages
│   ├── learning-resources/      # Learning resource pages
│   ├── auth/                    # Authentication pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable React components
│   ├── Header.tsx               # Navigation header
│   ├── ResourceCard.tsx         # Resource display card
│   ├── SearchBar.tsx            # Search input
│   ├── Filter.tsx               # Tag filter
│   ├── CodeHighlighter.tsx      # Syntax highlighting
│   ├── SessionProvider.tsx      # Auth session wrapper
│   ├── ArticlesClientWrapper.tsx       # Client wrapper for articles search
│   ├── ArticleDetailClient.tsx         # Client wrapper for article actions
│   ├── CodeSnippetsClientWrapper.tsx   # Client wrapper for snippets search
│   ├── CodeSnippetDetailClient.tsx     # Client wrapper for snippet actions
│   ├── LearningResourcesClientWrapper.tsx  # Client wrapper for resources search
│   └── LearningResourceDetailClient.tsx    # Client wrapper for resource actions
├── lib/                         # Utility functions
│   ├── auth.ts                  # NextAuth configuration
│   ├── auth-utils.ts            # Auth helper functions
│   ├── supabase.ts              # Supabase base client
│   ├── supabase-server.ts       # Server Component Supabase client (RLS)
│   ├── supabase-api.ts          # API route Supabase client (service role)
│   └── utils.ts                 # General utilities
├── types/                       # TypeScript type definitions
│   ├── supabase.ts              # Database types
│   ├── index.ts                 # App types
│   └── next-auth.d.ts           # NextAuth type extensions
├── public/                      # Static assets
├── supabase-schema.sql          # Database schema
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies
```

## Database Schema

The app uses three main tables:

- **articles** - Long-form written content
- **code_snippets** - Code examples with syntax highlighting
- **learning_resources** - External learning materials (videos, courses, docs)

All tables include:

- User authentication and ownership
- Tags for categorization
- Timestamps for creation and updates
- Row Level Security (RLS) policies

## Architecture: Server Components + Client Components

This app uses Next.js 15+ **Server Components** by default for optimal performance, with **Client Components** only where interactivity is needed.

### Server Components (Default)

**Pages that fetch data:**

- `app/articles/page.tsx` - Articles list
- `app/articles/[id]/page.tsx` - Article detail
- `app/code-snippets/page.tsx` - Code snippets list
- `app/code-snippets/[id]/page.tsx` - Code snippet detail
- `app/learning-resources/page.tsx` - Learning resources list
- `app/learning-resources/[id]/page.tsx` - Learning resource detail

**Benefits:**

- ⚡ **Server-Side Rendering** - Data fetched on server before HTML sent to client
- 🔒 **Direct Database Access** - Query Supabase directly with Row Level Security
- 📦 **Smaller Bundle** - No client-side data fetching code shipped
- 🚀 **Better SEO** - Content available for search engines
- 💾 **Reduced Client Memory** - No client-side state management

**Pattern:**

```typescript
// Server Component (async page)
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams; // Next.js 15: searchParams is a Promise
  const { supabase, session } = await createServerSupabaseClient();

  // Direct database query
  let query = supabase.from("articles").select("*");
  if (search) query = query.ilike("title", `%${search}%`);
  const { data: articles } = await query;

  // Pass data to Client Component for interactivity
  return <ArticlesClientWrapper initialArticles={articles} search={search} />;
}
```

### Client Components (Interactive Features)

**Client wrapper components:**

- `ArticlesClientWrapper.tsx` - Search input and navigation
- `ArticleDetailClient.tsx` - Edit/delete buttons with modals
- Similar wrappers for code snippets and learning resources

**Benefits:**

- 🎯 **Targeted Interactivity** - Only interactive parts run on client
- 🔄 **State Management** - useState, useRouter for search and forms
- 🎨 **Event Handlers** - onClick, onChange, onSubmit
- 📱 **Client-Only APIs** - Browser APIs, local storage

**Pattern:**

```typescript
// Client Component (marked with "use client")
"use client";

export default function ArticlesClientWrapper({
  initialArticles,
  search,
}: {
  initialArticles: Article[];
  search?: string;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search || "");

  const handleSearch = () => {
    router.push(`/articles?search=${searchValue}`);
  };

  return (
    <>
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
      />
      {initialArticles.map((article) => (
        <ResourceCard key={article.id} {...article} />
      ))}
    </>
  );
}
```

### Dual Supabase Client Pattern

**Server Components (RLS-enabled):**

```typescript
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Uses anon key + Row Level Security
const { supabase, session } = await createServerSupabaseClient();
const { data } = await supabase.from("articles").select("*");
```

**API Routes (Service Role):**

```typescript
import { createApiSupabaseClient } from "@/lib/supabase-api";

// Uses service_role key to bypass RLS
const supabase = createApiSupabaseClient();
await supabase.from("articles").insert({ ...data, author_id: session.user.id });
```

### Next.js 15 Async Params

Next.js 15+ requires awaiting `params` and `searchParams`:

```typescript
// ✅ Correct (Next.js 15+)
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { id } = await params;
  const { search } = await searchParams;
}

// ❌ Wrong (causes errors)
export default async function Page({
  params: { id },  // Cannot destructure Promise
  searchParams: { search },
}) { ... }
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

Update `NEXTAUTH_URL` in your environment variables to your production URL.

## API Endpoints

### Articles

- `GET /api/articles` - List all articles
- `POST /api/articles` - Create article (auth required)
- `GET /api/articles/[id]` - Get single article
- `PUT /api/articles/[id]` - Update article (owner only)
- `DELETE /api/articles/[id]` - Delete article (owner only)

### Code Snippets

- `GET /api/code-snippets` - List all snippets
- `POST /api/code-snippets` - Create snippet (auth required)
- `GET /api/code-snippets/[id]` - Get single snippet
- `PUT /api/code-snippets/[id]` - Update snippet (owner only)
- `DELETE /api/code-snippets/[id]` - Delete snippet (owner only)

### Learning Resources

- `GET /api/learning-resources` - List all resources
- `POST /api/learning-resources` - Create resource (auth required)
- `GET /api/learning-resources/[id]` - Get single resource
- `PUT /api/learning-resources/[id]` - Update resource (owner only)
- `DELETE /api/learning-resources/[id]` - Delete resource (owner only)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
