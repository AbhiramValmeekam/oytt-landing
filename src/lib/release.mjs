export function releaseIssues(config) {
  const issues = [];
  if (config.legalReady !== true) issues.push('legalReady');
  if (typeof config.operatorName !== 'string' || !config.operatorName.trim() || /\[|\]/.test(config.operatorName)) {
    issues.push('operatorName');
  }
  if (typeof config.postalCode !== 'string' || !/^\d{6}$/.test(config.postalCode)) issues.push('postalCode');
  return issues;
}
