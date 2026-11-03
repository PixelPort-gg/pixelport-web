import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = path => readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');
const text = source => source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const cases = [
  ['palworld', 'palworld-1623730', 'PixelPort verified'],
  ['dishonored', 'dishonored-205100', 'Player-tested'],
  ['chained-together', 'chained-together-2567870', 'Issues reported'],
  ['cs2', 'counter-strike-2-730', 'Untested'],
  ['apex-legends', 'apex-legends-1172470', 'Blocked'],
];
for (const [slug, macSlug, label] of cases) {
  test(`generated /games/${slug}: ${label}`, () => {
    const source = html(`games/${slug}`);
    assert.match(source, new RegExp(`class="game-tier-badge[^>]*>[\\s\\S]*?${label}`));
    const ld = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.ok(ld.length);
    assert.ok(ld.some(g => JSON.stringify(g).includes(label)), 'structured data carries the same assessment');
  });
  test(`generated /mac/${macSlug}: ${label}`, () => {
    assert.ok(text(html(`mac/${macSlug}`)).includes(label));
  });
}
test('unlocked Untested is available to try without a compatible claim', () => {
  const game = html('games/cs2');
  assert.ok(text(game).includes('Available to try'));
  assert.ok(text(game).includes('No substantiated gameplay claim'));
  assert.doesNotMatch(text(game), /Playable grade|graded playable|Download &(?:amp;)? play Counter-Strike 2/);
  assert.match(game, /href="\/download"[^>]*>[\s\S]*?Try Counter-Strike 2 on your Mac/);
});
test('homepage, catalogue, stats and FAQ show five canonical labels', () => {
  for (const route of ['', 'games', 'stats', 'docs/faq']) {
    const source = route ? html(route) : readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
    for (const label of ['Untested', 'Player-tested', 'PixelPort verified', 'Issues reported', 'Blocked']) assert.ok(text(source).includes(label), `${route}: ${label}`);
  }
});
test('old automated announcement cannot retain a withdrawn claim in its title or article', () => {
  const post = html('blog/cs2-now-verified');
  assert.match(post, /<title>Counter-Strike 2 on Mac: Untested/);
  assert.ok(text(post).includes('No substantiated gameplay claim'));
  assert.doesNotMatch(text(post), /just reached our top compatibility tier|Community \+ template|graded playable/);
});

test('an issue keeps accepted problem evidence on the Mac page', () => {
  assert.ok(text(html('mac/chained-together-2567870')).includes('Accepted relevant problem'));
});
