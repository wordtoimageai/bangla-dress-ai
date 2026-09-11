import { NextResponse } from 'next/server';
import { createTryOnMockup } from '@/lib/ai-client';

export async function POST(request: Request) {
  const { human_image, garment_image } = await request.json();

  if (!human_image || !garment_image) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await createTryOnMockup(human_image, garment_image);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Processing failed' }, { status: 500 });
    }

    return NextResponse.json({ output: result.imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
