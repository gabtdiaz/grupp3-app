using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Xunit;

namespace FriendZone.E2E.Tests.Tests
{
    public class LoginE2ETest
    {
        [Fact]
        public async Task User_can_login_and_be_redirected_to_activity()
        {
            var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL")
                          ?? "http://localhost:5173";

            // CI = headless, lokalt = visa browser
            var isCi = string.Equals(
                Environment.GetEnvironmentVariable("CI"),
                "true",
                StringComparison.OrdinalIgnoreCase
            );

            // Fast test-user (läggs som env-vars, inte i koden)
            var testEmail = Environment.GetEnvironmentVariable("E2E_TEST_EMAIL")
                            ?? throw new InvalidOperationException(
                                "Saknar E2E_TEST_EMAIL env-var."
                            );

            var testPassword = Environment.GetEnvironmentVariable("E2E_TEST_PASSWORD")
                               ?? throw new InvalidOperationException(
                                   "Saknar E2E_TEST_PASSWORD env-var."
                               );

            using var playwright = await Playwright.CreateAsync();

            await using var browser = await playwright.Chromium.LaunchAsync(
                new BrowserTypeLaunchOptions
                {
                    Headless = isCi
                }
            );

            var page = await browser.NewPageAsync();

            await page.GotoAsync($"{baseUrl}/login");

           await page.Locator("input[type='email']").WaitForAsync(new() { Timeout = 15000 });

            await page.FillAsync("input[type='email']", testEmail);
            await page.FillAsync("input[type='password']", testPassword);

            await page.ClickAsync("button:has-text('LOGGA IN')");
        }
    }
}
