import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

interface RequestBody {
  blog_id: string;
  email: string;
  comment: string;
  nickname: string;
  uuid?: string;
}

interface Comment {
  id?: string;
  blog_id: string;
  email: string;
  nickname: string;
  comment: string;
  created_at?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();
    const { blog_id, email, comment, nickname } = body;

    const { data, error } = await supabase
      .from("comments")
      .insert<Comment>({
        blog_id,
        email,
        nickname,
        comment,
      })
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, comment: data[0] }, { status: 200 });
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
