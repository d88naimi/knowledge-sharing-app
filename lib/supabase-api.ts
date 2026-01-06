import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

/**
 * Creates a Supabase client for API routes that need to bypass RLS.
 *
 * Use this in API routes where you manually set author_id and handle authorization.
 * This uses the service_role key which bypasses RLS policies.
 *
 * @returns Object with supabase client and user session
 */
export async function createApiSupabaseClient() {
  const session = await getServerSession(authOptions);

  // Create client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return { supabase, session };
}
