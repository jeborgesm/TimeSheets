using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Time.Data
{
    public class Proyect
    {
        [Key]
        [Required]
        public Int32 id { get; set; }
        public String strTitle { get; set; }
        public DateTime? dtStartDate { get; set; }
        public DateTime? dtEndDate { get; set; }

        //private System.Nullable<int> _id_Capital_Proyects { get; set; }
        //private Capital_Proyect Capital_Proyect { get; set; }

        public virtual Product Product { get; set; }
        [ForeignKey("Product")]
        public Int32? Product_id { get; set; }

        public virtual Resource Resource { get; set; }
        [ForeignKey("Resource")]
        public Int32? Resource_id { get; set; }
    }
}