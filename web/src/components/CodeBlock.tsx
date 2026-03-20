import { useEffect, useRef, useState } from 'react';
import { Highlight, Prism, type Language, type PrismTheme } from 'prism-react-renderer';

import type { CodeExample } from '../content/site';

type CodeBlockProps = {
  example: CodeExample;
};

const prismScope = globalThis as typeof globalThis & { Prism?: typeof Prism };
prismScope.Prism = Prism;
await import('prismjs/components/prism-bash');

const codeTheme: PrismTheme = {
  plain: {
    backgroundColor: 'transparent',
    color: '#1f2a44',
  },
  styles: [
    {
      style: {
        color: '#8a94a6',
        fontStyle: 'italic',
      },
      types: ['comment', 'prolog', 'doctype', 'cdata'],
    },
    {
      style: {
        color: '#7c3aed',
      },
      types: ['keyword', 'operator', 'atrule'],
    },
    {
      style: {
        color: '#0f9f8f',
      },
      types: ['string', 'char', 'inserted'],
    },
    {
      style: {
        color: '#ea580c',
      },
      types: ['number', 'boolean', 'constant'],
    },
    {
      style: {
        color: '#2563eb',
      },
      types: ['function', 'builtin', 'class-name'],
    },
    {
      style: {
        color: '#64748b',
      },
      types: ['punctuation', 'symbol'],
    },
    {
      style: {
        color: '#0f7b8f',
      },
      types: ['attr-name', 'property', 'tag', 'selector'],
    },
    {
      style: {
        color: '#1f2a44',
      },
      types: ['plain'],
    },
  ],
};

function toHighlightLanguage(language: string): Language {
  if (language === 'ts') {
    return 'typescript';
  }

  if (language === 'sh') {
    return 'bash';
  }

  return language;
}

async function copyCode(code: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(code);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = code;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Unable to copy code.');
  }
}

export function CodeBlock({ example }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const resetTimerRef = useRef<number | null>(null);
  const language = toHighlightLanguage(example.language);
  const code = example.code.trim();
  const copyLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry' : 'Copy';

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    []
  );

  const handleCopy = async () => {
    try {
      await copyCode(code);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyState('idle');
      resetTimerRef.current = null;
    }, 1800);
  };

  return (
    <Highlight code={code} language={language} theme={codeTheme}>
      {({ className, getLineProps, getTokenProps, style, tokens }) => (
        <figure className="code-panel">
          <figcaption className="code-label">
            <span className="code-label-title">{example.label}</span>
            <span className="code-label-actions">
              <span className="code-language">{example.language}</span>
              <button
                className="code-copy-button"
                onClick={() => {
                  void handleCopy();
                }}
                type="button"
              >
                {copyLabel}
              </button>
            </span>
          </figcaption>
          <pre className={`code-block ${className}`} style={style}>
            <code>
              {tokens.map((line, lineIndex) => {
                const { className: lineClassName, ...lineProps } = getLineProps({ line });

                return (
                  <span
                    className={`code-line ${lineClassName ?? ''}`.trim()}
                    key={`${example.label}-${lineIndex + 1}`}
                    {...lineProps}
                  >
                    <span className="code-line-number">{lineIndex + 1}</span>
                    <span className="code-line-content">
                      {line.map((token, tokenIndex) => (
                        <span
                          key={`${example.label}-${lineIndex + 1}-${tokenIndex + 1}`}
                          {...getTokenProps({ token })}
                        />
                      ))}
                    </span>
                  </span>
                );
              })}
            </code>
          </pre>
        </figure>
      )}
    </Highlight>
  );
}
