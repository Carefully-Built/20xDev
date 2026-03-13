import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

interface WebhookBody {
  _type: string;
  slug?: { current: string };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 });
    }

    switch (body._type) {
      case 'post':
        revalidateTag('posts', 'max');
        if (body.slug?.current) {
          revalidateTag(`post-${body.slug.current}`, 'max');
        }
        break;
      case 'category':
        revalidateTag('categories', 'max');
        if (body.slug?.current) {
          revalidateTag(`category-${body.slug.current}`, 'max');
        }
        break;
      case 'author':
        revalidateTag('posts', 'max');
        break;
      default:
        break;
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(message, { status: 500 });
  }
}
