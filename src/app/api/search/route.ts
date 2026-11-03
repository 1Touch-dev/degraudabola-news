import { search } from '@/lib/cms-client';

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const limitParam = Number(searchParams.get('limit') || '6');
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 6;

  const results = q ? await search(q, limit) : [];

  return Response.json({
    results,
  });
}