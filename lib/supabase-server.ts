import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Creates a Supabase client that respects Row Level Security (RLS) policies.
 *
 * This client uses the anon key (not service role) and sets the user context
 * so that RLS policies can properly filter data based on the authenticated user.
 *
 * Benefits:
 * - Database-level security enforcement (RLS policies)
 * - No need for manual authorization checks in application code
 * - Prevents accidental data leaks if authorization logic is forgotten
 *
 * @returns Object with supabase client and user session
 */
export async function createServerSupabaseClient() {
  const session = await getServerSession(authOptions);

  // Create client with anon key (respects RLS)
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: session?.user?.id
        ? {
            // Pass authenticated user ID to Supabase
            // This will be used by RLS policies via get_user_id() function
            "x-user-id": session.user.id,
          }
        : {},
    },
  });

  // Set the user context for RLS
  if (session?.user?.id) {
    await supabase.rpc("set_user_context", { user_id: session.user.id });
  }

  return { supabase, session };
}
