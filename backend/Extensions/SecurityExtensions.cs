namespace grupp3_app.Api.Extensions;

public static class SecurityExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        // Prevents MIME-sniffing (disallows browser from guessing file type)
        app.UseXContentTypeOptions();
        
        // Prevents clickjacking
        app.UseXfo(options => options.Deny());
        
        // Enables XSS filter (blocks page if attack is discovered)
        app.UseXXssProtection(options => options.EnabledWithBlockMode());
        
        // Controls referrer information (prevents information leakage)
        app.UseReferrerPolicy(options => options.NoReferrer());

        return app;
    }
}