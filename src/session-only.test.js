/**
 * Inside the src folder:
 * python3 -m http.server 8001
 *
 * Inside the session-only.test.js file:
 * Modify line 10 to browser name; default - firefox
 * Modify line 18 and 48 to correct port; default - 8001
 *
 * Run commands:
 * npm install
 * npm install selenium-webdriver
 * npm install mocha --save-dev
 * npx mocha src/session-only.test.js
 *
 * Expected Output:
 *
 *  Session-Only Tests
 *     ✔ after toggling to session-only, the cookie expiry should be removed (6461ms)
 *     ✔ after toggling to session-only, the cookie expiry should be present (6463ms)
 *
 *
 *   2 passing (16s)
 */


const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

describe('Session-Only Tests', function() {
    let driver;
    this.timeout(25000);

    before(async function() {
        // set browser here
        driver = await new Builder().forBrowser('firefox').build();
    });

    after(async function() {
        await driver.quit();
    });

    it('after toggling to session-only, the cookie expiry should be removed', async function() {
        const fileUrl = 'http://localhost:8001/index.html'; // Adjust as needed (port) (file name)
        await driver.get(fileUrl);

        async function addCookieThroughInput(cookieName) {
            await driver.findElement(By.id('firstText')).sendKeys(cookieName);
            await driver.findElement(By.id('submitBtnExpiring')).click();
            await driver.sleep(1000);
            await driver.findElement(By.id('firstText')).clear();
        }

        for (let i = 1; i <= 2; i++) {
            await addCookieThroughInput(`CookieTest${i}`);
        }

        let initialCookies = await driver.manage().getCookies();
        let sessionOnly = initialCookies.every(cookie => cookie.hasOwnProperty('expiry'));
        assert.strictEqual(sessionOnly, true, 'Initial cookies should not be session-only');

        await driver.findElement(By.id('customizeButton')).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('glowCookies-customize'))), 10000);
        await driver.findElement(By.id('glowCookies-customize-switch-4')).click();
        await driver.findElement(By.id('glowCookies-customize-save')).click();
        await driver.sleep(3000);

        let sessionOnlyCookies = await driver.manage().getCookies();
        let sessionOnlyTrue = sessionOnlyCookies.every(cookie => cookie.hasOwnProperty('expiry'));
        assert.strictEqual(sessionOnlyTrue, false, 'Cookies should be session-only after toggle');
    });

    it('after toggling from session-only, the cookie expiry should be present', async function() {
        const fileUrl = 'http://localhost:8001/index.html'; // Adjust as needed (port) (file name)
        await driver.get(fileUrl);

        async function addCookieThroughInput(cookieName) {
            await driver.findElement(By.id('firstText')).sendKeys(cookieName);
            await driver.findElement(By.id('submitBtnSession')).click();
            await driver.sleep(1000);
            await driver.findElement(By.id('firstText')).clear();
        }

        for (let i = 1; i <= 2; i++) {
            await addCookieThroughInput(`CookieTest${i}`);
        }

        let initialCookies = await driver.manage().getCookies();
        let sessionOnly = initialCookies.every(cookie => cookie.hasOwnProperty('expiry'));
        assert.strictEqual(sessionOnly, false, 'Initial cookies should be session-only');

        await driver.findElement(By.id('customizeButton')).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('glowCookies-customize'))), 10000);
        await driver.findElement(By.id('glowCookies-customize-switch-4')).click();
        await driver.findElement(By.id('glowCookies-customize-switch-4')).click();
        await driver.findElement(By.id('glowCookies-customize-save')).click();
        await driver.sleep(3000);

        let expiringCookies = await driver.manage().getCookies();
        let expiringTrue = expiringCookies.every(cookie => cookie.hasOwnProperty('expiry'));
        assert.strictEqual(expiringTrue, true, 'Cookies should be not session-only after toggle');
    });
});
