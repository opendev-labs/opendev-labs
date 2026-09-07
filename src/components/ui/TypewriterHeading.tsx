import React, { useState, useEffect } from 'react';

interface TypewriterHeadingProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypewriterHeading: React.FC<TypewriterHeadingProps> = ({
  phrases,
  typingSpeed = 40,
  deletingSpeed = 20,
  pauseDuration = 3500,
  className = ''
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex];

    let timer: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentPhrase.length) {
      // Type next character
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      // Hold for 3 to 4 seconds once full sentence is typed
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charIndex > 0) {
      // Erase character
      timer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      // Move to next sentence in cycle
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  if (!phrases || phrases.length === 0) return null;

  const displayedText = phrases[phraseIndex].substring(0, charIndex);

  return (
    <span className={className}>
      <span>{displayedText}</span>
      <span className="inline-block w-[3px] sm:w-[5px] h-[0.8em] bg-blue-600 dark:bg-blue-400 rounded-xs ml-1 sm:ml-2 animate-pulse align-baseline shadow-sm" />
    </span>
  );
};
