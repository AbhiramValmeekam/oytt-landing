import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { browser, baseURL } from './browser.mjs';

await mkdir('reports', {recursive:true});
const instance = await browser();
const routes = ['/', '/support', '/privacy', '/terms', '/delete-account', '/children', '/404'];
const documentRoutes = ['/privacy', '/terms', '/delete-account', '/support', '/children'];
const footerRoutes = ['/privacy', '/terms', '/support', '/delete-account', '/children'];
const errors = [];
const results = [];
try {
  for (const theme of ['light', 'dark']) {
    const context = await instance.newContext({colorScheme:theme, reducedMotion:'reduce'});
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const requests = [];
    page.on('request', request => { if (!request.url().startsWith(baseURL)) requests.push(request.url()); });
    for (const route of routes) {
      await page.setViewportSize({width:1440,height:1000});
      const response = await page.goto(`${baseURL}${route}`, {waitUntil:'networkidle'});
      assert.ok(response.status() < 400 || route === '/404', `Route failed ${route}: ${response.status()}`);
      assert.ok(await page.title(), `${route} title`);
      assert.equal(await page.locator('h1').count(), 1, `${route} h1`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://oytt-8435e.web.app${route}`, `${route} canonical uses the public route`);
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      assert.deepEqual(await page.locator('.site-footer nav a').evaluateAll(links => links.map(link => link.getAttribute('href'))), footerRoutes, `${route} footer destinations`);
      const emailOccurrences = await page.locator('body').evaluate(body => (body.textContent.match(/oytt\.official@gmail\.com/g) || []).length);
      const linkedEmailOccurrences = await page.locator('a[href="mailto:oytt.official@gmail.com"]').evaluateAll(links => links.reduce((count, link) => count + (link.textContent.match(/oytt\.official@gmail\.com/g) || []).length, 0));
      assert.equal(linkedEmailOccurrences, emailOccurrences, `${route} every email address is linked`);
      if (documentRoutes.includes(route)) {
        const content = await page.locator('main').textContent();
        assert.doesNotMatch(content, /preparing this page|page in preparation/i, `${route} must contain the final document`);
        assert.doesNotMatch(content, /\[[^\]]*\]/, `${route} must not contain bracket placeholders`);
        assert.ok(await page.locator('main h2').count() > 0, `${route} document sections`);
        assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(), 0, `${route} document is indexable`);
        assert.equal(await page.locator(`.site-footer a[href="${route}"]`).getAttribute('aria-current'), 'page', `${route} current footer link`);
      }
      if (route === '/support') await page.locator('.faq-list details').evaluateAll(items => items.forEach(item => { item.open = true; }));
      const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      const violations = scan.violations.map(value => ({id:value.id, impact:value.impact, nodes:value.nodes.map(node => ({target:node.target, summary:node.failureSummary}))}));
      results.push({theme,route,violations});
      for (const width of [360,390,640,641,650,768,800,801,1024,1440]) {
        await page.setViewportSize({width,height:1000});
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const dimensions = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth, client:document.documentElement.clientWidth}));
        assert.ok(dimensions.scroll <= dimensions.client, `${route} ${theme} ${width}px overflow: ${JSON.stringify(dimensions)}`);
      }
      if (route === '/') {
        await page.setViewportSize({width:1440,height:1000});
        await page.screenshot({path:`reports/home-${theme}.png`,fullPage:true});
        await page.setViewportSize({width:360,height:1000});
        await page.screenshot({path:`reports/home-mobile-${theme}.png`,fullPage:true});
      }
      if (documentRoutes.includes(route) && theme === 'light') {
        await page.setViewportSize({width:1440,height:1000});
        await page.screenshot({path:`reports/${route.slice(1)}-desktop.png`});
        await page.setViewportSize({width:360,height:1000});
        await page.screenshot({path:`reports/${route.slice(1)}-mobile.png`});
      }
    }
    assert.deepEqual(requests, [], 'The static site must not send third-party requests');
    await context.close();
  }
  const noJS = await instance.newContext({javaScriptEnabled:false, viewport:{width:390,height:844}});
  const noJSPage = await noJS.newPage();
  for (const route of documentRoutes) {
    const response = await noJSPage.goto(`${baseURL}${route}`);
    assert.equal(response.status(), 200, `${route} public without JavaScript or login`);
    assert.equal(new URL(noJSPage.url()).pathname, route, `${route} no login redirect`);
    assert.ok(await noJSPage.locator('main h2').count() > 0, `${route} content without JavaScript`);
    assert.deepEqual(await noJSPage.locator('.site-footer nav a').evaluateAll(links => links.map(link => link.getAttribute('href'))), footerRoutes, `${route} footer without JavaScript`);
    if (route === '/support') {
      await noJSPage.locator('.faq-list summary').first().click();
      assert.ok(await noJSPage.locator('.faq-list details p').first().isVisible(), 'FAQ answers open without JavaScript');
    }
  }
  await noJS.close();
  const context = await instance.newContext({colorScheme:'light',viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(baseURL, {waitUntil:'networkidle'});
  await page.locator('[data-dial]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.task-name').textContent(), 'GYM');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('.task-name').textContent(), 'WORK');
  await page.locator('.start-key').click();
  await page.waitForFunction(() => document.querySelector('.console-time').textContent !== '00:00:00');
  const workTime = await page.locator('.console-time').textContent();
  await page.locator('[data-dial]').click();
  await page.locator('.start-key').click();
  assert.equal(await page.locator('[data-status-label]').textContent(),'REC');
  await page.locator('[data-dial]').focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('.console-time').textContent(), workTime);
  await page.locator('.reset-key').click();
  assert.equal(await page.locator('.console-time').textContent(),'00:00:00');
  await page.locator('[data-dial]').focus();
  await page.keyboard.press('ArrowRight');
  await page.locator('.log-key').click();
  assert.equal(await page.locator('[data-status-label]').textContent(),'SAVED');
  assert.match(await page.locator('[data-feedback]').textContent(), /GYM saved/);
  assert.equal(await page.locator('[data-demo-log]').textContent(),'1 SESSION SAVED');
  await page.locator('.widget-controls [data-action="reset"]').first().click();
  assert.equal(await page.locator('.console-time').textContent(),'00:00:00');
  await page.locator('.todo input').nth(1).check();
  assert.equal(await page.locator('[data-todo-count]').textContent(),'2 / 3 DONE');
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['oytt-theme']);
  assert.equal(await page.evaluate(() => document.cookie),'');
  await page.goto(`${baseURL}/support`);
  await page.locator('.faq-list summary').first().focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),'');
  await context.close();

  const blocked = await instance.newContext({colorScheme:'dark'});
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', {get() { throw new Error('Storage disabled'); }}); });
  const blockedPage = await blocked.newPage();
  blockedPage.on('pageerror', error => errors.push(error.message));
  await blockedPage.goto(baseURL);
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'),'dark');
  await blockedPage.locator('[data-theme-toggle]').click();
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'),'light');
  await blocked.close();
  const missing = await instance.newPage();
  const missingResponse = await missing.goto(`${baseURL}/missing-page`);
  assert.equal(missingResponse.status(),404);
  assert.match(await missing.locator('h2').textContent(),/THIS ONE GOT AWAY/);

  for (const width of [360,641,1440]) {
    const enlarged = await instance.newPage({viewport:{width,height:1000}});
    for (const route of ['/', ...documentRoutes]) {
      await enlarged.goto(`${baseURL}${route}`,{waitUntil:'networkidle'});
      if (route === '/support') await enlarged.locator('.faq-list details').evaluateAll(items => items.forEach(item => { item.open = true; }));
      await enlarged.evaluate(() => {
        const snapshots = [...document.querySelectorAll('body *')].map(element => [element,parseFloat(getComputedStyle(element).fontSize)]);
        snapshots.forEach(([element,size]) => { if(element instanceof HTMLElement) element.style.fontSize = `${size*2}px`; });
      });
      const sizes = await enlarged.evaluate(() => ({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      assert.ok(sizes.scroll <= sizes.client, `${route} 200% text at ${width}px overflows: ${JSON.stringify(sizes)}`);
    }
    await enlarged.close();
  }

  await writeFile('reports/accessibility.json',JSON.stringify(results,null,2));
  const violations = results.filter(result => result.violations.length);
  console.log(JSON.stringify({routeThemeChecks:results.length, accessibilityViolations:violations, runtimeErrors:errors},null,2));
  assert.deepEqual(errors, []);
  assert.deepEqual(violations, []);
  console.log('PASS: all routes, public documents without JavaScript, footer destinations, every email link, ten viewport widths, both themes, keyboard console, widgets, todos, persistence, blocked storage, FAQ, 404 and 200% text enlargement.');
} finally { await instance.close(); }
