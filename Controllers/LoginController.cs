using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SecureStorage.Data;
using SecureStorage.Models;

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

        [HttpPost("Registration")]
        public IActionResult Registration([FromBody] UserModel usr)
        {
            if(ModelState.IsValid)
            {
                try
                {
                    var model = _mapper.Map<User>(usr);
                    _context.Add(model);
                    _context.SaveChanges();
                    return Ok("Registered successfully!");
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
    }
}