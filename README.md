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

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js
- **Database:** Supabase (PostgreSQL)
- **Data Fetching:** SWR (Stale-While-Revalidate)
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
│   └── SWRProvider.tsx          # SWR global configuration
├── lib/                         # Utility functions
│   ├── auth.ts                  # NextAuth configuration
│   ├── auth-utils.ts            # Auth helper functions
│   ├── supabase.ts              # Supabase client
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

## Data Fetching with SWR

This app uses [SWR](https://swr.vercel.app/) for efficient data fetching with automatic caching and revalidation.

### Benefits

- **Automatic Caching** - Data is cached and reused across components
- **Revalidation** - Automatic background updates when data changes
- **Deduplication** - Multiple requests to the same endpoint are deduplicated
- **Focus Revalidation** - Data refreshes when user refocuses the window
- **Less Boilerplate** - Replaces manual useState/useEffect patterns

### Configuration

Global SWR config is set in `components/SWRProvider.tsx`:

```typescript
<SWRConfig
  value={{
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
    revalidateOnFocus: true,
    dedupingInterval: 2000, // 2 seconds
  }}
>
  {children}
</SWRConfig>
```

### Usage Pattern

```typescript
// Before: Manual state management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch("/api/articles")
    .then((res) => res.json())
    .then(setData)
    .finally(() => setLoading(false));
}, []);

// After: SWR hook
const { data = [], isLoading } = useSWR("/api/articles");
```

### Key Features Used

- **Conditional Fetching**: `useSWR(authenticated ? url : null)`
- **Error Handling**: `useSWR(url, { onError: () => router.push(...) })`
- **Manual Revalidation**: `mutate('/api/articles')` to refresh data
- **Parallel Fetching**: Multiple `useSWR` calls for different resources

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
