using System.Data.Entity;

namespace Time.Data
{
    public class TimeRegistryDataContext : DbContext
    {
        public TimeRegistryDataContext() : base()
        {
        }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Proyect> Proyects { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Task> Tasks { get; set; }
    }
}

