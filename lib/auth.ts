import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

// Create admin client for auth operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // First, verify the user exists and get their ID
          const { data: authUser, error: authError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single();

          if (authError || !authUser) {
            return null;
          }

          // Verify password by attempting sign in
          const { data: signInData, error: signInError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          // If sign in fails due to email not confirmed, but user exists,
          // confirm them and try again
          if (signInError?.message?.includes("Email not confirmed")) {
            // Update user to confirmed
            const { error: updateError } =
              await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
                email_confirm: true,
              });

            if (updateError) {
              return null;
            }

            // Try signing in again
            const { data: retryData, error: retryError } =
              await supabaseAdmin.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
              });

            if (retryError || !retryData.user) {
              return null;
            }

            // Sign out from Supabase immediately after verification
            await supabaseAdmin.auth.signOut();

            return {
              id: retryData.user.id,
              email: retryData.user.email!,
              name: authUser.name || retryData.user.email,
            };
          }

          if (signInError || !signInData.user) {
            return null;
          }

          // Sign out from Supabase immediately after verification
          // We only use Supabase for password verification, not session management
          await supabaseAdmin.auth.signOut();

          return {
            id: signInData.user.id,
            email: signInData.user.email!,
            name: authUser.name || signInData.user.email,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect to signin on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signOut() {
      // Clean up any Supabase sessions when user signs out
      try {
        await supabaseAdmin.auth.signOut();
      } catch {
        // Ignore errors during cleanup
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
