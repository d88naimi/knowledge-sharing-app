import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase } = await createServerSupabaseClient();

  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        users (
          name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const article = {
      ...data,
      author_name: data.users?.name,
      users: undefined,
    };

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, session } = await createServerSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, tags } = body;

    // RLS policy automatically prevents updating articles not owned by user
    // No manual authorization check needed!
    const { data, error } = await supabase
      .from("articles")
      .update({ title, content, tags })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // RLS will cause error if user doesn't own the article
      return NextResponse.json(
        { error: "Forbidden or not found" },
        { status: 403 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, session } = await createServerSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // RLS policy automatically prevents deleting articles not owned by user
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Forbidden or not found" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
