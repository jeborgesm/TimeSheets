using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Time.Data;

namespace TimeTrack.Models
{
    public class Admin
    {
        public IEnumerable<Client> Clients { get; set; }
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<Proyect> Proyects { get; set; }
        public IEnumerable<Resource> Resources { get; set; }

        public Admin()
        {
            Time.Data.TimeRepository repo = new TimeRepository();
            Clients = repo.ListAllClients();
            Products = repo.ListAllProducts();
            Proyects = repo.ListAllProyects();
            Resources = repo.ListAllResources();
        }
    }
}