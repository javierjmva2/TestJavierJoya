using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
