using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using SecureStorage.Data;
using SecureStorage.Interfaces;
using SecureStorage.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Services
{
    public class Accounts : IAccounts
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IDataProtector _protector;
        public Accounts(ApplicationDBContext context, IMapper mapper, IDataProtectionProvider provider)
        {
            _context = context;
            _mapper = mapper;
            _protector = provider.CreateProtector("DataProtection");
        }
        public List<CategoryDto> GetAccount(string username)
        {
            if (!_context.Users.Any(x => x.Username == username))
                throw new Exception("Username is not valid.");
            var model = _context.Categories
                .Include(user => user.User)
                .Include(user => user.Accounts)
                .Where(w => w.User.Username == username);
            foreach (var c in model)
            {
                c.CategoryName = _protector.Unprotect(c.CategoryName);
                foreach (var a in c.Accounts)
                {
                    a.Title = _protector.Unprotect(a.Title);
                    a.Username = _protector.Unprotect(a.Username);
                    a.Password = _protector.Unprotect(a.Password);
                }
            }
            return _mapper.Map<List<CategoryDto>>(model);
        }

        public void UpdateAccount(List<CategoryDto> categoriesDto, string username)
        {
            if (!_context.Users.Any(x => x.Username == username))
                throw new Exception("Username is not valid.");
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
        }
    }
}
