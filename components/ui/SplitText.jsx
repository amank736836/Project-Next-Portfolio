'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Expressive typography primitive.
 *
 * Splits a string into words/characters and animates them in with a staggered
 * rise + flip. Runs on mount by default, or when scrolled into view
 * (`trigger="view"`), which is what the hero uses so the headline performs as
 * the page settles.
 */
export default function SplitText({
  text = '',
  as: Tag = 'span',
  className = '',
  mode = 'char',
  gradient = false,
  delay = 0,
  stagger = 26,
  trigger = 'mount',
  ...rest
}) {
  const wrapperRef = useRef(null);
  const [started, setStarted] = useState(trigger === 'mount');

  useEffect(() => {
    if (trigger !== 'view' || started) return;
    const node = wrapperRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, started]);

  const words = useMemo(() => String(text).split(' '), [text]);

  let charIndex = 0;

  return (
    <Tag
      ref={wrapperRef}
      className={`kx ${gradient ? 'kx--gradient' : ''} ${className}`}
      {...rest}
    >
      {words.map((word, wordIndex) => {
        const isLast = wordIndex === words.length - 1;
        if (mode === 'word') {
          const wordDelay = started ? delay + wordIndex * stagger * 3 : delay;
          return (
            <span className="kx__word" key={`${word}-${wordIndex}`}>
              <span
                style={{
                  display: 'inline-block',
                  opacity: started ? undefined : 0,
                  transform: started ? undefined : 'translateY(0.55em) rotateX(-70deg)',
                  animation: started ? `mx-char-in 620ms var(--mx-ease-out-expo) ${wordDelay}ms forwards` : 'none',
                }}
              >
                {word}
              </span>
              {!isLast ? ' ' : null}
            </span>
          );
        }

        return (
          <span className="kx__word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((char, ci) => {
              const currentDelay = started ? delay + charIndex * stagger : delay;
              charIndex += 1;
              return (
                <span
                  className="kx__char"
                  key={`${char}-${ci}`}
                  style={{
                    '--kx-delay': `${currentDelay}ms`,
                    '--kx-bg': `${(charIndex % 22) * 5}%`,
                    animationPlayState: started ? 'running' : 'paused',
                  }}
                >
                  {char}
                </span>
              );
            })}
            {!isLast ? <span className="kx__char" style={{ '--kx-delay': `${delay + charIndex++ * stagger}ms`, animationPlayState: started ? 'running' : 'paused' }}>&nbsp;</span> : null}
          </span>
        );
      })}
    </Tag>
  );
}
