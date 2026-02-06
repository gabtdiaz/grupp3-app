using System;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Xunit;

namespace FriendZone.E2E.Tests.Tests;

public class RegisterE2ETest
{
    [Fact]
    public async Task User_can_register_and_be_redirected_to_activity()
    {
        var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL") ?? "http://localhost:5173";
        var isCi = string.Equals(Environment.GetEnvironmentVariable("CI"), "true", StringComparison.OrdinalIgnoreCase);

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(
            new BrowserTypeLaunchOptions { Headless = isCi }
        );

        var page = await browser.NewPageAsync();
        await page.GotoAsync($"{baseUrl}/register");

        await page.Locator("input[name='firstName']").WaitForAsync(new() { Timeout = 15000 });

        // Steg 1
        await page.FillAsync("input[name='firstName']", "Test");
        await page.FillAsync("input[name='lastName']", "User");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 2
        var uniqueEmail = $"test+{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}@mail.com";
        await page.FillAsync("input[name='email']", uniqueEmail);
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 3
        await page.FillAsync("input[name='password']", "Test1234");
        await page.FillAsync("input[name='confirmPassword']", "Test1234");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 4
        await page.Locator("select[name='city']").WaitForAsync(new() { Timeout = 15000 });
        await page.WaitForFunctionAsync("() => document.querySelector(\"select[name='city']\")?.options.length > 1");

        await page.SelectOptionAsync("select[name='city']", "Stockholm");
        await page.FillAsync("input[name='dateOfBirth']", "1995-05-20");
        await page.SelectOptionAsync("select[name='gender']", "0");

        await page.CheckAsync("#termsAccepted");
        await page.CheckAsync("#privacyAccepted");

        var registerButton = page.Locator("button:has-text('REGISTRERA')");
        await registerButton.ClickAsync();


        // Vänta på redirect
        await page.WaitForURLAsync("**/activity**", new() { Timeout = 60000 });

        var heading = page.GetByRole(AriaRole.Heading, new() { Name = "AKTIVITETER" });
        await heading.WaitForAsync(new() { Timeout = 60000 });
    }

    [Fact]
    public async Task Registration_should_show_error_when_passwords_do_not_match()
    {
        var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL") ?? "http://localhost:5173";
        var isCi = string.Equals(Environment.GetEnvironmentVariable("CI"), "true", StringComparison.OrdinalIgnoreCase);

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(
            new BrowserTypeLaunchOptions { Headless = isCi }
        );

        var page = await browser.NewPageAsync();
        await page.GotoAsync($"{baseUrl}/register");

        // Steg 1
        await page.FillAsync("input[name='firstName']", "Test");
        await page.FillAsync("input[name='lastName']", "User");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 2
        var uniqueEmail = $"test+{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}@mail.com";
        await page.FillAsync("input[name='email']", uniqueEmail);
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 3 (mismatch)
        await page.FillAsync("input[name='password']", "Test1234");
        await page.FillAsync("input[name='confirmPassword']", "Wrong1234");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Vänta på feltext 
        var error = page.GetByText("Lösenorden matchar inte", new() { Exact = false });
        await error.WaitForAsync(new() { Timeout = 15000 });

        // Ska inte ha gått vidare till activity
        Assert.DoesNotContain("/activity", page.Url);

        // Ska inte ha gått vidare till steg 4 (city ska inte finnas)
        var cityCount = await page.Locator("select[name='city']").CountAsync();
        Assert.Equal(0, cityCount);
    }

    [Fact]
    public async Task Registration_should_fail_when_email_already_exists()
    {
        var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL") ?? "http://localhost:5173";
        var isCi = string.Equals(Environment.GetEnvironmentVariable("CI"), "true", StringComparison.OrdinalIgnoreCase);

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(
            new BrowserTypeLaunchOptions { Headless = isCi }
        );

        var duplicateEmail = $"duplicate+{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}@mail.com";

        // 1) Första registreringen (ska lyckas)
        {
            var context1 = await browser.NewContextAsync();
            var page1 = await context1.NewPageAsync();

            await page1.GotoAsync($"{baseUrl}/register");
            await page1.Locator("input[name='firstName']").WaitForAsync(new() { Timeout = 15000 });

            // Steg 1
            await page1.FillAsync("input[name='firstName']", "Test");
            await page1.FillAsync("input[name='lastName']", "User");
            await page1.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 2
            await page1.FillAsync("input[name='email']", duplicateEmail);
            await page1.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 3
            await page1.FillAsync("input[name='password']", "Test1234");
            await page1.FillAsync("input[name='confirmPassword']", "Test1234");
            await page1.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 4
            await page1.Locator("select[name='city']").WaitForAsync(new() { Timeout = 15000 });
            await page1.WaitForFunctionAsync("() => document.querySelector(\"select[name='city']\")?.options.length > 1");

            await page1.SelectOptionAsync("select[name='city']", "Stockholm");
            await page1.FillAsync("input[name='dateOfBirth']", "1995-05-20");
            await page1.SelectOptionAsync("select[name='gender']", "0");
            await page1.CheckAsync("#termsAccepted");
            await page1.CheckAsync("#privacyAccepted");

           await page1.Locator("button:has-text('REGISTRERA')").ClickAsync();
           await page1.WaitForURLAsync("**/activity**", new() { Timeout = 60000 });

            await context1.CloseAsync();
        }

        // 2) Andra registreringen med samma email (ska FAILA)
        {
            var context2 = await browser.NewContextAsync();
            var page2 = await context2.NewPageAsync();

            await page2.GotoAsync($"{baseUrl}/register");
            await page2.Locator("input[name='firstName']").WaitForAsync(new() { Timeout = 15000 });

            // Steg 1
            await page2.FillAsync("input[name='firstName']", "Test");
            await page2.FillAsync("input[name='lastName']", "User");
            await page2.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 2
            await page2.FillAsync("input[name='email']", duplicateEmail);
            await page2.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 3
            await page2.FillAsync("input[name='password']", "Test1234");
            await page2.FillAsync("input[name='confirmPassword']", "Test1234");
            await page2.ClickAsync("button:has-text('FORTSÄTT')");

            // Steg 4
            await page2.Locator("select[name='city']").WaitForAsync(new() { Timeout = 15000 });
            await page2.WaitForFunctionAsync("() => document.querySelector(\"select[name='city']\")?.options.length > 1");

            await page2.SelectOptionAsync("select[name='city']", "Stockholm");
            await page2.FillAsync("input[name='dateOfBirth']", "1995-05-20");
            await page2.SelectOptionAsync("select[name='gender']", "0");
            await page2.CheckAsync("#termsAccepted");
            await page2.CheckAsync("#privacyAccepted");

            await page2.Locator("button:has-text('REGISTRERA')").ClickAsync();

            var error = page2.GetByText("Email already exists", new() { Exact = false });
            await error.WaitForAsync(new() { Timeout = 20000 });

            Assert.DoesNotContain("/activity", page2.Url);

            await context2.CloseAsync();
        }
        
    }
    [Fact]
    public async Task Registration_should_fail_when_user_is_under_18()
    {
        var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL") ?? "http://localhost:5173";
        var isCi = string.Equals(Environment.GetEnvironmentVariable("CI"), "true", StringComparison.OrdinalIgnoreCase);

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(
            new BrowserTypeLaunchOptions { Headless = isCi }
        );

        var page = await browser.NewPageAsync();
        await page.GotoAsync($"{baseUrl}/register");

        await page.Locator("input[name='firstName']").WaitForAsync(new() { Timeout = 15000 });

        // Steg 1
        await page.FillAsync("input[name='firstName']", "Young");
        await page.FillAsync("input[name='lastName']", "User");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 2
        var email = $"young+{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}@mail.com";
        await page.FillAsync("input[name='email']", email);
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 3
        await page.FillAsync("input[name='password']", "Test1234");
        await page.FillAsync("input[name='confirmPassword']", "Test1234");
        await page.ClickAsync("button:has-text('FORTSÄTT')");

        // Steg 4 – under 18
        await page.Locator("select[name='city']").WaitForAsync(new() { Timeout = 15000 });
        await page.WaitForFunctionAsync("() => document.querySelector(\"select[name='city']\")?.options.length > 1");

        await page.SelectOptionAsync("select[name='city']", "Stockholm");
        await page.FillAsync("input[name='dateOfBirth']", "2012-01-01");
        await page.SelectOptionAsync("select[name='gender']", "0");

        await page.CheckAsync("#termsAccepted");
        await page.CheckAsync("#privacyAccepted");

        await page.ClickAsync("button:has-text('REGISTRERA')");

        // Felmeddelande från MinimumAgeAttribute
        var error = page.GetByText("Du måste vara minst 18 år för att bli medlem", new() { Exact = false });
        await error.WaitForAsync(new() { Timeout = 15000 });

        Assert.DoesNotContain("/activity", page.Url);
    }

}
