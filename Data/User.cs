using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Data
{
    public class User
    {
        public Guid UserId { set; get; }
        public string Username { set; get; }
        public string Email { set; get; }
        public string Password { set; get; }
        public string Salt { set; get; }
        public List<Category> Categories { set; get; }
    }

    public class Category
    {
        public Guid CategoryId { set; get; }
        public string CategoryName { set; get; }
        public User User { set; get; }
        public List<Account> Accounts { set; get; }
    }

    public class Account
    {
        public Guid AccountId { set; get; }
        public string Title { set; get; }
        public string Username { set; get; }
        public string Password { set; get; }
        public Category Category { set; get; }
    }
}
