import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assertFixtureMatchesUpstream } from '../scripts/check-contract-fixtures.mjs';
import { compatibilityLabel, parseProvenance, assessmentFields, withCompatibility, compatibilityMeta, labelOrder, isTested, publicBlockReason } from '../src/lib/compatibility.mjs';

// Unmodified app contract at b3d0c8b9. The website reads labels, not assessment writes.
const fixtureBytes = readFileSync(new URL('./fixtures/compatibility.json', import.meta.url));
const fixtures = JSON.parse(fixtureBytes);
test('fixture copy matches the pinned upstream blob and rejects drift', () => {
  assert.doesNotThrow(() => assertFixtureMatchesUpstream(fixtureBytes));
  assert.throws(() => assertFixtureMatchesUpstream(Buffer.concat([fixtureBytes, Buffer.from('\n')])), /Compatibility fixtures differ from upstream blob/);
});
assert.equal(fixtures.contract, 'compatibility-labels/1');
for (const c of fixtures.provenance_cases) test(`provenance: ${c.verified_by}`, () => {
  assert.deepEqual(parseProvenance(c.verified_by), { head: c.head, tail: c.tail });
});
for (const c of fixtures.label_cases) test(`label: ${c.name}`, () => {
  assert.equal(compatibilityLabel(c.row), c.label);
  // Exercise the whitelist used by API/D1 snapshots, including missing fields.
  assert.equal(withCompatibility(assessmentFields(c.row)).label, c.label);
  assert.equal(compatibilityLabel({ ...c.row, unlocked: true }), c.label);
});
test('five public labels and canonical copy', () => {
  assert.deepEqual(labelOrder.map(k => compatibilityMeta[k].label), ['PixelPort verified', 'Player-tested', 'Issues reported', 'Untested', 'Blocked']);
});
test('only accepted gameplay qualifies a recommendation', () => {
  assert.equal(isTested({ tier: 'verified' }), false);
  assert.equal(isTested({ tier: 'playable', verified_by: 'ai' }), false);
  assert.equal(isTested({ tier: 'playable', verified_by: 'community' }), true);
  assert.equal(isTested({ tier: 'verified', verified_by: 'pixelport', unsupported_reason: 'Established limitation' }), false);
});
test('public snapshot preserves cleared fields and excludes recipe internals', () => {
  const old = { tier: 'verified', verified_by: 'pixelport', unsupported_reason: 'Old limitation' };
  const current = assessmentFields({ tier: 'candidate', verified_by: null, unsupported_reason: null, recipe_hash: 'private', launch: 'private' });
  assert.equal(compatibilityLabel({ ...old, ...current }), 'untested');
  assert.equal(current.verified_by, null);
  assert.equal(current.unsupported_reason, null);
  assert.equal('recipe_hash' in current, false);
  assert.equal('launch' in current, false);
});

test('an imported machine reason does not invent a public anti-cheat cause', () => {
  const row = { unsupported_reason: 'auto-imported; archetype unreal|eac-kernel; source PCGW' };
  assert.equal(compatibilityLabel(row), 'blocked');
  assert.equal(publicBlockReason(row.unsupported_reason).includes('eac-kernel'), false);
});
