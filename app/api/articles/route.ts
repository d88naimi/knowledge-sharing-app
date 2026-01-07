import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

// GET all articles with optional search and filter
export async function GET(request: NextRequest) {
  const { supabase } = await createApiSupabaseClient();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    let query = supabase
      .from("articles")
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
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to include author_name
    const articles = data.map((article: any) => ({
      ...article,
      author_name: article.users?.name,
      users: undefined,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new article
export async function POST(request: NextRequest) {
  const { supabase, session } = await createServerSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // RLS policy automatically enforces author_id = current user
    const { data, error: insertError } = await supabase
      .from("articles")
      .insert([
        {
          title,
          content,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
