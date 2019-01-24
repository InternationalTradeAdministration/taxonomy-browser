const puppeteer = require('puppeteer');

jest.setTimeout(30000);

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

test('main title is present', async () => {
  const mainTitleElement = `#taxonomy_container h1`;
  const mainTitleText = await page.$eval(mainTitleElement, e => e.innerHTML);
  await page.waitForSelector(mainTitleElement);
  expect(mainTitleText).toBe('Thesaurus of International Trade Terms');
});

afterAll(() => browser.close());