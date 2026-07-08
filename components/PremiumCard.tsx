'use client';

import { ReactNode } from 'react';

interface PremiumCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href?: string;
  image?: string;
  featured?: boolean;
  children?: ReactNode;
}

export function PremiumCard({
  title,
  description,
  icon,
  href,
  image,
  featured = false,
  children,
}: PremiumCardProps) {
  const cardClass = featured
    ? 'border-2 border-accent bg-background'
    : 'border border-border hover:border-foreground/30';

  const inner = (
    <div className={`${cardClass} p-8 sm:p-10 transition-all hover:shadow-lg`}>
      {image && (
        <div className="mb-6 h-48 bg-secondary overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {icon && (
        <div className="mb-6 text-3xl">
          {icon}
        </div>
      )}

      <h3 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h3>
      <p className="text-base sm:text-lg leading-relaxed text-muted mb-6">{description}</p>

      {children}

      {featured && (
        <div className="mt-6 inline-block px-4 py-2 bg-accent text-accent-foreground text-xs font-bold tracking-wide">
          FEATURED
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  }

  return inner;
}
