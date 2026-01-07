import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createApiSupabaseClient } from "@/lib/supabase-api";

// GET single learning resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase } = await createApiSupabaseClient();

  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("learning_resources")
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
        { error: "Learning resource not found" },
        { status: 404 }
      );
    }

    const resource = {
      ...data,
      author_name: (data as any).users?.name,
      users: undefined,
    };

    return NextResponse.json(resource);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update learning resource
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
    const { title, url, description, resource_type, tags } = body;

    // Check if resource exists and user owns it
    const { data: resource } = await supabase
      .from("learning_resources")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!resource) {
      return NextResponse.json({ error: "Learning resource not found" }, { status: 404 });
    }

    if (resource.author_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - you can only edit your own learning resources" },
        { status: 403 }
      );
    }

    // Update the resource
    const { data, error } = await supabase
      .from("learning_resources")
      .update({ title, url, description, resource_type, tags })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE learning resource
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

    // Check if resource exists and user owns it
    const { data: resource } = await supabase
      .from("learning_resources")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!resource) {
      return NextResponse.json({ error: "Learning resource not found" }, { status: 404 });
    }

    if (resource.author_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - you can only delete your own learning resources" },
        { status: 403 }
      );
    }

    // Delete the resource
    const { error } = await supabase
      .from("learning_resources")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Learning resource deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
