import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const WORKOS_WIDGETS_BASE_URL = 'https://api.workos.com/_widgets';
const FORWARDED_WIDGET_HEADERS = [
  'authorization',
  'content-type',
  'origin',
  'referer',
  'workos-widgets-type',
  'workos-widgets-version',
  'x-elevated-access-token',
] as const;

interface WidgetProxyContext {
  readonly params: Promise<{
    readonly path: string[];
  }>;
}

function buildHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  for (const headerName of FORWARDED_WIDGET_HEADERS) {
    const value = request.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
}

async function proxyWorkOSWidgets(
  request: NextRequest,
  context: WidgetProxyContext,
): Promise<NextResponse> {
  const { path } = await context.params;
  const url = new URL(`${WORKOS_WIDGETS_BASE_URL}/${path.join('/')}`);
  url.search = request.nextUrl.search;

  const init: RequestInit = {
    cache: 'no-store',
    headers: buildHeaders(request),
    method: request.method,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetch(url, init);
  const headers = new Headers();
  const contentType = response.headers.get('content-type');

  if (contentType) {
    headers.set('content-type', contentType);
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers,
    status: response.status,
  });
}

export async function GET(
  request: NextRequest,
  context: WidgetProxyContext,
): Promise<NextResponse> {
  return await proxyWorkOSWidgets(request, context);
}

export async function POST(
  request: NextRequest,
  context: WidgetProxyContext,
): Promise<NextResponse> {
  return await proxyWorkOSWidgets(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: WidgetProxyContext,
): Promise<NextResponse> {
  return await proxyWorkOSWidgets(request, context);
}
