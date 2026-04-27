import { loadDoc } from "@/lib/markdown";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const doc = loadDoc(slug);
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
