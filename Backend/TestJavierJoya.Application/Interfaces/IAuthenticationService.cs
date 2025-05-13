using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Application.Interfaces
{
    public interface IAuthenticationService
    {
        Task<User?> AuthenticateAsync(string username, string password);
    }
}
