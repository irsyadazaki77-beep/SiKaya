import { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#6a11cb" />
        </linearGradient>
        <mask id="cutout">
          <circle cx="50" cy="50" r="50" fill="white" />
          <path d="M -5 40 C 30 -25, 70 75, 105 10" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M -5 65 C 30 0, 70 100, 105 35" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M -5 90 C 30 25, 70 125, 105 60" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#logoGrad)" mask="url(#cutout)" />
    </svg>
  );
}
