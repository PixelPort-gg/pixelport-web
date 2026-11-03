// Pin the vendored fixture to the actual upstream Git blob, independently of its
// test expectations. Updating the contract requires an explicit source-pin update.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const fixtureSource = {
  repository: 'PixelPort-gg/pixelport-app',
  revision: 'b3d0c8b928b031fdea779be442b4d7c4ec5e901c',
  path: 'server/contracts/compatibility/fixtures.json',
  blob: '50f0d39f34d3a2455b19aad167b959541bf4e46a',
};

export function assertFixtureMatchesUpstream(bytes) {
  const digest = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  if (digest !== fixtureSource.blob) {
    throw new Error(`Compatibility fixtures differ from upstream blob ${fixtureSource.blob} at ${fixtureSource.repository}@${fixtureSource.revision}. Restore the copy, or verify the new upstream revision and update the reader, fixtures and source pin together.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertFixtureMatchesUpstream(readFileSync(new URL('../tests/fixtures/compatibility.json', import.meta.url)));
  console.log(`Compatibility fixtures match upstream blob ${fixtureSource.blob}.`);
}
