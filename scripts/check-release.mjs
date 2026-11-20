import { site } from '../src/config/site.mjs';
if (!site.legalReady) {
  console.error('Release checklist incomplete: legal pages were deferred. Complete and review all four legal routes before using their URLs in Google Play. See README.md.');
  process.exitCode = 1;
} else {
  console.log('Legal-ready flag is set. Confirm every README launch item before deployment.');
}
