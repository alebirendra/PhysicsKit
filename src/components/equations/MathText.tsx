import katex from 'katex';
import { useMemo } from 'react';

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function MathBlock({ latex, displayMode = true, className = '' }: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface MathTextProps {
  text: string;
  className?: string;
}

interface TextSegment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

function parseMathSegments(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({
        type: 'display-math',
        content: token.slice(2, -2).trim(),
      });
    } else {
      segments.push({
        type: 'inline-math',
        content: token.slice(1, -1).trim(),
      });
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: 'text',
      content: input.slice(lastIndex),
    });
  }

  return segments;
}

export function MathText({ text, className = '' }: MathTextProps) {
  const segments = useMemo(() => parseMathSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <span key={idx}>{seg.content}</span>;
        }
        return (
          <MathBlock
            key={idx}
            latex={seg.content}
            displayMode={seg.type === 'display-math'}
            className={seg.type === 'display-math' ? 'block my-2' : 'inline-block align-baseline mx-0.5'}
          />
        );
      })}
    </span>
  );
}
