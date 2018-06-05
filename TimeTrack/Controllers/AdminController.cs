using System.Web.Mvc;
using Time.Data;

namespace TimeTrack.Controllers
{
    public class AdminController : Controller
    {
        private ITimeRepository _repository;

        public AdminController() : this(new TimeRepository())
        {
        }

        public AdminController(ITimeRepository repository)
        {
            _repository = repository;
        }

        public ActionResult Index()
        {
            return View();
        }

    }
}