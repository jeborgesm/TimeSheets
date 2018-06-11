using System.Collections.Generic;
using System.Web.Mvc;
using TimeTrack.Models;

namespace TimeTrack.Controllers
{
    public class AdminController : Controller
    {
        private Admin _admin;

        public AdminController() : this(new Admin())
        {
        }

        public AdminController(Admin admin)
        {
            _admin = admin;
        }

        public ActionResult Index()
        {
            return View(_admin);
        }

    }
}