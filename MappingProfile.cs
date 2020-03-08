using AutoMapper;
using SecureStorage.Data;
using SecureStorage.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureStorage
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<SignupModel, User>();
            CreateMap<AccountDto, Account>();
            CreateMap<CategoryDto, Category>();
            CreateMap<UserDto, User>();
            
            CreateMap<Account, AccountDto>();
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Accounts, opt => opt.MapFrom(src => src.Accounts));
            CreateMap<User, UserDto>()
                 .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories));
        }
    }
}
