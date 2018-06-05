using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
//using System.Web.Http;
using System.Web.Mvc;
using System.Web.Security;
using Time.Data;

namespace TimeTrack.Controllers
{
    public class ScheduleController : Controller
    {
        private ITimeRepository _repository;

        public ScheduleController() : this(new TimeRepository())
        {
        }

        public ScheduleController(ITimeRepository repository)
        {
            _repository = repository;
        }

        //
        // POST: /Home/saveEventData
        [HttpPost]
        public ActionResult saveEventData()
        {
            string start = Request.Form["start"];
            string end = Request.Form["end"];
            string title = Request.Form["title"];
            string body = Request.Form["body"];

            int client = Convert.ToInt32(Request.Form["client"]);
            int project = Convert.ToInt32(Request.Form["project"]);
            int product = Convert.ToInt32(Request.Form["product"]);
            int service = Convert.ToInt32(Request.Form["service"]);

            Task tsk = new Task();

            tsk.dtStartDate = Convert.ToDateTime(start);
            tsk.dtEndDate = Convert.ToDateTime(end);
            tsk.dtCreation = DateTime.Now;
            tsk.strTitle = title;
            tsk.strComment = body;

            tsk.Proyect_id = project;
            tsk.Service_id = service;
            tsk.Resource_id = getUserbyName(User.Identity.Name);


            // Add Items to Repository
            _repository.Add(tsk);

            // Persist Changes
            _repository.Save();

            return null;
        }

        //
        // POST: /Home/updateEventData/5
        [HttpPost]
        public ActionResult updateEventData(int id)
        {
            string start = Request.Form["start"];
            string end = Request.Form["end"];
            string title = Request.Form["title"];
            string body = Request.Form["body"];

            int client = Convert.ToInt32(Request.Form["client"]);
            int project = Convert.ToInt32(Request.Form["project"]);
            int product = Convert.ToInt32(Request.Form["product"]);
            int service = Convert.ToInt32(Request.Form["service"]);

            Task tsk = _repository.GetTask(id);

            tsk.dtStartDate = Convert.ToDateTime(start);
            tsk.dtEndDate = Convert.ToDateTime(end);
            tsk.dtCreation = DateTime.Now;
            tsk.strTitle = title;
            tsk.strComment = body;

            tsk.Proyect_id = project;
            tsk.Service_id = service;
            tsk.Resource_id = getUserbyName(User.Identity.Name);

            // Persist Changes
            _repository.Save();

            return null;
        }


        public ActionResult getEventData(string id)
        {
            IList<Task> tasks = _repository.ListAllTasksbyUser(getUserbyName(User.Identity.Name));

            string startdate = "";
            string enddate = "";

            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                writer.Formatting = Formatting.Indented;

                writer.WriteStartObject();                                      //  {
                writer.WritePropertyName("events");                                   //      "events" : 
                writer.WriteStartArray();                                       //          [ 

                foreach (Task task in tasks)
                {
                    startdate = String.Format("{0:s}", task.dtStartDate);
                    enddate = String.Format("{0:s}", task.dtEndDate);

                    string client = task.Proyect.Product.Client_id.ToString();
                    string project = task.Proyect_id.ToString();
                    string product = task.Proyect.Product_id.ToString();
                    string service = task.Service_id.ToString();

                    WriteJsonArrayItem(writer, task.id.ToString(), startdate, enddate, task.strTitle, task.strComment, client, project, product, service);
                }

                writer.WriteEndArray();                                         //          ]
                writer.WriteEndObject();                                        //  }
            }

            return Content(sw.ToString());
            //return Content("{events: [{'id':1, 'start':'2018-06-04T13:15:00.000+10:00', 'end':'2018-06-04T14:15:00.000+10:00', 'title':'Lunch with Mike'}]}");
        }

        //
        // POST: /Home/deleteEventData/5
        [HttpPost]
        public ActionResult deleteEventData(int id)
        {
            Task tsk = _repository.GetTask(id);

            _repository.Delete(tsk);

            // Persist Changes
            _repository.Save();

            return null;
        }
        //
        // POST: /Home/lastweekEventData
        [HttpPost]
        public ActionResult lastweekEventData(FormCollection collection)
        {
            string start = collection["start"];
            string end = collection["end"];
            string title = collection["title"];
            string body = collection["body"];

            int client = Convert.ToInt32(collection["client"]);
            int project = Convert.ToInt32(collection["project"]);
            int product = Convert.ToInt32(collection["product"]);
            int service = Convert.ToInt32(collection["service"]);

            //int prod_proj = _repository.GetProduct_ProjectbyID(product, project).id;

            Task tsk = new Task();

            /////////////////////////////////////////
            start = start.Replace("UTC", "GMT");//.Trim().Substring(0,start.Length-3);
            end = end.Replace("UTC", "GMT");//.Trim().Substring(0, end.Length - 3);
            /////////////////////////////////////////

            string taskdate = Convert.ToDateTime(start).AddDays(-7).ToLongDateString();
            string starttime = Convert.ToDateTime(start).ToLongTimeString();
            string endtime = Convert.ToDateTime(end).ToLongTimeString();

            tsk.dtStartDate = Convert.ToDateTime(taskdate + " " + starttime);//start);//.AddHours(-4);
            tsk.dtEndDate = Convert.ToDateTime(taskdate + " " + endtime);//.AddHours (-4);
            tsk.dtCreation = DateTime.Now;
            tsk.strTitle = title;
            tsk.strComment = body;

            //tsk.id_Product_Project = prod_proj;
            tsk.Service_id = service;
            tsk.Resource_id = getUserbyName(User.Identity.Name);


            // Add Items to Repository
            _repository.Add(tsk);

            // Persist Changes
            _repository.Save();

            return null;
        }

        //
        // POST: /Home/nextweekEventData
        [HttpPost]
        public ActionResult nextweekEventData(FormCollection collection)
        {
            string start = collection["start"];
            string end = collection["end"];
            string title = collection["title"];
            string body = collection["body"];

            int client = Convert.ToInt32(collection["client"]);
            int project = Convert.ToInt32(collection["project"]);
            int product = Convert.ToInt32(collection["product"]);
            int service = Convert.ToInt32(collection["service"]);

            //int prod_proj = _repository.GetProduct_ProjectbyID(product, project).id;

            Task tsk = new Task();

            /////////////////////////////////////////
            start = start.Replace("UTC", "GMT");//.Trim().Substring(0,start.Length-3);
            end = end.Replace("UTC", "GMT");//.Trim().Substring(0, end.Length - 3);
            /////////////////////////////////////////

            string taskdate = Convert.ToDateTime(start).AddDays(7).ToLongDateString();
            string starttime = Convert.ToDateTime(start).ToLongTimeString();
            string endtime = Convert.ToDateTime(end).ToLongTimeString();

            tsk.dtStartDate = Convert.ToDateTime(taskdate + " " + starttime);//start);//.AddHours(-4);
            tsk.dtEndDate = Convert.ToDateTime(taskdate + " " + endtime);//.AddHours (-4);
            tsk.dtCreation = DateTime.Now;
            tsk.strTitle = title;
            tsk.strComment = body;

            //tsk.id_Product_Project = prod_proj;
            tsk.Service_id = service;
            tsk.Resource_id = getUserbyName(User.Identity.Name);


            // Add Items to Repository
            _repository.Add(tsk);

            // Persist Changes
            _repository.Save();

            return null;
        }
        private static void WriteJsonArrayItem(JsonWriter writer, string id, string start,
            string end, string title, string body, string client, string project, string product, string service)
        {
            writer.WriteStartObject();                       //              {
            WriteJsonArrayfield(writer, "id", id);           //             "id": "1",
            WriteJsonArrayfield(writer, "start", start);     //             "start": "2009-08-08T15:30:00",
            WriteJsonArrayfield(writer, "end", end);         //             "end": "2009-08-08T17:30:00",
            WriteJsonArrayfield(writer, "title", title);     //             "title": "This is a JSon TEST",
            WriteJsonArrayfield(writer, "body", body);       //             "title": "Body for JSon TEST"
            WriteJsonArrayfield(writer, "client", client);   //             "client": "1"
            WriteJsonArrayfield(writer, "project", project); //             "project": "1"
            WriteJsonArrayfield(writer, "product", product); //             "product": "1"
            WriteJsonArrayfield(writer, "service", service); //             "service": "1"
            writer.WriteEndObject();                         //              }
        }

        private static void WriteJsonArrayfield(JsonWriter writer, string title, string txt)
        {
            writer.WritePropertyName(title); //      "title" : 
            writer.WriteValue(txt);   //          "text", 
        }

        private int getUserbyName(string username)
        {
            if (username != "")
            {        
                System.Collections.IEnumerator members = Membership.FindUsersByName(username).GetEnumerator();

                members.MoveNext();

                Guid MembershipUserID = (Guid)((MembershipUser)members.Current).ProviderUserKey;

                Resource user = _repository.GetResource(MembershipUserID);

                return user.id;
            }
            else
            {
                return 1; //TODO: Create a real authentication process. This is only for test.
            }
        }
    }
}
