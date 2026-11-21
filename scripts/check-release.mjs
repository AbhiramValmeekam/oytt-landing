import { site } from '../src/config/site.mjs';
import { releaseIssues } from '../src/lib/release.mjs';
const issues = releaseIssues(site);
if (issues.length) {
  console.error(`Release configuration incomplete: ${issues.join(', ')}. Complete the legal/support documents and verified operator/address fields in src/config/site.mjs. See README.md.`);
  process.exitCode = 1;
} else {
  console.log('Release configuration complete: public documents are marked ready and operator/address fields contain no placeholders. Run the build and browser checks before deployment.');
}
