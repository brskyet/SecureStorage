using AutoMapper;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using SecureStorage.Data;
using SecureStorage.Interfaces;
using SecureStorage.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace SecureStorage.Services
{
    public class Login : ILogin
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtSigningEncodingKey _signingEncodingKey;

        public Login(ApplicationDBContext context, IMapper mapper, IJwtSigningEncodingKey signingEncodingKey)
        {
            _context = context;
            _mapper = mapper;
            _signingEncodingKey = signingEncodingKey;
        }

        public void AddAccount(SignupModel user)
        {
            var model = _mapper.Map<User>(user);
            bool userExist = _context.Users.Any(x => x.Username == model.Username);
            bool emailExist = _context.Users.Any(x => x.Email == model.Email);
            if (userExist == true || emailExist == true)
                throw new Exception(emailExist == true ? "Email is already in use." : "Username is already in use.");

            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            model.Salt = Convert.ToBase64String(salt);

            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: model.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 16));

            model.Password = hashedPassword;
            _context.Add(model);
            _context.SaveChanges();
        }

        public string GetToken(LoginModel authRequest)
        {
            // Check if user is exist
            User user = _context.Users.FirstOrDefault(x => x.Username == authRequest.Username);
            if (user == null)
                throw new Exception("Enter valid username and password.");
            // Check if auth data are valid
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: authRequest.Password,
                salt: Convert.FromBase64String(user.Salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 16));
            bool userExist = _context.Users.Any(x => x.Username == authRequest.Username && x.Password == hashedPassword);
            if (userExist == false)
                throw new Exception("Enter valid username and password.");

            // Create claims for token
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, authRequest.Username)
            };

            // Generate JWT
            var token = new JwtSecurityToken(
                issuer: "SecureStorage",
                audience: "secure_storage",
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: new SigningCredentials(
                        _signingEncodingKey.GetKey(),
                        _signingEncodingKey.SigningAlgorithm)
            );

            string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
            return jwtToken;
        }
    }
}
