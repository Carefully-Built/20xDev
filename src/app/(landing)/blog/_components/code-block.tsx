interface CodeBlockProps {
  readonly language?: string;
  readonly code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps): React.ReactElement {
  return (
    <div className="border-border my-4 overflow-hidden rounded-lg border">
      {language ? (
        <div className="border-border bg-muted/50 border-b px-4 py-2">
          <span className="text-muted-foreground text-xs font-medium">{language}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
    </div>
  );
}
