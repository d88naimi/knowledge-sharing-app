# Knowledge Sharing App - Study Guide

## 🎯 Start Here: Understanding the Big Picture

This is a **full-stack Next.js 16 application** for sharing knowledge resources (articles, code snippets, and learning resources). It uses **NextAuth** for authentication and **Supabase** as the database.

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

- [ ] `app/layout.tsx` - Root layout with SessionProvider, SWRProvider and Header
- [ ] `app/page.tsx` - Home page with unified resources using SWR
- [ ] `components/Header.tsx` - Navigation bar with auth status
- [ ] `components/SWRProvider.tsx` - **NEW!** Global SWR configuration
  - Sets up automatic caching and revalidation
  - Configures global fetcher function
  - Enables deduplication and focus revalidation

**Key Concept**: Layout wraps all pages. SWRProvider enables efficient data fetching with caching across the entire app.

---

### **Level 5: API Routes (Backend)** (60 min)

Understand how data flows from client to database.

#### 7. **Articles API**

- [ ] `app/api/articles/route.ts` - GET (list/search) and POST (create)
- [ ] `app/api/articles/[id]/route.ts` - GET (single), PUT (update), DELETE

**Pattern to understand**:

```typescript
// All API routes follow this pattern:
1. Import createServerSupabaseClient from lib/supabase-server
2. Get Supabase client with user context: const { supabase, session } = await createServerSupabaseClient()
3. RLS policies automatically enforce permissions
4. No manual authorization checks needed - database handles it!
```

#### 8. **Code Snippets API** (same pattern)

- [ ] `app/api/code-snippets/route.ts`
- [ ] `app/api/code-snippets/[id]/route.ts`

#### 9. **Learning Resources API** (same pattern)

- [ ] `app/api/learning-resources/route.ts`
- [ ] `app/api/learning-resources/[id]/route.ts`

**Key Concept**: RLS policies enforce permissions at the database level. API routes use `createServerSupabaseClient()` which sets user context for RLS.

---

### **Level 6: Frontend Pages** (60 min)

Understand how users interact with the app.

#### 10. **Articles Pages**

- [ ] `app/articles/page.tsx` - List all articles with search
- [ ] `app/articles/[id]/page.tsx` - View single article (with edit/delete for owner)
- [ ] `app/articles/new/page.tsx` - Create new article form

**Pattern to understand**:

```typescript
// All resource pages use SWR for data fetching:
1. Use useSWR hook instead of useState/useEffect
2. Conditional fetching: useSWR(authenticated ? url : null)
3. Use useSession to get current user
4. Show edit/delete only if session.user.id === resource.author_id
5. Automatic caching, revalidation, and error handling

// Example:
const { data: articles = [], isLoading } = useSWR<Article[]>(
  status === "authenticated" ? "/api/articles" : null
);
```

#### 11. **Code Snippets Pages** (same pattern)

- [ ] `app/code-snippets/page.tsx`
- [ ] `app/code-snippets/[id]/page.tsx` - **Note: Uses CodeHighlighter component**
- [ ] `app/code-snippets/new/page.tsx`

#### 12. **Learning Resources Pages** (same pattern)

- [ ] `app/learning-resources/page.tsx`
- [ ] `app/learning-resources/[id]/page.tsx`

**Key Concept**: Pages are client components (`"use client"`). They use **SWR hooks** to fetch from API routes with automatic caching and revalidation, not directly from Supabase.

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
- [ ] `lib/supabase-server.ts` - **Server-side Supabase client with RLS enabled**
  - Uses anon key (not service role)
  - Sets user context via `set_user_context()` RPC call
  - Enables database-level security

---

RLS (Row Level Security)?

- **Security**: Database enforces permissions, not just application code
- **Defense in Depth**: Even if app code has bugs, database protects data
- **Less Code**: No manual `if (author_id !== session.user.id)` checks
- **Pattern**: `createServerSupabaseClient()` sets user context, RLS policies filter/block queries

<<<<<<< Updated upstream
=======
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
export default async function Page({ params: { id } }) {
  // id is undefined!
}
```

>>>>>>> Stashed changes
### How NextAuth + RLS Integration Works

1. User logs in with NextAuth → JWT session created
2. API route calls `createServerSupabaseClient()` → gets user ID from session
3. Calls `supabase.rpc('set_user_context', { user_id })` → stores in PostgreSQL transaction
4. RLS policies call `get_current_user_id()` → retrieves stored user ID
5. Database automatically filters/blocks based on `author_id = get_current_user_id()`

- **Problem**: NextAuth uses its own auth system, not Supabase Auth
- **Solution**: Use service_role key to bypass RLS, handle permissions in code
- **Trade-off**: More manual permission checks, but full control

### Why Client Components for Pages?

- **Reason**: Need hooks like `useState`, `useEffect`, `useSession`, `useSWR`
- **Pattern**: Fetch data client-side from API routes using SWR (not directly from DB)

### Why SWR Instead of Manual Fetching?

- **Less Code**: Replaces 30-40 lines of useState/useEffect boilerplate per page
- **Better UX**: Automatic background updates, instant navigation with cached data
- **Deduplication**: Multiple components requesting same data = single network request
- **Focus Revalidation**: Data refreshes when user returns to tab
- **Error Recovery**: Built-in retry logic and error handling
- **Pattern**: `const { data, isLoading, error } = useSWR(url)` - that's it!

### Why Separate API Routes?

- **Security**: Never expose service_role key to client
- **Validation**: Centralized input validation and error handling
- **Type Safety**: TypeScript types ensure data consistency

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
