using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Не указан логин.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Не указан пароль.")]
        public string Password { get; set; }
    }
}
