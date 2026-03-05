interface CodeBlockProps {
  language?: string;
  code: string;
}

export function CodeBlock({
  language,
  code,
}: CodeBlockProps): React.ReactElement {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border">
      {language ? (
        <div className="border-b border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {language}
          </span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4">
        <code className={language ? `language-${language}` : undefined}>
          {code}
        </code>
      </pre>
    </div>
  );
}
