export async function GET(_request, { params }) {
  const { id } = params;
  return Response.json({ id });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  return new Response(null, { status: 204 });
}

export async function DELETE(_request, { params }) {
  const { id } = params;
  return new Response(null, { status: 204 });
}
