using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using SecureStorage.Data;
using SecureStorage.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Interfaces
{
    public interface IAccounts
    {
        List<CategoryDto> GetAccount(string username);
        void UpdateAccount(List<CategoryDto> categories, string username);
    }
}
