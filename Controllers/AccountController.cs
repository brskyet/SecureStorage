using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using SecureStorage.Data;
using SecureStorage.Models;
using Microsoft.AspNetCore.DataProtection;
using SecureStorage.Interfaces;

namespace SecureStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly IAccounts _accounts;

        public AccountController(IAccounts accounts)
        {
            _accounts = accounts;
        }

        [HttpGet("GetAccounts")]
        public IActionResult GetAccounts()
        {
            try
            {
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (string.IsNullOrEmpty(username))
                    return BadRequest("No username was specified.");

                return Ok(_accounts.GetAccount(username));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UpdateAccounts")]
        public IActionResult UpdateAccounts([FromBody] List<CategoryDto> categoriesDto)
        {
            try
            {
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (string.IsNullOrEmpty(username))
                    return BadRequest("No username was specified.");

                _accounts.UpdateAccount(categoriesDto, username);
                return Ok();
            }
            catch
            {
                return BadRequest("An error was detected.");
            }
        }
    }
}
