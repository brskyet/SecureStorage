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
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using SecureStorage.Data;
using SecureStorage.Models;
using SecureStorage.Services;
using System.Security.Cryptography;
using System.Text;
using SecureStorage.Interfaces;

namespace SecureStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILogin _login;

        public LoginController(ILogin login)
        {
            _login = login;
        }

        [HttpPost("Signup")]
        public IActionResult Signup([FromBody] SignupModel user)
        {
            if (!ModelState.IsValid)
                return BadRequest("An error was detected.");
            try
            {
                _login.AddAccount(user);
                return Ok("Registered successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<string> Post(LoginModel authRequest)
        {
            try
            {
                var jwtToken = _login.GetToken(authRequest);
                HttpContext.Response.Cookies.Append(".AspNetCore.Application.Id", jwtToken,
                    new CookieOptions
                    {
                        Secure = true,
                        HttpOnly = true,
                        MaxAge = TimeSpan.FromMinutes(15)
                    }
                );
                return jwtToken;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}