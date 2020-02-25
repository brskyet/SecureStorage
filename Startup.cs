using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SecureStorage.Data;
using SecureStorage.Services;
using System;

namespace SecureStorage
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);

            const string signingSecurityKey = "0d5b3235a8b403c3dab9c3f4f65c07fcalskd234n1k41230"; //TODO: помен€ть ключ.
            var signingKey = new SigningSymmetricKey(signingSecurityKey);
            services.AddSingleton<IJwtSigningEncodingKey>(signingKey);

            var signingDecodingKey = (IJwtSigningDecodingKey)signingKey;
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, jwtBearerOptions =>
                {
                    jwtBearerOptions.RequireHttpsMetadata = true;
                    jwtBearerOptions.SaveToken = true;
                    jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = signingDecodingKey.GetKey(),

                        ValidateIssuer = true,
                        ValidIssuer = "SecureStorage",

                        ValidateAudience = true,
                        ValidAudience = "secure_storage",

                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.FromSeconds(5)
                    };
                });

            services.AddCors();

            services.AddDbContext<ApplicationDBContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("ConnectionName")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.Use(async (context, next) =>
            {
                var token = context.Request.Cookies[".AspNetCore.Application.Id"]; // Ќеприметное название дл€ куки
                if (!string.IsNullOrEmpty(token))
                    context.Request.Headers.Add("Authorization", "Bearer " + token);

                await next(); // TODO: разобратьс€ со всем кодом, который не до конца понимаю
            });

            app.UseCookiePolicy(new CookiePolicyOptions
            {
                MinimumSameSitePolicy = SameSiteMode.Strict,
                HttpOnly = HttpOnlyPolicy.Always,
                Secure = CookieSecurePolicy.Always
            });
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseCors(x => x
                .WithOrigins("https://localhost:44350") // TODO: ”брать жесткую прив€зку к адресу.
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
