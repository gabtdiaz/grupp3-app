using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using grupp3_app.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace grupp3_app.Api.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string CreateToken(User user)
    {

        // TODO: TokenKey är hårdkodad i appsettings.json för development
        // I produktion: Flytta till Azure Key Vault eller miljövariabler

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        // Skapa krypteringsnyckel och signeringscredentials
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:TokenKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };

        // Skapa och returnera token
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}