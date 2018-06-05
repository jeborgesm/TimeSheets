using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Time.Data;

namespace TimeTrack.Controllers
{
    public class HomeController : Controller
    {
        private ITimeRepository _repository;

        public HomeController() : this(new TimeRepository())
        {
        }

        public HomeController(ITimeRepository repository)
        {
            _repository = repository;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Calendar()
        {
            ViewData["Clients"] = _repository.ListAllClients();
            ViewData["Products"] = _repository.ListAllProducts();
            ViewData["Proyects"] = _repository.ListAllProyects();
            ViewData["Services"] = _repository.ListAllServices();

            return View();
        }
    }
}