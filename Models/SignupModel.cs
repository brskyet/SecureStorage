using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Models
{
    public class SignupModel
    {
        [Required (ErrorMessage = "Не указан логин.")]
        [RegularExpression("^[a-zA-Z0-9_]{3,18}$", ErrorMessage = "Псевдоним пользователя не соответствует требованиям.")]
        public string Username { set; get; }
        [Required (ErrorMessage = "Не указан Email.")]
        [EmailAddress(ErrorMessage = "Некорректный Email-адрес")]
        public string Email { set; get; }
        [Required(ErrorMessage = "Не указан пароль.")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*#?&_]{8,50}$", ErrorMessage = "Пароль не соответствует требованиям.")]
        public string Password { set; get; }
    }
}
