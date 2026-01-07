import { NextRequest, NextResponse } from "next/server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

// GET all code snippets
export async function GET(request: NextRequest) {
  const { supabase } = await createApiSupabaseClient();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const language = searchParams.get("language");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    let query = supabase
      .from("code_snippets")
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

    if (language) {
      query = query.eq("language", language);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const snippets = data.map((snippet) => ({
      ...snippet,
      author_name: (snippet as any).users?.name,
      users: undefined,
    }));

    return NextResponse.json(snippets);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new code snippet
export async function POST(request: NextRequest) {
  const { supabase, session } = await createApiSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, code, language, description, tags } = body;

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: "Title, code, and language are required" },
        { status: 400 }
      );
    }

    // RLS policy automatically enforces author_id = current user
    const { data, error: insertError } = await supabase
      .from("code_snippets")
      .insert([
        {
          title,
          code,
          language,
          description,
          tags: tags || [],
          author_id: session.user.id,
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
