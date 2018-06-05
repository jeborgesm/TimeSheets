using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Time.Data
{
    public class Task
    {
        [Key]
        [Required]
        public Int32 id { get; set; }
        public String strTitle { get; set; }
        public String strComment { get; set; }
        public DateTime dtStartDate { get; set; }
        public DateTime dtEndDate { get; set; }
        public DateTime dtCreation { get; set; }
        public DateTime? dtLastModification { get; set; }
        
        public Proyect Proyect {get; set;}
        [ForeignKey("Proyect")]
        public Int32? Proyect_id { get; set; }

        public Service Service { get; set; }
        [ForeignKey("Service")]
        public Int32? Service_id { get; set; }

        public Resource Resource { get; set; }
        [ForeignKey("Resource")]
        public Int32? Resource_id { get; set; }

    }
}