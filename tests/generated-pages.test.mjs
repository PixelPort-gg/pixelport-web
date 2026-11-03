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

const faqEntities = source => [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap(m => JSON.parse(m[1])['@graph'] ?? [])
  .filter(g => g['@type'] === 'FAQPage')
  .flatMap(g => g.mainEntity);
const withdrawnClaims = /graded playable|verified through Pixel Port|verified on Apple Silicon|the Windows build is verified|Pixel Port runs the Windows build|a human ran it end to end|verified local run/i;
for (const slug of ['lethal-company', 'peak', 'sons-of-the-forest', 'valheim', 'schedule-i', 'r-e-p-o', 'phasmophobia']) {
  test(`native facts do not restore withdrawn claims: ${slug}`, () => {
    const source = html(`games/${slug}`);
    const visible = text(source);
    const answers = faqEntities(source).map(q => q.acceptedAnswer.text).join(' ');
    assert.ok(visible.includes('Untested'));
    assert.equal(withdrawnClaims.test(visible), false, 'visible text retains a withdrawn claim');
    assert.equal(withdrawnClaims.test(answers), false, 'structured answers retain a withdrawn claim');
    const native = faqEntities(source).find(q => q.name.startsWith('Is there a native Mac version'));
    assert.ok(native, 'native-platform answer remains present');
    assert.ok(native.acceptedAnswer.text.includes('Untested'), 'Windows assessment accompanies the separate native facts');
  });
}
for (const slug of ['battlefield-6', 'call-of-duty-modern-warfare-ii-2022']) {
  test(`Untested unavailable game is not promised to run: ${slug}`, () => {
    const source = html(`games/${slug}`);
    assert.doesNotMatch(text(source), /Pixel Port runs the Windows build of|compatibility layer that runs the Windows build/);
    const setup = faqEntities(source).find(q => q.name.startsWith('Do I need Windows'));
    assert.ok(setup.acceptedAnswer.text.includes('Untested'));
    assert.ok(setup.acceptedAnswer.text.includes('not available to install'));
    assert.doesNotMatch(setup.acceptedAnswer.text, /runs the Windows build/);
  });
}
test('catalogue hubs use current labels and snapshot counts', () => {
  const grid = JSON.parse(readFileSync(new URL('../public/catalogue-grid.json', import.meta.url)));
  const antiCheat = text(html('games/anti-cheat'));
  for (const [key, label] of [['pixelport_verified', 'PixelPort verified'], ['player_tested', 'Player-tested']]) {
    assert.ok(antiCheat.includes(`${grid.filter(g => g.label === key).length} ${label}`));
  }
  const inlineText = source => source.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  assert.ok(inlineText(html('games/anti-cheat')).includes(`games and ${grid.filter(g => g.label === 'player_tested').length} Player-tested`), 'rendered count has a word separator');
  assert.ok(inlineText(html('games/verified')).includes(`includes the ${grid.filter(g => !g.n && g.label === 'pixelport_verified').length} PixelPort verified`), 'rendered inclusion count has a word separator');
  assert.doesNotMatch(antiCheat, /thousands of multiplayer games|graded playable|playable or verified/);
  const verified = text(html('games/verified'));
  assert.ok(verified.includes(`${grid.filter(g => !g.n).length.toLocaleString('en-US')} Windows games`));
  for (const label of ['Untested', 'Player-tested', 'PixelPort verified', 'Issues reported', 'Blocked']) assert.ok(verified.includes(label));
  assert.doesNotMatch(verified, /more games carry|playable, needs attention/);
});
