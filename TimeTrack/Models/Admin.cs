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
        public IEnumerable<Resource> Resources { get; set; }

        public static Admin GetAllItems()
        {
            Time.Data.TimeRepository repo = new TimeRepository();
            Admin adm = new Admin
            {
                Clients = repo.ListAllClients()
            };
            return adm;
        }
    }
}