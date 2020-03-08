using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Models
{
    public class UserDto
    {
        public string Username { set; get; }
        public List<CategoryDto> Categories { set; get; }
    }

    public class CategoryDto
    {
        public string CategoryName { set; get; }
        public List<AccountDto> Accounts { set; get; }
    }

    public class AccountDto
    {
        public string Title { set; get; }
        public string Username { set; get; }
        public string Password { set; get; }
    }
}
