import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-dark-700 dark:text-light-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-dark-400/15 px-1.5 py-0.5 font-mono text-[0.85em] text-dark-700 dark:bg-dark-300/20 dark:text-light-200">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-dark-500/10 p-3 text-sm last:mb-0 dark:bg-dark-300/10">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <h3 className="mb-2 text-base font-bold text-dark-700 dark:text-light-100">{children}</h3>
  ),
  h2: ({ children }) => (
    <h4 className="mb-2 text-sm font-bold text-dark-700 dark:text-light-100">{children}</h4>
  ),
  h3: ({ children }) => (
    <h5 className="mb-1 text-sm font-semibold text-dark-600 dark:text-light-200">{children}</h5>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-primary-500/50 pl-3 italic text-dark-500 dark:text-light-300 last:mb-0">
      {children}
    </blockquote>
  ),
};

interface ChatMarkdownProps {
  content: string;
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="chat-markdown text-sm text-dark-600 dark:text-light-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
