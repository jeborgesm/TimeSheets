using System.Collections.Generic;
using System.Web.Mvc;
using TimeTrack.Models;

namespace TimeTrack.Controllers
{
    public class AdminController : Controller
    {
        //private ITimeRepository _repository;

        //public AdminController() : this(new TimeRepository())
        //{
        //}

        //public AdminController(ITimeRepository repository)
        //{
        //    _repository = repository;
        //}

        public ActionResult Index()
        {
            Admin model = TimeTrack.Models.Admin.GetAllItems();
            return View(model);
        }

    }
}