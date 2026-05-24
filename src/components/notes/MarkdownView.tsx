'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

/**
 * Renders user-authored markdown safely. ReactMarkdown disables raw HTML by
 * default, so we don't need DOMPurify. Tailwind classes hand-tuned to fit
 * the app's serif/sans hybrid type system.
 */
export function MarkdownView({ content, className = '' }: MarkdownViewProps) {
  if (!content.trim()) {
    return (
      <p className={`font-sans text-sm text-bible-text-secondary dark:text-bible-text-secondary-dark italic ${className}`}>
        (내용 없음)
      </p>
    );
  }

  return (
    <div
      className={`font-serif text-base leading-relaxed text-bible-text dark:text-bible-text-dark ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-display text-2xl font-semibold mt-6 mb-3 text-bible-text dark:text-bible-text-dark">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-xl font-semibold mt-5 mb-2 text-bible-text dark:text-bible-text-dark">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-lg font-semibold mt-4 mb-2 text-bible-text dark:text-bible-text-dark">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-2">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 my-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 my-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-bible-accent/60 pl-4 my-3 italic text-bible-text/85 dark:text-bible-text-dark/85 bg-bible-surface/40 dark:bg-bible-surface-dark/40 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="font-mono text-sm bg-bible-surface dark:bg-bible-surface-dark px-1.5 py-0.5 rounded">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="font-mono text-sm bg-bible-surface dark:bg-bible-surface-dark p-3 rounded my-3 overflow-auto">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bible-accent underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-4 border-bible-border/50 dark:border-bible-border-dark/50" />,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
