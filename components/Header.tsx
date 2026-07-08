'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container-max flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <div className="w-6 h-6 bg-foreground flex items-center justify-center text-background font-bold text-xs">
            OD
          </div>
          <span className="text-sm font-bold text-foreground hidden sm:inline tracking-wide">OPENDEV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link href="#services" className="text-sm text-muted hover:text-foreground transition-colors font-medium">
            Services
          </Link>
          <Link href="#portfolio" className="text-sm text-muted hover:text-foreground transition-colors font-medium">
            Portfolio
          </Link>
          <Link href="#team" className="text-sm text-muted hover:text-foreground transition-colors font-medium">
            Team
          </Link>
          <Link href="#blog" className="text-sm text-muted hover:text-foreground transition-colors font-medium">
            Blog
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/booking" className="btn-primary text-sm py-2 px-6">
            Book a Call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="container-max py-4 flex flex-col gap-4">
            <Link href="#services" className="text-sm text-foreground hover:text-muted transition-colors font-medium">
              Services
            </Link>
            <Link href="#portfolio" className="text-sm text-foreground hover:text-muted transition-colors font-medium">
              Portfolio
            </Link>
            <Link href="#team" className="text-sm text-foreground hover:text-muted transition-colors font-medium">
              Team
            </Link>
            <Link href="#blog" className="text-sm text-foreground hover:text-muted transition-colors font-medium">
              Blog
            </Link>
            <Link href="/booking" className="btn-primary text-sm py-2 px-6 inline-block">
              Book a Call
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
