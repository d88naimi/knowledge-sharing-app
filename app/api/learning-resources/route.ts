import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/auth-utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role client to bypass RLS (we handle auth with NextAuth)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// GET all learning resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const resourceType = searchParams.get("type");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    let query = supabase
      .from("learning_resources")
      .select(
        `
        *,
        users (
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (resourceType) {
      query = query.eq("resource_type", resourceType);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const resources = data.map((resource) => ({
      ...resource,
      author_name: (resource as any).users?.name,
      users: undefined,
    }));

    return NextResponse.json(resources);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new learning resource
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { title, url, description, resource_type, tags } = body;

    if (!title || !url || !description || !resource_type) {
      return NextResponse.json(
        { error: "Title, URL, description, and resource type are required" },
        { status: 400 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("learning_resources")
      .insert([
        {
          title,
          url,
          description,
          resource_type,
          tags: tags || [],
          author_id: session!.user.id,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
