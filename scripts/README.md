# Database Seeding Scripts

This folder contains scripts to populate your Supabase database with mock data.

## Prerequisites

Make sure you have the following environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Installation

Install tsx to run TypeScript files:

```bash
npm install -D tsx
```

## Seeding Scripts

### 1. Seed Users (`seed-users.ts`)

Creates 10 mock users in both `auth.users` and `public.users` tables.

**Run:**

```bash
npm run seed:users
```

**Creates:**

- 10 authenticated users with confirmed emails
- 10 public user profiles with names
- All users have password: `Test123!`

**Mock Users:**

1. sarah.johnson@example.com - Sarah Johnson
2. michael.chen@example.com - Michael Chen
3. emma.williams@example.com - Emma Williams
4. james.rodriguez@example.com - James Rodriguez
5. olivia.brown@example.com - Olivia Brown
6. david.kim@example.com - David Kim
7. sophia.martinez@example.com - Sophia Martinez
8. daniel.taylor@example.com - Daniel Taylor
9. ava.anderson@example.com - Ava Anderson
10. ryan.thomas@example.com - Ryan Thomas

### 2. Seed Articles (`seed-articles.ts`)

Creates 15 software development articles.

**Run:**

```bash
npm run seed:articles
```

**Note:** You must have at least one user in the database before running this script. Run `npm run seed:users` first, or sign up through the app.

**Creates:**

- 15 comprehensive articles on various software topics
- Topics include: React, TypeScript, Node.js, Git, CSS, Databases, Docker, APIs, Testing, Performance, GraphQL, Security, JavaScript, Microservices, Tailwind, CI/CD
- Each article has relevant tags for filtering

## Recommended Order

Run the scripts in this order:

```bash
# 1. Create users first
npm run seed:users

# 2. Then create articles (requires users to exist)
npm run seed:articles
```

## Troubleshooting

### "No users found" error when seeding articles

- Make sure you've run `npm run seed:users` first
- Or sign up for an account through the app

### "User already exists" error

- Users with the same email already exist
- You can skip this error or delete existing users from Supabase Dashboard

### Permission errors

- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Make sure RLS policies are set up correctly in your database

## Clean Up

To remove all seeded data:

1. Go to Supabase Dashboard → Authentication → Users
2. Delete the mock users
3. Or run SQL in SQL Editor:

```sql
-- Delete all articles
DELETE FROM public.articles;

-- Delete all public users (this will cascade delete content)
DELETE FROM public.users WHERE email LIKE '%@example.com';

-- Delete auth users (go to Authentication → Users in dashboard)
```
