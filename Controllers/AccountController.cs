﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureStorage.Data;
using SecureStorage.Models;

namespace SecureStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public AccountController(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetAccounts")]
        public IActionResult GetAccounts()
        {
            try
            {
                //var model1 = _context.Users.First(x => x.Username == username);
                //model1.Categories = new List<Category>()
                //{
                //    new Category()
                //    {
                //        CategoryName = "games", Accounts = new List<Account>()
                //        {
                //            new Account()
                //            {
                //                Title = "wow", Username = "test1", Password = "test1"
                //            },
                //            new Account()
                //            {
                //                Title = "ff14", Username = "test2", Password = "test2"
                //            }
                //        }
                //    }
                //};
                //_context.Update(model1);
                //_context.SaveChanges();
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (username != null)
                {
                    if (!_context.Users.Any(x => x.Username == username))
                        return BadRequest("Username is not valid.");
                    var model = _context.Users
                        .Include(user => user.Categories)
                        .ThenInclude(category => category.Accounts)
                        .First(x => x.Username == username).Categories;
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
        public IActionResult UpdateAccounts([FromBody] List<CategoryDto> lst)
        {
            try
            {
                string username = HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
                if (username != null)
                {

                    if (!_context.Users.Any(x => x.Username == username))
                        return BadRequest("Username is not valid.");

                    var usr = new UserDto { Categories = lst, Username = username };
                    var model = _mapper.Map<User>(usr);
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
