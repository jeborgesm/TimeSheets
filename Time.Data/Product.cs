using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Time.Data
{
    public class Product
    {
        public Int32 id { get; set; }
        public String strTitle { get; set; }
        public Client Client { get; set; }
        [ForeignKey("Client")]
        public Int32? Client_id { get; set; }
    }
}