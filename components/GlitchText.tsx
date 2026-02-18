import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  speed?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&[]';

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '', 
  speed = 50 
}) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    let interval: any = null;

    // Reset for new text
    setDisplayText(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));

    interval = setInterval(() => {
      setDisplayText(prev => 
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3; // Slow down the reveal
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <Component className={`font-mono tracking-wider ${className}`}>
      {displayText}
    </Component>
  );
};