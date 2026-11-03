import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assessmentSummary, compatibilityMeta, withCompatibility } from './compatibility.mjs';
import snapshot from '../data/compat.json';

const grid = JSON.parse(readFileSync(join(process.cwd(), 'public/catalogue-grid.json'), 'utf8'));

// Old automated announcements used tier-only claims. Keep their URLs and dates,
// while every discovery surface and the article show the current assessment.
export function withCurrentCompatibility(post: any) {
  if (!post.id.endsWith('-now-verified')) return post;
  const slug = post.id.replace(/-now-verified$/, '');
  const row = grid.find((g: any) => g.slug === slug)
    ?? snapshot.games.find(g => g.slug === slug);
  const name = row?.title ?? row?.name ?? post.data.title.replace(/ is now verified on Mac.*$/, '');
  const assessment = withCompatibility(row ?? { tier: 'candidate' });
  const meta = compatibilityMeta[assessment.label];
  const href = row?.p ? `/games/${row.slug}/` : row?.name ? `/mac/${row.slug}-${row.appid}/` : `/games/?q=${encodeURIComponent(name)}`;
  return {
    ...post,
    assessment: { ...assessment, name, meta, href },
    data: { ...post.data, title: `${name} on Mac: ${meta.label}`, description: assessmentSummary(assessment, name) },
  };
}
