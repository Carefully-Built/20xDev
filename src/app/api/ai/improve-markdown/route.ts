import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

interface ImproveMarkdownRequestBody {
  readonly document?: unknown;
}

interface OpenAITextContent {
  readonly type?: string;
  readonly text?: string;
}

interface OpenAIMessageOutput {
  readonly type?: string;
  readonly content?: readonly OpenAITextContent[];
}

interface OpenAIResponseBody {
  readonly output?: readonly OpenAIMessageOutput[];
  readonly output_text?: string;
  readonly error?: {
    readonly message?: string;
  };
}

function isTipTapDocument(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as { readonly type?: unknown }).type === 'doc'
  );
}

function extractOutputText(response: OpenAIResponseBody): string {
  if (typeof response.output_text === 'string') {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .flatMap((content) => (typeof content.text === 'string' ? [content.text] : []))
      .join('\n')
      .trim() ?? ''
  );
}

function parseImprovedDocument(value: string): Record<string, unknown> | null {
  const cleanedValue = value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(cleanedValue) as unknown;
    return isTipTapDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function improveDocument(document: unknown): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const model = process.env.OPENAI_MODEL ?? 'gpt-5.5';
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions:
        'You improve long-form CRM notes. Preserve facts, names, dates, and intent. Improve clarity, grammar, structure, and Markdown-like formatting using TipTap JSON nodes such as paragraphs, headings, bullet lists, ordered lists, blockquotes, code marks, and links when appropriate. Return only a valid TipTap JSON document with type "doc".',
      input: `Improve this TipTap JSON document and return only improved TipTap JSON:\n${JSON.stringify(document)}`,
    }),
  });

  const responseBody = (await response.json()) as OpenAIResponseBody;

  if (!response.ok) {
    throw new Error(responseBody.error?.message ?? 'OpenAI request failed.');
  }

  const improvedDocument = parseImprovedDocument(extractOutputText(responseBody));

  if (!improvedDocument) {
    throw new Error('OpenAI did not return a valid TipTap document.');
  }

  return improvedDocument;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as ImproveMarkdownRequestBody;

    if (!isTipTapDocument(body.document)) {
      return NextResponse.json({ error: 'A TipTap document is required.' }, { status: 400 });
    }

    const improvedDocument = await improveDocument(body.document);

    return NextResponse.json({ document: improvedDocument });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not improve text.';
    const status = message.includes('OPENAI_API_KEY') ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
