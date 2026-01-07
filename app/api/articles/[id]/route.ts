import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

// GET single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase } = await createApiSupabaseClient();

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
  const { supabase, session } = await createApiSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, tags } = body;

    // First check if article exists and user owns it
    const { data: article } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.author_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - you can only edit your own articles" },
        { status: 403 }
      );
    }

    // Update the article
    const { data, error } = await supabase
      .from("articles")
      .update({ title, content, tags })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
  const { supabase, session } = await createApiSupabaseClient();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // First check if article exists and user owns it
    const { data: article } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.author_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - you can only delete your own articles" },
        { status: 403 }
      );
    }

    // Delete the article
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
