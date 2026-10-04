// Work categories. Adding one here adds a filter, a /work/[category] route and a BOM value.
export const categories = {
  engineering: 'Engineering',
  software: 'Software',
  ventures: 'Ventures',
} as const;

export type Category = keyof typeof categories;
export const CATEGORY_KEYS = Object.keys(categories) as [Category, ...Category[]];
