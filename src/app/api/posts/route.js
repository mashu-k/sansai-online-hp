export async function GET(request) {
  // 簡易モック
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  return Response.json({ posts: [], status });
}

export async function POST(request) {
  const body = await request.json();
  return new Response(null, { status: 201 });
}
