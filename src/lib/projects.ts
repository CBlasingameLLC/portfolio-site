import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Published work only: drafts are visible in `astro dev` and never in production builds. */
export async function publishedProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.started.valueOf() - a.data.started.valueOf());
}
