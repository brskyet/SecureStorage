using SecureStorage.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Interfaces
{
    public interface ILogin
    {
        void AddAccount(SignupModel user);
        string GetToken(LoginModel authRequest);
    }
}
