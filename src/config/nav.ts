// Page order drives dial detents, sheet numbers and DWG numbers.
export interface NavPage {
  key: string;
  label: string;
  href: string;
}

export const nav: NavPage[] = [
  { key: 'index', label: 'Index', href: '/' },
  { key: 'work', label: 'Work', href: '/work/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'resume', label: 'Resume', href: '/resume/' },
  { key: 'colophon', label: 'Colophon', href: '/colophon/' },
];

export const sheetCount = nav.length;

export function sheetOf(key: string): { number: number; dwg: string; page: NavPage } {
  const i = nav.findIndex((p) => p.key === key);
  if (i < 0) throw new Error(`Unknown nav key: ${key}`);
  return { number: i + 1, dwg: `CB-${String(i + 1).padStart(3, '0')}`, page: nav[i] };
}
