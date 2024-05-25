import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { blog_id, email, comment, nickname, uuid } = body;

    const { data, error } = await supabase
      .from("comments")
      .insert({
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
