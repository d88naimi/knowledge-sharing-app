# Setup Guide for Knowledge Sharing App

## Quick Start Steps

### 1. Environment Setup

You need to configure your environment variables. Here's what you need:

**Required Environment Variables:**

- Supabase URL and keys
- NextAuth secret

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details and create

#### Get Your Credentials

1. Go to Project Settings > API
2. Copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY) - keep this secret!

#### Run Database Schema

1. In your Supabase project, go to SQL Editor
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste and click "Run"
5. You should see success messages for all tables and policies

### 3. NextAuth Configuration

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET` in your `.env.local`

### 4. Update .env.local

Create a `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

### 5. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the App

### 1. Create an Account

1. Click "Sign Up" in the header
2. Fill in your name, email, and password
3. After successful signup, you'll be redirected to sign in

### 2. Sign In

1. Use the email and password you just created
2. You should be logged in and see your name in the header

### 3. Create Content

Now you can:

- Create articles at `/articles/new`
- Add code snippets at `/code-snippets/new`
- Share learning resources at `/learning-resources/new`

## Troubleshooting

### "Cannot connect to Supabase"

- Check that your Supabase URL and keys are correct
- Make sure your Supabase project is active
- Verify you're using the correct environment variable names

### "Unauthorized" errors

- Make sure you're signed in
- Check that your NextAuth configuration is correct
- Verify your session is active (refresh the page)

### Database errors

- Ensure you ran the full `supabase-schema.sql` script
- Check that RLS policies are enabled
- Verify your user exists in the `users` table

### Build errors

- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check that all environment variables are set

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add all environment variables from `.env.local`
6. Update `NEXTAUTH_URL` to your production URL (e.g., `https://your-app.vercel.app`)
7. Click "Deploy"

## Next Steps

- Customize the design in Tailwind CSS
- Add more features (comments, likes, bookmarks)
- Implement email verification
- Add profile pages
- Create admin dashboard

## Support

If you encounter issues, check:

- The browser console for errors
- The terminal for server errors
- Supabase logs in the dashboard
