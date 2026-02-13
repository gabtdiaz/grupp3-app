// using System;
// using System.Threading.Tasks;
// using Microsoft.Playwright;
// using Xunit;

// namespace FriendZone.E2E.Tests.Tests
// {
//     public class CreateEventE2ETest
//     {
//         [Fact]
//         public async Task User_can_create_activity_and_be_redirected_to_activity()
//         {
//             var baseUrl = Environment.GetEnvironmentVariable("E2E_BASE_URL")
//                           ?? "http://localhost:5173";

//             var isCi = string.Equals(
//                 Environment.GetEnvironmentVariable("CI"),
//                 "true",
//                 StringComparison.OrdinalIgnoreCase
//             );

//             var testEmail = Environment.GetEnvironmentVariable("E2E_TEST_EMAIL2")
//                             ?? throw new InvalidOperationException("Saknar E2E_TEST_EMAIL env-var.");

//             var testPassword = Environment.GetEnvironmentVariable("E2E_TEST_PASSWORD2")
//                                ?? throw new InvalidOperationException("Saknar E2E_TEST_PASSWORD env-var.");

//             using var playwright = await Playwright.CreateAsync();
//             await using var browser = await playwright.Chromium.LaunchAsync(
//                 new BrowserTypeLaunchOptions { Headless = isCi }
//             );

//             var page = await browser.NewPageAsync();

//             // 1) Logga in
//             await page.GotoAsync($"{baseUrl}/login");
//             await page.Locator("input[type='email']").WaitForAsync(new() { Timeout = 15000 });

//             await page.FillAsync("input[type='email']", testEmail);
//             await page.FillAsync("input[type='password']", testPassword);
//             await page.ClickAsync("button:has-text('LOGGA IN')");

//             await page.WaitForURLAsync("**/activity**", new() { Timeout = 60000 });

//             var heading = page.GetByRole(AriaRole.Heading, new() { Name = "AKTIVITETER" });
//             await heading.WaitForAsync(new() { Timeout = 60000 });

//             // 2) Gå till create
//             // await page.GetByAltText("Create event").ClickAsync(); // Fungerar inte, kanske pga att det är en svg?
//             await page.Locator("button:has(img[alt='Create event'])").ClickAsync();
//             await page.WaitForURLAsync("**/activity/create**", new() { Timeout = 15000 });

//             // 3) Unik titel
//             var uniqueTitle = $"E2E Activity {DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

//             await page.FillAsync("input[name='title']", uniqueTitle);
//             await page.FillAsync("textarea[name='description']", "Skapa E2E-tester med varandra :).");

//             var citySelect = page.Locator("select[name='city']");
//             await citySelect.WaitForAsync(new() { Timeout = 15000 });
//             await page.WaitForFunctionAsync(
//                 "() => document.querySelector(\"select[name='city']\")?.options.length > 1"
//             );
//             await citySelect.SelectOptionAsync(new SelectOptionValue { Index = 1 });

//             var futureDate= DateTime.UtcNow.AddDays(30).ToString("yyyy-MM-dd");
//             await page.FillAsync("input[name='startDate']", futureDate);
//             await page.FillAsync("input[name='startTime']", "18:00");
//             await page.FillAsync("input[name='maxParticipants']", "10");
//             await page.FillAsync("input[name='minimumAge']", "18");

//             // 4) Vänta på POST /api/events 
//             var createResponseTask = page.WaitForResponseAsync(resp =>
//                 resp.Request.Method == "POST" &&
//                 resp.Url.Contains("/api/events"),
//                 new() { Timeout = 60000 }
//             );

//             await page.ClickAsync("button[type='submit']:has-text('Skapa Activity')");

//             // 6) Läs responsen och acceptera 200/201/204
//             var createResponse = await createResponseTask;

//             Console.WriteLine($"CreateEvent status: {createResponse.Status}");

//             Assert.True(
//                 createResponse.Status == 200 ||
//                 createResponse.Status == 201 ||
//                 createResponse.Status == 204,
//                 $"CreateEvent misslyckades. Status: {createResponse.Status}"
//             );
//         }
//     }
// }
