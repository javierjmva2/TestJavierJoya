using Microsoft.AspNetCore.Mvc;
using TestJavierJoya.API.Middleware;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Models;

namespace TestJavierJoya.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly ITokenService _tokenService;
        public LoginController(IAuthenticationService authService, ITokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.AuthenticateAsync(request.Username, request.Password);
            if (user == null)
                return Unauthorized("Usuario o contraseña inválidos");

            var token = _tokenService.GenerateToken(user);
            return Ok(new { token });
        }
    }
}
