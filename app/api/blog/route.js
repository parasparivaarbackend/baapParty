import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { getBlogPosts, createBlogPost } from '@/lib/db/blog';

export async function GET() {
  const items = await getBlogPosts();
  return NextResponse.json(items);
}

export async function POST(req) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const body = await req.json();
  if (!body?.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  const item = await createBlogPost(body);
  return NextResponse.json(item, { status: 201 });
}
