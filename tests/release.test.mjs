import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseIssues } from '../src/lib/release.mjs';

test('release stays blocked until the public documents are ready', () => {
  assert.deepEqual(releaseIssues({ legalReady: false, operatorName: 'OYTT', postalCode: '500010' }), ['legalReady']);
});

test('unresolved operator details block release even when the ready flag is set', () => {
  for (const operatorName of [undefined, '', '   ', '[Your Full Name / Business Name]', 'OYTT [Name]']) {
    assert.deepEqual(releaseIssues({ legalReady: true, operatorName, postalCode: '500010' }), ['operatorName']);
  }
});

test('an incomplete or placeholder postal PIN blocks release', () => {
  for (const postalCode of [undefined, '', '[PIN]', '50001', '500010]', 'abcdef', 500010]) {
    assert.deepEqual(releaseIssues({ legalReady: true, operatorName: 'OYTT', postalCode }), ['postalCode']);
  }
});

test('confirmed contact details allow release without an officer name', () => {
  assert.deepEqual(releaseIssues({ legalReady: true, operatorName: 'OYTT', postalCode: '500010' }), []);
});
