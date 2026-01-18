using grupp3_app.Api.Models;

namespace grupp3_app.Api.Services;

public interface ITokenService
{
    string CreateToken(User user);
}