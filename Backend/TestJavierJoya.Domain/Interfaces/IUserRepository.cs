using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task AddAsync(User user);
    }
}
