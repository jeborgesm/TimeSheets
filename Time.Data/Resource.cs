using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Time.Data
{
    public class Resource
    {
        public Int32 id { get; set; }
        public string strName { get; set; }
        public string strLastname { get; set; }
        public Guid? userGuid { get; set; }

        //public IEnumerable<Task> Tasks { get; set;}
        //[ForeignKey("Tasks")]
        //public Int32? Task_id { get; set; }

        //public IEnumerable<Proyect> Proyects { get; set; }
        //[ForeignKey("Proyects")]
        //public Int32? Proyect_id { get; set; }
    }
}