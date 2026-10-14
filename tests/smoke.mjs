// End-to-end check of the bugs fixed in the rescue, against a running demo build.
// Usage: npm run build && npx vite preview --port 4173 & node tests/smoke.mjs http://localhost:4173
import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:4173";
const browser = await chromium.launch();
const ctx = await browser.newContext({ timezoneId: "America/Los_Angeles", locale: "en-US" });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(`PASS ${name}`);
  } catch (e) {
    results.push(`FAIL ${name}: ${e.message.replace(/\s+/g, " ").slice(0, 200)}`);
  }
};

await check("signed-out visitor is sent to sign-in", async () => {
  await page.goto(`${base}/app/leads`);
  await page.waitForURL(/\/login$/);
});

await check("wrong password is rejected", async () => {
  await page.fill('input[type="password"]', "wrong-password");
  await page.click('button:has-text("Sign in")');
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /wrong email or password/i);
});

await check("demo account signs in and returns to the requested page", async () => {
  await page.fill('input[type="password"]', "demo1234");
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/\/app\/leads$/);
});

await check("open pipeline is a dollar amount, not joined strings", async () => {
  await page.goto(`${base}/app`);
  const card = page.locator("text=Open pipeline").locator("..");
  await card.waitFor();
  assert.equal(await card.locator(".num").innerText(), "$53,750");
});

await check("follow-up due today shows as Today in a US time zone", async () => {
  await page.goto(`${base}/app/leads/l01`);
  await page.locator("text=Next follow-up").waitFor();
  assert.ok(await page.locator("text=Next follow-up").locator("..").getByText("Today").isVisible());
});

await check("Won filter finds the won jobs", async () => {
  await page.goto(`${base}/app/leads?stage=won`);
  await page.locator("table tbody tr").first().waitFor();
  assert.equal(await page.locator("table tbody tr").count(), 3);
});

await check("double-clicking Save creates one lead", async () => {
  await page.goto(`${base}/app/leads`);
  await page.locator("table tbody tr").first().waitFor();
  const before = await page.locator("table tbody tr").count();
  await page.click('button:has-text("New lead")');
  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Estimated value ($)").fill("$2,500");
  await page.locator('button:has-text("Save lead")').dblclick();
  await page.waitForURL(/\/app\/leads\/[0-9a-f-]{36}$/);
  await page.goto(`${base}/app/leads`);
  await page.locator("table tbody tr").first().waitFor();
  assert.equal(await page.locator("table tbody tr").count(), before + 1);
  assert.equal(await page.locator("table").getByText("Test Person").count(), 1);
});

await check("form rejects a bad email", async () => {
  await page.click('button:has-text("New lead")');
  await page.getByLabel("Name").fill("No Email");
  await page.getByLabel("Email").fill("not-an-email");
  await page.click('button:has-text("Save lead")');
  await page.getByText("Enter a valid email").waitFor();
  await page.keyboard.press("Escape");
});

await check("refreshing a deep link keeps the page", async () => {
  await page.goto(`${base}/app/leads/l04`);
  await page.reload();
  await page.getByRole("heading", { name: "Tom Becker" }).waitFor();
});

await check("phone layout has no sideways scrolling", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/app", "/app/leads", "/app/leads/l04", "/app/pipeline"]) {
    await page.goto(base + path);
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${path} overflows by ${overflow}px`);
  }
});

await check("sign out ends the session", async () => {
  await page.goto(`${base}/app`);
  await page.getByLabel("Sign out").click();
  await page.goto(`${base}/app`);
  await page.waitForURL(/\/login$/);
});

await check("no JavaScript errors", async () => assert.deepEqual(errors, []));

await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
