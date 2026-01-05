import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET single code snippet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase } = await createServerSupabaseClient();

  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("code_snippets")
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
      return NextResponse.json(
        { error: "Code snippet not found" },
        { status: 404 }
      );
    }

    const snippet = {
      ...data,
      author_name: (data as any).users?.name,
      users: undefined,
    };

    return NextResponse.json(snippet);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update code snippet
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
    const { title, code, language, description, tags } = body;

    // RLS policy automatically prevents updating snippets not owned by user
    const { data, error } = await supabase
      .from("code_snippets")
      .update({ title, code, language, description, tags })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Forbidden or not found" },
        { status: 403 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE code snippet
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

    // RLS policy automatically prevents deleting snippets not owned by user
    const { error } = await supabase
      .from("code_snippets")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Forbidden or not found" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Code snippet deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
