using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage.Models
{
    public class UserModel
    {
        [Required (ErrorMessage = "Не указан логин.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Длина строки должна быть от 3 до 50 символов")]
        public string Login { set; get; }
        [Required (ErrorMessage = "Не указан Email.")]
        [EmailAddress(ErrorMessage = "Некорректный адрес")]
        public string Email { set; get; }
        [Required(ErrorMessage = "Не указан пароль.")]
        public string Password { set; get; }
        [Required(ErrorMessage = "Не указан пароль.")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { set; get; }
        //[Range(1, 110, ErrorMessage = "Недопустимый возраст")]
        //public int Age { set; get; }
    }
}
