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

namespace SecureStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IDataProtector _protector;

        public AccountController(ApplicationDBContext context, IMapper mapper, IDataProtectionProvider provider)
        {
            _context = context;
            _mapper = mapper;
            _protector = provider.CreateProtector("DataProtection");
        }

        [HttpGet("GetAccounts")]
        public IActionResult GetAccounts()
        {
            try
            {
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (username != null)
                {
                    if (!_context.Users.Any(x => x.Username == username))
                        return BadRequest("Username is not valid.");
                    var model = _context.Users
                        .Include(user => user.Categories)
                        .ThenInclude(category => category.Accounts)
                        .First(x => x.Username == username).Categories;
                    foreach (var c in model)
                    {
                        c.CategoryName = _protector.Unprotect(c.CategoryName);
                        foreach(var a in c.Accounts)
                        {
                            a.Title = _protector.Unprotect(a.Title);
                            a.Username = _protector.Unprotect(a.Username);
                            a.Password = _protector.Unprotect(a.Password);
                        }
                    }
                    var response = _mapper.Map<List<CategoryDto>>(model);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("No username was specified.");
                }
            }
            catch
            {
                return BadRequest("An error was detected.");
            }
        }

        [HttpPost("UpdateAccounts")]
        public IActionResult UpdateAccounts([FromBody] List<CategoryDto> categoriesDto)
        {
            try
            {
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (username != null)
                {
                    if (!_context.Users.Any(x => x.Username == username))
                        return BadRequest("Username is not valid.");
                    var model = _context.Users.First(x => x.Username == username);
                    var categories = _mapper.Map<List<Category>>(categoriesDto);
                    model.Categories = categories;
                    foreach (var c in model.Categories)
                    {
                        c.CategoryName = _protector.Protect(c.CategoryName);
                        foreach (var a in c.Accounts)
                        {
                            a.Title = _protector.Protect(a.Title);
                            a.Username = _protector.Protect(a.Username);
                            a.Password = _protector.Protect(a.Password);
                        }
                    }
                    _context.Update(model);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("No username was specified.");
                }
            }
            catch
            {
                return BadRequest("An error was detected.");
            }
        }
    }
}
