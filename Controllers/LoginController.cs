using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SecureStorage.Data;
using SecureStorage.Models;
using SecureStorage.Services;

namespace SecureStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public LoginController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("Signup")]
        public IActionResult Signup([FromBody] SignupModel usr)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var model = _mapper.Map<User>(usr);
                    bool userExist = _context.Users.Any(x => x.Username == model.Username);
                    bool emailExist = _context.Users.Any(x => x.Email == model.Email);
                    if (userExist == false && emailExist == false)
                    {
                        _context.Add(model);
                        _context.SaveChanges();
                        return Ok("Registered successfully!");
                    }
                    else
                    {
                        return BadRequest(emailExist == true ? "Email is already in use." : "Username is already in use.");
                    }
                }
                catch
                {
                    return BadRequest("An error was detected.");
                }
            }
            else
            {
                return BadRequest("An error was detected.");
            }
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<string> Post(LoginModel authRequest, [FromServices] IJwtSigningEncodingKey signingEncodingKey)
        {
            // Проверяем данные пользователя из запроса.
            bool userExist = _context.Users.Any(x => x.Username == authRequest.Username && x.Password == authRequest.Password);

            if (userExist == false)
                return BadRequest("Enter valid username and password.");

            // Создаем утверждения для токена.
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, authRequest.Username)
            };

            // Генерируем JWT.
            var token = new JwtSecurityToken(
                issuer: "SecureStorage",
                audience: "secure_storage",
                claims: claims,
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: new SigningCredentials(
                        signingEncodingKey.GetKey(),
                        signingEncodingKey.SigningAlgorithm)
            );

            string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
            HttpContext.Response.Cookies.Append(".AspNetCore.Application.Id", jwtToken,
                new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    MaxAge = TimeSpan.FromMinutes(1)
                }
            );
            return jwtToken;
        }
    }
}