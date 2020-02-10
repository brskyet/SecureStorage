using Microsoft.EntityFrameworkCore;

namespace SecureStorage.Data
{
    public class ApplicationDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Storage.db");
        }
    }
}
