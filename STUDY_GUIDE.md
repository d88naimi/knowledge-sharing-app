# Knowledge Sharing App - Study Guide

## 🎯 Start Here: Understanding the Big Picture

This is a **full-stack Next.js 16 application** for sharing knowledge resources (articles, code snippets, and learning resources). It uses **NextAuth** for authentication and **Supabase** as the database.

**Architecture:** Server Components (default) for data fetching + Client Components for interactivity.

**Key Pattern:** Pages render on server → fetch data directly from database → pass to client wrappers for interactive features.

---

## 📚 Recommended Study Order

### **Level 1: Foundation (Start Here!)**

Understand the project structure and basic configuration.

#### 1. **Project Configuration Files** (15 min)

- [ ] `package.json` - See all dependencies and scripts
- [ ] `next.config.ts` - Next.js configuration
- [ ] `tailwind.config.ts` - Styling configuration
- [ ] `tsconfig.json` - TypeScript settings
- [ ] `.env.local` - Environment variables (keys and secrets)

**Key Concept**: This is a Next.js App Router project with TypeScript and Tailwind CSS.

---

### **Level 2: Data Layer** (30 min)

Understand how data is structured and stored.

#### 2. **Database Schema**

- [ ] `supabase-schema.sql` - **START HERE!** The entire database structure
  - See the 4 tables: `users`, `articles`, `code_snippets`, `learning_resources`
  - Understand Row Level Security (RLS) policies
  - Note the `author_id` foreign key relationships
  - **Important**: See `set_user_context()` and `get_current_user_id()` functions for NextAuth integration

#### 3. **TypeScript Types**

- [ ] `types/index.ts` - Main application types (Article, CodeSnippet, LearningResource, User)
- [ ] `types/supabase.ts` - Database-specific types
- [ ] `types/next-auth.d.ts` - Extended NextAuth session types

**Key Concept**: Every resource has an author (user) and uses PostgreSQL via Supabase.

---

### **Level 3: Authentication System** (45 min)

Understand how users sign up, sign in, and stay authenticated.

#### 4. **Authentication Setup**

Read in this order:

1. [ ] `lib/auth.ts` - **NextAuth configuration** (how login works)

   - See the CredentialsProvider (email/password)
   - Understand the `authorize` function (password verification)
   - See JWT callbacks (session management)

2. [ ] `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler (auto-generated)

3. [ ] `app/api/auth/signup/route.ts` - User registration endpoint
   - Uses service_role key to bypass RLS for user creation
   - Creates both auth user and profile

#### 5. **Authentication Pages**

- [ ] `app/auth/signin/page.tsx` - Sign in form (Figma design)
- [ ] `app/auth/signup/page.tsx` - Sign up form (Figma design)
- [ ] `components/SessionProvider.tsx` - Wraps app with NextAuth session

**Key Concept**: NextAuth handles sessions with JWT. Supabase stores user profiles.

---

### **Level 4: Application Layout & Data Fetching** (30 min)

Understand the app structure, navigation, and how data is fetched.

#### 6. **Core Layout Files**

- [ ] `app/layout.tsx` - Root layout with SessionProvider and Header
- [ ] `app/page.tsx` - Home page with unified resources
- [ ] `components/Header.tsx` - Navigation bar with auth status

**Key Concept**: Layout wraps all pages. Server Components are the default - no "use client" needed for data fetching pages.

---

### **Level 5: API Routes (Backend)** (60 min)

Understand how data flows from client to database.

#### 7. **Articles API**

- [ ] `app/api/articles/route.ts` - GET (list/search) and POST (create)
- [ ] `app/api/articles/[id]/route.ts` - GET (single), PUT (update), DELETE

**Pattern to understand**:

```typescript
// API routes use service role client (bypasses RLS):
1. Import createApiSupabaseClient from lib/supabase-api
2. Get service role Supabase client: const supabase = createApiSupabaseClient()
3. Manually check session and set author_id
4. Bypasses RLS for write operations (POST/PUT/DELETE)
```

#### 8. **Code Snippets API** (same pattern)

- [ ] `app/api/code-snippets/route.ts`
- [ ] `app/api/code-snippets/[id]/route.ts`

#### 9. **Learning Resources API** (same pattern)

- [ ] `app/api/learning-resources/route.ts`
- [ ] `app/api/learning-resources/[id]/route.ts`

**Key Concept**: API routes use `createApiSupabaseClient()` with service_role key to bypass RLS. They manually validate sessions and set author_id. Server Component pages use `createServerSupabaseClient()` with RLS for secure reads.

---

### **Level 6: Frontend Pages** (60 min)

Understand how users interact with the app.

#### 10. **Articles Pages**

- [ ] `app/articles/page.tsx` - **Server Component** - Fetches articles directly from DB
- [ ] `app/articles/[id]/page.tsx` - **Server Component** - Fetches single article from DB
- [ ] `app/articles/new/page.tsx` - **Client Component** - Form with state management
- [ ] `components/ArticlesClientWrapper.tsx` - **Client Component** - Search interaction
- [ ] `components/ArticleDetailClient.tsx` - **Client Component** - Edit/delete buttons

**Pattern to understand**:

```typescript
// Server Component pattern (list pages):
1. Async function (no "use client")
2. Await params/searchParams (Next.js 15+)
3. Create Supabase client: createServerSupabaseClient()
4. Query database directly
5. Pass data to Client Component wrapper

// Example:
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams; // Must await!
  const { supabase } = await createServerSupabaseClient();
  const { data: articles } = await supabase.from('articles').select('*');
  return <ArticlesClientWrapper initialArticles={articles} search={search} />;
}
```

#### 11. **Code Snippets Pages** (same pattern)

- [ ] `app/code-snippets/page.tsx` - Server Component
- [ ] `app/code-snippets/[id]/page.tsx` - Server Component
- [ ] `app/code-snippets/new/page.tsx` - Client Component (form)
- [ ] `components/CodeSnippetsClientWrapper.tsx` - Client wrapper
- [ ] `components/CodeSnippetDetailClient.tsx` - Client wrapper

#### 12. **Learning Resources Pages** (same pattern)

- [ ] `app/learning-resources/page.tsx` - Server Component
- [ ] `app/learning-resources/[id]/page.tsx` - Server Component
- [ ] `components/LearningResourcesClientWrapper.tsx` - Client wrapper
- [ ] `components/LearningResourceDetailClient.tsx` - Client wrapper

**Key Concept**: Pages are **Server Components by default**. They fetch data directly from Supabase (not API routes). Client wrapper components handle interactive features (search, edit, delete).

---

### **Level 7: Reusable Components** (30 min)

#### 13. **UI Components**

- [ ] `components/ResourceCard.tsx` - Card display for all resource types
- [ ] `components/SearchBar.tsx` - Search input with debounce
- [ ] `components/Filter.tsx` - Tag filtering buttons
- [ ] `components/CodeHighlighter.tsx` - Syntax highlighting with react-syntax-highlighter
- [ ] `components/DeleteDialog.tsx` - Confirmation modal (Figma design)

**Key Concept**: Components are reusable across different resource types.

---

### **Level 8: Utilities** (15 min)

#### 14. **Helper Functions**

- [ ] `lib/utils.ts` - `cn()` for className merging, `formatDate()` for dates
- [ ] `lib/supabase-server.ts` - **Server Component Supabase client**
  - Uses anon key (not service role)
  - Enables Row Level Security (RLS)
  - Used by Server Component pages for secure reads
  - Sets user context via `set_user_context()` RPC call
- [ ] `lib/supabase-api.ts` - **API Route Supabase client**
  - Uses service_role key
  - Bypasses RLS entirely
  - Used by API routes for write operations
  - Manual session validation required

---

RLS (Row Level Security)?

- **Security**: Database enforces permissions, not just application code
- **Defense in Depth**: Even if app code has bugs, database protects data
- **Less Code**: No manual `if (author_id !== session.user.id)` checks
- **Pattern**: `createServerSupabaseClient()` sets user context, RLS policies filter/block queries

### Next.js 15 Async Params?

- **Breaking Change**: In Next.js 15+, `params` and `searchParams` are Promises
- **Reason**: Performance optimization - enables parallel data fetching
- **Pattern**: Must `await params` and `await searchParams` before using
- **Type**: `params: Promise<{ id: string }>` instead of `params: { id: string }`
- **Common Error**: "Cannot read property 'id' of Promise" - forgot to await

```typescript
// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}

// ❌ Wrong (causes runtime error)
export default async function Page({
  params: { id },
}) {
  // id is undefined!
}
```

### How NextAuth + RLS Integration Works

1. User logs in with NextAuth → JWT session created
2. API route calls `createServerSupabaseClient()` → gets user ID from session
3. Calls `supabase.rpc('set_user_context', { user_id })` → stores in PostgreSQL transaction
4. RLS policies call `get_current_user_id()` → retrieves stored user ID
5. Database automatically filters/blocks based on `author_id = get_current_user_id()`

- **Problem**: NextAuth uses its own auth system, not Supabase Auth
- **Solution**: Use service_role key to bypass RLS, handle permissions in code
- **Trade-off**: More manual permission checks, but full control

### Why Server Components for Pages?

- **Performance**: Data fetched on server before HTML sent to client
- **Security**: Direct database access with RLS (no API endpoint needed)
- **SEO**: Content available for search engines
- **Less Code**: No useState/useEffect boilerplate for data fetching
- **Pattern**: Async function queries database, passes data to client wrapper

### Why Client Components for Interactivity?

- **Reason**: Need hooks like `useState`, `useRouter`, event handlers
- **Pattern**: Receive data as props, handle search/edit/delete actions
- **Examples**: Search inputs, delete buttons, form submissions
- **Rule**: Only use "use client" when you need browser-only features

### Why Two Different Supabase Clients?

- **Server Components**: Use `createServerSupabaseClient()` with RLS for secure reads
- **API Routes**: Use `createApiSupabaseClient()` with service role for writes
- **Reason**: RLS client works for reads, but set_user_context() RPC doesn't exist for writes
- **Security**: API routes manually validate sessions and set author_id
- **Trade-off**: Separate concerns - pages read securely, APIs write with validation

### Why Separate API Routes?

- **Write Operations**: POST/PUT/DELETE need service role key to bypass RLS
- **Validation**: Centralized input validation and error handling
- **Type Safety**: TypeScript types ensure data consistency
- **Pattern**: Server Components read, API routes write

---

## 🧪 How to Test Your Understanding

### Test 1: Trace a User Flow

**Challenge**: Trace what happens when a user creates an article.

1. User fills form in `app/articles/new/page.tsx`
2. Form submits to `POST /api/articles`
3. API route calls `requireAuth()` → checks session
4. API route inserts to Supabase using service_role client
5. User redirected to articles list

### Test 2: Add a New Field

**Challenge**: Add a "difficulty" field to articles.

You would need to modify:

1. `supabase-schema.sql` - Add column
2. `types/index.ts` - Update Article type
3. `app/api/articles/route.ts` - Handle new field in POST
4. `app/articles/new/page.tsx` - Add input field
5. `app/articles/[id]/page.tsx` - Display new field

### Test 3: Debug Authentication

**Challenge**: Why might authentication fail?

Check:

1. Is `.env.local` set up correctly?
2. Is `SUPABASE_SERVICE_ROLE_KEY` the correct key?
3. Is user profile created in `users` table?
4. Is NextAuth session working? (Check browser cookies)

---

## 📖 Additional Reading

### Understanding Next.js App Router

- **Server vs Client Components**: Pages with `"use client that filter queries
- **Service Role**: Admin key that bypasses RLS (only used in `lib/auth.ts` for user creation)
- **Anon Key**: Public key with RLS enforced (used in API routes via `createServerSupabaseClient()`)
- **User Context**: `set_user_context()` and `get_current_user_id()` functions bridge NextAuth and RLSates dynamic route

### Understanding NextAuth

- **Session Strategy**: Uses JWT (stored in cookie)
- **Callbacks**: `jwt()` and `session()` customize session data
- **Providers**: CredentialsProvider for email/password

### Understanding Supabase

- **RLS Policies**: Row-level security rules in PostgreSQL
- **Service Role**: Admin key that bypasses RLS
- **Anon Key**: Public key with RLS enforced

---

## 🎓 Learning Path Suggestions

### Beginner Path (Focus on Frontend)

1. Read `types/index.ts` to understand data structures
2. Look at `app/articles/page.tsx` to see how lists work
3. Look at `app/articles/[id]/page.tsx` to see detail views
4. Study `components/ResourceCard.tsx` for reusable components
   how RLS policies work with NextAuth user context
5. Study `lib/supabase-server.ts` - see how user context is set
6. Compare database-level security vs. code-based permissions
7. Study the session management and JWT flow
8. Follow the recommended study order above
9. Trace one complete CRUD flow (Create → Read → Update → Delete)
10. Modify something small (add a field, change styling)
11. Test authentication flow from signup to login

### Advanced Path (Architecture)

1. Understand why service_role key is needed
2. Compare RLS approach vs. code-based permissions
3. Study the session management and JWT flow
4. Consider scaling: What if we had 10,000 users?

---

## 💡 Pro Tips

1. **Use the browser DevTools**: Watch Network tab when creating/fetching resources
2. **Check Supabase Dashboard**: See actual data in your database tables
3. **Read error messages**: They often point to the exact problem
4. **Start small**: Understand one resource type fully before moving to others
5. **Draw diagrams**: Sketch the data flow from form → API → database

---

## 🚀 Next Steps

After studying this app, you'll understand:

- ✅ Full-stack Next.js development
- ✅ Authentication with NextAuth
- ✅ Database design with PostgreSQL/Supabase
- ✅ TypeScript for type safety
- ✅ RESTful API design
- ✅ Component-based architecture
- ✅ Efficient data fetching with SWR (caching, revalidation, deduplication)

Good luck with your studies! 🎉
