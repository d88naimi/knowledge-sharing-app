import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing environment variables");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  process.exit(1);
}

// Use service role client to create auth users
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const mockUsers = [
  {
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    password: "Test123!",
  },
  {
    email: "michael.chen@example.com",
    name: "Michael Chen",
    password: "Test123!",
  },
  {
    email: "emma.williams@example.com",
    name: "Emma Williams",
    password: "Test123!",
  },
  {
    email: "james.rodriguez@example.com",
    name: "James Rodriguez",
    password: "Test123!",
  },
  {
    email: "olivia.brown@example.com",
    name: "Olivia Brown",
    password: "Test123!",
  },
  { email: "david.kim@example.com", name: "David Kim", password: "Test123!" },
  {
    email: "sophia.martinez@example.com",
    name: "Sophia Martinez",
    password: "Test123!",
  },
  {
    email: "daniel.taylor@example.com",
    name: "Daniel Taylor",
    password: "Test123!",
  },
  {
    email: "ava.anderson@example.com",
    name: "Ava Anderson",
    password: "Test123!",
  },
  {
    email: "ryan.thomas@example.com",
    name: "Ryan Thomas",
    password: "Test123!",
  },
];

async function seedUsers() {
  console.log("🌱 Starting user seeding...\n");

  for (const user of mockUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
        });

      if (authError) {
        console.error(
          `❌ Error creating auth user for ${user.email}:`,
          authError.message
        );
        continue;
      }

      if (!authData.user) {
        console.error(`❌ No user data returned for ${user.email}`);
        continue;
      }

      console.log(
        `✓ Created auth user: ${user.email} (ID: ${authData.user.id})`
      );

      // Create public.users entry
      const { error: publicError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
      });

      if (publicError) {
        console.error(
          `❌ Error creating public user for ${user.email}:`,
          publicError.message
        );
      } else {
        console.log(`✓ Created public profile: ${user.name}\n`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error for ${user.email}:`, error);
    }
  }

  console.log("\n✅ User seeding completed!");
  console.log("\n📋 Summary:");
  console.log("- 10 users created in auth.users");
  console.log("- 10 profiles created in public.users");
  console.log("- All users have password: Test123!");
  console.log("\nYou can now log in with any of these emails.");
}

seedUsers();
