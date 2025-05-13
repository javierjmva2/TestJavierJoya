using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Interfaces;

namespace TestJavierJoya.Application.Services
{

    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;

        public AuthenticationService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null) return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return isValid ? user : null;
        }
    }
}
