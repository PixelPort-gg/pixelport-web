// Alphabetical neighbours for the two game-page families. Every generated page
// used to receive exactly one in-content link (its A–Z index row) while three
// related-game slots on 4,300 pages all pointed at the same 32 titles. Linking
// each page to the titles beside it in the A–Z order gives every page a handful
// of real inbound links from real pages, with no editorial bias to maintain.
//
// The sorted lists are built once per build (module scope), not once per page.
import games from '../data/games.resolved.json';
import catalogue from '../data/catalogue.json';
import compat from '../data/compat.json';

export interface AzEntry {
  slug: string;
  title: string;
  href: string;
}

const byTitle = (a: AzEntry, b: AzEntry) => a.title.localeCompare(b.title, 'en');

const guides: AzEntry[] = [
  ...(games as any[]).map((g) => ({ slug: g.slug, title: g.title, href: `/games/${g.slug}/` })),
  ...(catalogue as any[]).map((e) => ({ slug: e.slug, title: e.title, href: `/games/${e.slug}/` })),
].sort(byTitle);

const verdicts: AzEntry[] = ((compat as any).games as any[])
  .map((g) => ({ slug: `${g.slug}-${g.appid}`, title: g.name, href: `/mac/${g.slug}-${g.appid}/` }))
  .sort(byTitle);

const index = (list: AzEntry[]) => new Map(list.map((e, i) => [e.slug, i]));
const guideIndex = index(guides);
const verdictIndex = index(verdicts);

function around(list: AzEntry[], i: number | undefined, each = 2): AzEntry[] {
  if (i === undefined) return [];
  return [...list.slice(Math.max(0, i - each), i), ...list.slice(i + 1, i + 1 + each)];
}

/** Two titles before and two after `slug` in the /games/ A–Z order. */
export const guideNeighbours = (slug: string) => around(guides, guideIndex.get(slug));
/** Two titles before and two after `<slug>-<appid>` in the /mac/ A–Z order. */
export const verdictNeighbours = (slugAppid: string) => around(verdicts, verdictIndex.get(slugAppid));
