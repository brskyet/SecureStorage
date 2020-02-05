using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Data
{
    public class User
    {
        public Guid UserId { set; get; }
        public string Login { set; get; }
        public string Password { set; get; }
        public int Age { set; get; }
    }
}
